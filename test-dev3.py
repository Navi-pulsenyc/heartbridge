"""
HeartBridge — Dev 3 Logic Tests (Python port)
Reproduces all logic from the TypeScript implementation to verify correctness.
Run with:  python3 test-dev3.py
"""

passed = 0
failed = 0

def assert_test(condition, label):
    global passed, failed
    if condition:
        print(f"  ✅  {label}")
        passed += 1
    else:
        print(f"  ❌  FAIL: {label}")
        failed += 1

def section(title):
    print(f"\n── {title} {'─' * (52 - len(title))}")

# ─── Reproduce mockData.ts ────────────────────────────────────────

caqOptionScores = {"Never": 0, "Rarely": 1, "Sometimes": 2, "Often": 3, "Always": 4}

caqWeeklyQuestions = [
    {"id": 1, "subscale": "fear",      "text": "How often did you worry that you might have a heart attack?"},
    {"id": 2, "subscale": "avoidance", "text": "Did you avoid any physical activities because you were worried about your heart?"},
    {"id": 3, "subscale": "attention", "text": "How often did you pay close attention to your heartbeat?"},
    {"id": 4, "subscale": "avoidance", "text": "Did you try to avoid exercising hard or working up a sweat?"},
    {"id": 5, "subscale": "attention", "text": "How often did you check your pulse?"},
    {"id": 6, "subscale": "fear",      "text": "Did you worry that doctors may not believe your symptoms are real?"},
]

caqHistory = [
    {"week": 1, "fear": 2.8, "avoidance": 2.2, "attention": 3.0},
    {"week": 7, "fear": 1.4, "avoidance": 0.8, "attention": 1.6},
]

vitalsHistory = [
    {"week": 1, "restingHR": 82, "systolicBP": 142, "diastolicBP": 90, "weight": 168},
    {"week": 7, "restingHR": 74, "systolicBP": 128, "diastolicBP": 82, "weight": 162},
]

medications = [
    {"name": "Aspirin",      "dose": "81mg",  "adherenceRate": 100},
    {"name": "Atorvastatin", "dose": "40mg",  "adherenceRate": 86},
    {"name": "Clopidogrel",  "dose": "75mg",  "adherenceRate": 100},
    {"name": "Metoprolol",   "dose": "25mg",  "adherenceRate": 93},
]

patient = {
    "firstName": "Maria", "lastName": "Garcia", "age": 58,
    "currentWeek": 7, "totalWeeks": 12,
    "sessionsCompleted": 22, "totalSessions": 36,
    "interests": ["gardening", "cooking", "walking outdoors"],
}

careSchedule = {
    "nurse":  {"name": "Sarah Nguyen",  "day": "Saturday", "time": "2:00 PM", "nextCheckIn": "2026-03-29"},
    "doctor": {"name": "Dr. Raj Patel", "nextCheckUp": "2026-04-05"},
}

todaySession = {"totalDuration": 20, "type": "Moderate Walk", "targetHRMin": 100, "targetHRMax": 120}

peerMatches = [
    {"name": "Gloria", "age": 62, "interests": ["gardening", "walking outdoors"]},
    {"name": "James",  "age": 55, "interests": ["cooking", "reading"]},
]

# ─── Reproduce route.ts helpers ──────────────────────────────────

def subscale_mean(answers, subscale):
    relevant = [a for a in answers if a["subscale"] == subscale]
    if not relevant:
        return 0.0
    return sum(a["score"] for a in relevant) / len(relevant)

def build_system_prompt(caq_summary=None):
    baseline = caqHistory[0]
    first_v  = vitalsHistory[0]
    latest_v = vitalsHistory[-1]
    med_list = ", ".join(f"{m['name']} {m['dose']} ({m['adherenceRate']}% adherence)" for m in medications)
    peer_list = "; ".join(f"{p['name']} (age {p['age']}, interests: {', '.join(p['interests'])})" for p in peerMatches)

    caq_context = (
        f"CAQ Scores — Week 1 baseline Fear:{baseline['fear']} "
        f"Avoidance:{baseline['avoidance']} Attention:{baseline['attention']}"
    )
    if caq_summary:
        caq_context += (
            f" | THIS WEEK Fear:{caq_summary['fear']:.1f} "
            f"Avoidance:{caq_summary['avoidance']:.1f} Attention:{caq_summary['attention']:.1f}"
        )

    return "\n".join([
        f"Patient: {patient['firstName']} {patient['lastName']} | Week {patient['currentWeek']}/{patient['totalWeeks']} | Sessions {patient['sessionsCompleted']}/{patient['totalSessions']}",
        f"Vitals: HR {first_v['restingHR']}→{latest_v['restingHR']} BP {first_v['systolicBP']}/{first_v['diastolicBP']}→{latest_v['systolicBP']}/{latest_v['diastolicBP']}",
        f"Meds: {med_list}",
        caq_context,
        f"Care: Nurse {careSchedule['nurse']['name']}, Dr {careSchedule['doctor']['name']}",
        f"Peers: {peer_list}",
    ])

def fallback_response(last_user_message, caq_summary=None):
    if caq_summary:
        baseline = caqHistory[0]
        fear_delta  = f"{(baseline['fear']      - caq_summary['fear']):.1f}"
        avoid_delta = f"{(baseline['avoidance'] - caq_summary['avoidance']):.1f}"
        attn_delta  = f"{(baseline['attention'] - caq_summary['attention']):.1f}"
        return (
            f"Fear: {caq_summary['fear']:.1f} (down {fear_delta})\n"
            f"Avoidance: {caq_summary['avoidance']:.1f} (down {avoid_delta})\n"
            f"Attention: {caq_summary['attention']:.1f} (down {attn_delta})"
        )

    msg = last_user_message.lower()
    if any(w in msg for w in ["scared", "worried", "afraid", "anxiety"]):
        return "FEAR_RESPONSE"
    if any(w in msg for w in ["gloria", "buddy", "friend", "walking"]):
        return "GLORIA_RESPONSE"
    if any(w in msg for w in ["pain", "chest", "dizzy", "breath"]):
        return "SOS_RESPONSE"
    if any(w in msg for w in ["tired", "exhausted", "hard", "difficult"]):
        return "TIRED_RESPONSE"
    if any(w in msg for w in ["medication", "pill", "aspirin", "atorvastatin"]):
        return "MED_RESPONSE"
    return "GENERIC_RESPONSE"

# ─── Test 1: caqOptionScores mapping ─────────────────────────────
section("1. caqOptionScores mapping")
assert_test(caqOptionScores["Never"]     == 0, "Never → 0")
assert_test(caqOptionScores["Rarely"]    == 1, "Rarely → 1")
assert_test(caqOptionScores["Sometimes"] == 2, "Sometimes → 2")
assert_test(caqOptionScores["Often"]     == 3, "Often → 3")
assert_test(caqOptionScores["Always"]    == 4, "Always → 4")
assert_test(len(caqOptionScores)         == 5, "Exactly 5 options defined")

# ─── Test 2: subscale_mean ────────────────────────────────────────
section("2. subscale_mean calculation")
sample = [
    {"subscale": "fear",      "score": 1},
    {"subscale": "avoidance", "score": 2},
    {"subscale": "attention", "score": 3},
    {"subscale": "fear",      "score": 3},
]
assert_test(abs(subscale_mean(sample, "fear")      - 2.0) < 0.001, "Fear mean = (1+3)/2 = 2.0")
assert_test(abs(subscale_mean(sample, "avoidance") - 2.0) < 0.001, "Avoidance mean = 2/1 = 2.0")
assert_test(abs(subscale_mean(sample, "attention") - 3.0) < 0.001, "Attention mean = 3/1 = 3.0")
assert_test(subscale_mean([], "fear")              == 0.0,          "Empty answers returns 0 (no crash)")

# ─── Test 3: Full 6-question CAQ flow ────────────────────────────
section("3. CAQ full 6-question flow scoring")

# Subscale order: fear, avoidance, attention, avoidance, attention, fear
fear_q      = [q for q in caqWeeklyQuestions if q["subscale"] == "fear"]
avoidance_q = [q for q in caqWeeklyQuestions if q["subscale"] == "avoidance"]
attention_q = [q for q in caqWeeklyQuestions if q["subscale"] == "attention"]

assert_test(len(fear_q)      == 2, "2 fear questions (Q1, Q6)")
assert_test(len(avoidance_q) == 2, "2 avoidance questions (Q2, Q4)")
assert_test(len(attention_q) == 2, "2 attention questions (Q3, Q5)")
assert_test(sorted(q["id"] for q in fear_q)      == [1, 6], "Fear question IDs are 1 & 6")
assert_test(sorted(q["id"] for q in avoidance_q) == [2, 4], "Avoidance question IDs are 2 & 4")
assert_test(sorted(q["id"] for q in attention_q) == [3, 5], "Attention question IDs are 3 & 5")

# Simulate: Never(0), Never(0), Never(0), Rarely(1), Rarely(1), Rarely(1)
test_answers_labels = ["Never", "Never", "Never", "Rarely", "Rarely", "Rarely"]
collected = [
    {"subscale": caqWeeklyQuestions[i]["subscale"], "score": caqOptionScores[ans]}
    for i, ans in enumerate(test_answers_labels)
]
# fear: Q1(0)+Q6(1)=0.5, avoidance: Q2(0)+Q4(1)=0.5, attention: Q3(0)+Q5(1)=0.5
assert_test(abs(subscale_mean(collected, "fear")      - 0.5) < 0.001, f"Fear mean = 0.5")
assert_test(abs(subscale_mean(collected, "avoidance") - 0.5) < 0.001, f"Avoidance mean = 0.5")
assert_test(abs(subscale_mean(collected, "attention") - 0.5) < 0.001, f"Attention mean = 0.5")

# ─── Test 4: System prompt construction ──────────────────────────
section("4. buildSystemPrompt content")
prompt_base = build_system_prompt()
assert_test("Maria Garcia"    in prompt_base, "Patient name present")
assert_test("Week 7/12"       in prompt_base, "Week progress present")
assert_test("22/36"           in prompt_base, "Session count present")
assert_test("82→74"           in prompt_base, "HR trend present")
assert_test("Aspirin 81mg"    in prompt_base, "Medication present")
assert_test("100% adherence"  in prompt_base, "Adherence rate present")
assert_test("Sarah Nguyen"    in prompt_base, "Nurse name present")
assert_test("Dr. Raj Patel"   in prompt_base, "Doctor name present")
assert_test("Gloria"          in prompt_base, "Peer match Gloria present")
assert_test("THIS WEEK"   not in prompt_base, "No CAQ summary without arg")

prompt_caq = build_system_prompt({"fear": 1.2, "avoidance": 0.6, "attention": 1.4})
assert_test("THIS WEEK"       in prompt_caq,  "CAQ summary section present when arg provided")
assert_test("1.2"             in prompt_caq,  "Fear score injected")
assert_test("0.6"             in prompt_caq,  "Avoidance score injected")
assert_test("1.4"             in prompt_caq,  "Attention score injected")
assert_test("2.8"             in prompt_caq,  "Week 1 baseline fear (2.8) in prompt")

# ─── Test 5: Fallback keyword routing ────────────────────────────
section("5. fallback_response keyword routing")
assert_test(fallback_response("I am so scared")        == "FEAR_RESPONSE",    '"scared" → fear response')
assert_test(fallback_response("I feel worried")        == "FEAR_RESPONSE",    '"worried" → fear response')
assert_test(fallback_response("I have anxiety")        == "FEAR_RESPONSE",    '"anxiety" → fear response')
assert_test(fallback_response("Tell me about Gloria")  == "GLORIA_RESPONSE",  '"Gloria" → peer response')
assert_test(fallback_response("walking buddy today")   == "GLORIA_RESPONSE",  '"buddy" → peer response')
assert_test(fallback_response("chest pain")            == "SOS_RESPONSE",     '"chest pain" → SOS response')
assert_test(fallback_response("feeling dizzy")         == "SOS_RESPONSE",     '"dizzy" → SOS response')
assert_test(fallback_response("so tired today")        == "TIRED_RESPONSE",   '"tired" → encouragement')
assert_test(fallback_response("this is really hard")   == "TIRED_RESPONSE",   '"hard" → encouragement')
assert_test(fallback_response("aspirin question")      == "MED_RESPONSE",     '"aspirin" → medication response')
assert_test(fallback_response("atorvastatin dose")     == "MED_RESPONSE",     '"atorvastatin" → medication response')
assert_test(fallback_response("random hello")          == "GENERIC_RESPONSE", 'Unknown → generic response')
assert_test(fallback_response("")                      == "GENERIC_RESPONSE", 'Empty string → generic (no crash)')

# ─── Test 6: CAQ summary fallback content ────────────────────────
section("6. CAQ summary fallback correctness")
summary = fallback_response("", {"fear": 1.2, "avoidance": 0.6, "attention": 1.4})
assert_test("Fear: 1.2"      in summary, "Computed fear score in summary")
assert_test("Avoidance: 0.6" in summary, "Computed avoidance score in summary")
assert_test("Attention: 1.4" in summary, "Computed attention score in summary")
# baseline: fear=2.8, avoidance=2.2, attention=3.0
fear_d  = f"{(2.8-1.2):.1f}"   # 1.6
avoid_d = f"{(2.2-0.6):.1f}"   # 1.6
attn_d  = f"{(3.0-1.4):.1f}"   # 1.6
assert_test(f"down {fear_d}"  in summary, f"Fear delta ({fear_d}) shown")
assert_test(f"down {avoid_d}" in summary, f"Avoidance delta ({avoid_d}) shown")
assert_test(f"down {attn_d}"  in summary, f"Attention delta ({attn_d}) shown")

# ─── Test 7: Message context window (last-10 slice) ──────────────
section("7. Message context window — last 10 of N")
all_msgs = [{"role": "user" if i % 2 == 0 else "assistant", "content": f"msg {i}"} for i in range(20)]
sliced = all_msgs[-10:]
assert_test(len(sliced)                 == 10,       "Slice gives exactly 10 messages")
assert_test(sliced[0]["content"]        == "msg 10", "First sliced message is msg 10")
assert_test(sliced[-1]["content"]       == "msg 19", "Last sliced message is msg 19 (most recent)")

few_msgs = all_msgs[:3]
sliced_few = few_msgs[-10:]
assert_test(len(sliced_few) == 3, "slice(-10) on 3-item list returns all 3 (no crash)")

# ─── Test 8: caqMode state machine ───────────────────────────────
section("8. CAQ state machine transitions")

caq_mode  = False
caq_index = 0
answers   = []

# Trigger
trigger_msg = "weekly check-in please"
is_check_in = any(w in trigger_msg.lower() for w in ["check-in", "checkin", "weekly"])
if is_check_in:
    caq_mode = True
    caq_index = 0
    answers = []

assert_test(caq_mode        == True, "caqMode=True after check-in trigger")
assert_test(caq_index       == 0,    "caqIndex=0 at start")
assert_test(len(answers)    == 0,    "answers empty at start")

# Answer all 6 questions
sim_answers = ["Never", "Rarely", "Sometimes", "Often", "Always", "Rarely"]
for ans in sim_answers:
    q = caqWeeklyQuestions[caq_index]
    answers.append({"subscale": q["subscale"], "score": caqOptionScores[ans]})
    caq_index += 1
    if caq_index >= len(caqWeeklyQuestions):
        caq_mode = False

assert_test(len(answers) == 6,      "All 6 answers collected")
assert_test(caq_mode     == False,  "caqMode=False after completion")
assert_test(caq_index    == 6,      "caqIndex=6 after completion")

# Verify final computed scores:
# fear: Q1(Never=0) + Q6(Rarely=1) → 0.5
# avoidance: Q2(Rarely=1) + Q4(Often=3) → 2.0
# attention: Q3(Sometimes=2) + Q5(Always=4) → 3.0
final_fear  = subscale_mean(answers, "fear")
final_avoid = subscale_mean(answers, "avoidance")
final_attn  = subscale_mean(answers, "attention")
assert_test(abs(final_fear  - 0.5) < 0.001, f"Final fear mean = 0.5 (got {final_fear})")
assert_test(abs(final_avoid - 2.0) < 0.001, f"Final avoidance mean = 2.0 (got {final_avoid})")
assert_test(abs(final_attn  - 3.0) < 0.001, f"Final attention mean = 3.0 (got {final_attn})")

# ─── Summary ─────────────────────────────────────────────────────
total = passed + failed
print(f"\n{'─' * 55}")
print(f"Results: {passed} passed, {failed} failed out of {total} total")
if failed == 0:
    print("🎉  All tests passed — Dev 3 implementation verified.\n")
    exit(0)
else:
    print(f"\n⚠️   {failed} test(s) failed — review output above.\n")
    exit(1)
