// ============================================================
// HeartBridge — Mock Data Layer
// All app data lives here. No backend.
// ============================================================

// ---- Maria's Profile ----
export const patient = {
  id: 'p001',
  firstName: 'Maria',
  lastName: 'Garcia',
  age: 58,
  avatar: '👩🏽',
  diagnosis: 'PCI with stent placement',
  icdCode: 'Z95.5',
  procedureDate: '2026-02-01',
  enrollmentDate: '2026-02-08',
  currentWeek: 7,
  totalWeeks: 12,
  sessionsCompleted: 22,
  totalSessions: 36,
  preferredHospital: 'Mount Sinai Heart',
  address: '432 E 74th St, Apt 6B, New York, NY 10021',
  phone: '(212) 555-0147',
  interests: ['gardening', 'cooking', 'walking outdoors'],
  learningGoals: ['heart-healthy cooking', 'stress management'],
  connectPreferences: ['people my age', 'people with similar hobbies'],
};

// ---- Care Schedule ----
export const careSchedule = {
  nurse: {
    name: 'Sarah Nguyen',
    role: 'Cardiac Rehab Nurse',
    avatar: '👩‍⚕️',
    frequency: 'weekly',
    day: 'Saturday',
    time: '2:00 PM',
    lastCheckIn: '2026-03-22',
    nextCheckIn: '2026-03-29',
    phone: '(212) 555-0234',
  },
  doctor: {
    name: 'Dr. Raj Patel',
    role: 'Cardiologist',
    avatar: '👨‍⚕️',
    frequency: 'every 4 weeks',
    lastCheckUp: '2026-03-08',
    nextCheckUp: '2026-04-05',
    phone: '(212) 555-0189',
  },
};

// ---- Medications ----
export const medications = [
  {
    id: 'med1',
    name: 'Aspirin',
    dose: '81mg',
    frequency: 'Once daily',
    times: ['08:00'],
    takenToday: [true],
    adherenceRate: 100,
    icon: '💊',
  },
  {
    id: 'med2',
    name: 'Atorvastatin',
    dose: '40mg',
    frequency: 'Once daily',
    times: ['20:00'],
    takenToday: [false],
    adherenceRate: 86,
    icon: '💊',
  },
  {
    id: 'med3',
    name: 'Clopidogrel',
    dose: '75mg',
    frequency: 'Once daily',
    times: ['08:00'],
    takenToday: [true],
    adherenceRate: 100,
    icon: '💊',
  },
  {
    id: 'med4',
    name: 'Metoprolol',
    dose: '25mg',
    frequency: 'Twice daily',
    times: ['08:00', '20:00'],
    takenToday: [true, false],
    adherenceRate: 93,
    icon: '💊',
  },
];

// ---- Vitals History (8 weeks) ----
export const vitalsHistory = [
  { week: 1, restingHR: 82, systolicBP: 142, diastolicBP: 90, weight: 168, spo2: 95 },
  { week: 2, restingHR: 80, systolicBP: 138, diastolicBP: 88, weight: 167, spo2: 96 },
  { week: 3, restingHR: 78, systolicBP: 136, diastolicBP: 86, weight: 166, spo2: 96 },
  { week: 4, restingHR: 77, systolicBP: 134, diastolicBP: 85, weight: 165, spo2: 97 },
  { week: 5, restingHR: 76, systolicBP: 132, diastolicBP: 84, weight: 164, spo2: 96 },
  { week: 6, restingHR: 75, systolicBP: 130, diastolicBP: 83, weight: 163, spo2: 97 },
  { week: 7, restingHR: 74, systolicBP: 128, diastolicBP: 82, weight: 162, spo2: 97 },
];

export const todayVitals = {
  bloodPressure: { systolic: 128, diastolic: 82, logged: true },
  bloodSugar: { value: null, logged: false },
  weight: { value: 162, logged: true },
  spo2: { value: null, logged: false },
  heartRate: { value: 74, auto: true },
};

// ---- Today's Exercise Session ----
export const todaySession = {
  day: 24,
  type: 'Moderate Walk',
  totalDuration: 20,
  targetHRMin: 100,
  targetHRMax: 120,
  phases: [
    { name: 'Warm Up', duration: 3, instruction: 'Walk gently at a comfortable pace. Let your body ease into it.' },
    { name: 'Main Walk', duration: 15, instruction: 'Pick up your pace a little. You should be able to talk but feel slightly out of breath.' },
    { name: 'Cool Down', duration: 2, instruction: 'Slow down gradually. Let your heart rate come back down.' },
    { name: 'Stretch', duration: 3, instruction: 'Follow the stretching guide. Hold each stretch for 15-20 seconds.' },
  ],
};

// ---- Exercise Library ----
export const exerciseLibrary = [
  { id: 'ex1', name: 'Walking (moderate)', icon: '🚶', duration: '15-25 min', frequency: '3-4x per week' },
  { id: 'ex2', name: 'Stretching routine', icon: '🧘', duration: '5 min', frequency: 'after every walk' },
  { id: 'ex3', name: 'Resistance bands', icon: '💪', duration: '10 min', frequency: '2x per week' },
  { id: 'ex4', name: 'Seated exercises', icon: '🪑', duration: '10 min', frequency: 'rest days' },
];

// ---- Recovery Milestones ----
export const milestones = [
  { week: 1, title: '10-minute walk', description: 'Your first full session', achieved: true },
  { week: 2, title: '15-minute walk', description: 'Building endurance', achieved: true },
  { week: 3, title: 'Walk to the mailbox', description: 'A real-world win', achieved: true },
  { week: 4, title: '30-min grocery trip', description: 'Independent errand', achieved: true },
  { week: 5, title: '20-minute walk', description: 'Faster recovery', achieved: true },
  { week: 6, title: 'Walk in the park', description: '25 minutes outdoors', achieved: true },
  { week: 7, title: '30-minute park walk', description: 'Your new normal', achieved: false, current: true },
  { week: 8, title: 'Take the stairs', description: 'One flight, no rush', achieved: false },
  { week: 10, title: 'Walk with a friend', description: 'Social activity', achieved: false },
  { week: 12, title: 'Graduation', description: 'You did it!', achieved: false },
];

// ---- CAQ Scores (weekly) ----
export const caqHistory = [
  { week: 1, fear: 2.8, avoidance: 2.2, attention: 3.0, total: 2.67 },
  { week: 2, fear: 2.6, avoidance: 2.0, attention: 2.8, total: 2.47 },
  { week: 3, fear: 2.2, avoidance: 1.8, attention: 2.4, total: 2.13 },
  { week: 4, fear: 2.0, avoidance: 1.6, attention: 2.2, total: 1.93 },
  { week: 5, fear: 1.8, avoidance: 1.2, attention: 2.0, total: 1.67 },
  { week: 6, fear: 1.6, avoidance: 1.0, attention: 1.8, total: 1.47 },
  { week: 7, fear: 1.4, avoidance: 0.8, attention: 1.6, total: 1.27 },
];

export const caqWeeklyQuestions = [
  { id: 1, subscale: 'fear', text: 'How often did you worry that you might have a heart attack?' },
  { id: 2, subscale: 'avoidance', text: 'Did you avoid any physical activities because you were worried about your heart?' },
  { id: 3, subscale: 'attention', text: 'How often did you pay close attention to your heartbeat?' },
  { id: 4, subscale: 'avoidance', text: 'Did you try to avoid exercising hard or working up a sweat?' },
  { id: 5, subscale: 'attention', text: 'How often did you check your pulse?' },
  { id: 6, subscale: 'fear', text: 'Did you worry that doctors may not believe your symptoms are real?' },
];

export const caqOptions = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];

export const caqOptionScores: Record<string, number> = {
  Never: 0, Rarely: 1, Sometimes: 2, Often: 3, Always: 4,
};

// ---- PHQ Mood Scores ----
export const phqHistory = [
  { week: 1, score: 8 },
  { week: 2, score: 7 },
  { week: 3, score: 6 },
  { week: 4, score: 6 },
  { week: 5, score: 5 },
  { week: 6, score: 4 },
  { week: 7, score: 4 },
];

// ---- Nutrition Tips ----
export const nutritionTip = {
  week: 7,
  title: 'Try almonds instead of chips',
  description: 'A handful of unsalted almonds has heart-healthy fats and fiber. Swap them for chips during your afternoon snack.',
  icon: '🥗',
};

// ---- Peer Matches (Community) ----
export const peerMatches = [
  {
    id: 'peer1',
    name: 'Gloria',
    age: 62,
    week: 6,
    avatar: '👩🏻',
    interests: ['gardening', 'walking outdoors'],
    matchScore: 92,
    recentMessage: 'Week 6 was hard for me too. But I kept going. You can too.',
  },
  {
    id: 'peer2',
    name: 'James',
    age: 55,
    week: 4,
    avatar: '👨🏾',
    interests: ['cooking', 'reading'],
    matchScore: 78,
    recentMessage: 'Started a heart-healthy recipe group! Want to join?',
  },
  {
    id: 'peer3',
    name: 'Linda',
    age: 60,
    week: 8,
    avatar: '👩🏼',
    interests: ['yoga', 'walking outdoors'],
    matchScore: 85,
    recentMessage: 'Just hit my stair-climbing milestone today 🎉',
  },
];

// ---- Family Circle ----
export const familyCircle = {
  members: [
    {
      id: 'fam1',
      name: 'Sarah Garcia',
      relation: 'Daughter',
      avatar: '👩',
      phone: '(212) 555-0321',
      canSee: ['milestones', 'sessions'],
      cannotSee: ['vitals', 'anxiety', 'medical'],
      recentMessage: 'So proud of you mom! 💙',
      messageDate: '2 days ago',
    },
  ],
  recentShares: [
    { type: 'milestone', text: 'Week 6 milestone', date: '5 days ago' },
  ],
};

// ---- Nearby Hospitals ----
export const hospitals = [
  {
    id: 'h1',
    name: 'Mount Sinai Heart',
    address: '1190 5th Ave, New York, NY',
    driveTime: '12 min',
    erPhone: '(212) 241-6500',
    preferred: true,
  },
  {
    id: 'h2',
    name: 'NYP Weill Cornell',
    address: '525 E 68th St, New York, NY',
    driveTime: '18 min',
    erPhone: '(212) 746-5454',
    preferred: false,
  },
  {
    id: 'h3',
    name: 'Lenox Hill Hospital',
    address: '100 E 77th St, New York, NY',
    driveTime: '15 min',
    erPhone: '(212) 434-2000',
    preferred: false,
  },
];

// ---- Emergency Data Packet ----
export const emergencyProfile = {
  name: 'Maria Garcia',
  age: 58,
  address: '432 E 74th St, Apt 6B, New York, NY 10021',
  cardiacHistory: 'PCI with stent placement (Feb 1, 2026)',
  medications: 'Aspirin 81mg, Atorvastatin 40mg, Clopidogrel 75mg, Metoprolol 25mg',
  preferredHospital: 'Mount Sinai Heart — (212) 241-6500',
  emergencyContact: 'Sarah Garcia (daughter) — (212) 555-0321',
  cardiologist: 'Dr. Raj Patel — (212) 555-0189',
};

// ---- Escalation Timings ----
export const ESCALATION = {
  GENTLE_PROMPT: 30,    // seconds
  NURSE_CALL: 45,
  EMERGENCY_911: 75,
};

// ---- Pre-seeded Chat Messages ----
export const chatHistory = [
  {
    role: 'assistant' as const,
    content: "Good morning, Maria! Ready for Day 24? You've been doing amazing — your resting heart rate went from 82 to 74 since Week 1. That's your heart getting more efficient. Today's session is a 20-minute moderate walk. How are you feeling?",
  },
  {
    role: 'user' as const,
    content: "I'm feeling pretty good today! A little tired but motivated.",
  },
  {
    role: 'assistant' as const,
    content: "That's wonderful to hear! A little tiredness is normal — your body is still healing and getting stronger every day. Remember, Week 1 you could only manage 10 minutes. Yesterday you did 22. That's more than double! 💪\n\nYour target heart rate today is 100-120 bpm. If you feel dizzy or chest pain at any point, stop immediately and tap the SOS button. But you've been handling these walks beautifully.\n\nBy the way, I noticed Gloria — she's 62 and loves gardening just like you — just joined HeartBridge. She's in Week 6. Would you like me to suggest a walking session together sometime?",
  },
];

// ---- Clinician Patient List ----
export type PatientStatus = 'green' | 'yellow' | 'red';

export interface ClinicianPatient {
  id: string;
  name: string;
  age: number;
  week: number;
  avatar: string;
  status: PatientStatus;
  sessionsCompleted: number;
  totalSessions: number;
  restingHR: number;
  restingHRTrend: string;
  caqFear: number;
  caqAvoidance: number;
  phqScore: number;
  medAdherence: number;
  lastAlert?: string;
}

export const clinicianPatients: ClinicianPatient[] = [
  { id: 'p001', name: 'Maria Garcia', age: 58, week: 7, avatar: '👩🏽', status: 'green', sessionsCompleted: 22, totalSessions: 36, restingHR: 74, restingHRTrend: '82→74', caqFear: 1.4, caqAvoidance: 0.8, phqScore: 4, medAdherence: 95 },
  { id: 'p002', name: 'Robert Chen', age: 65, week: 5, avatar: '👨🏻', status: 'green', sessionsCompleted: 14, totalSessions: 36, restingHR: 78, restingHRTrend: '86→78', caqFear: 1.2, caqAvoidance: 0.6, phqScore: 3, medAdherence: 100 },
  { id: 'p003', name: 'Patricia Williams', age: 71, week: 9, avatar: '👩🏿', status: 'green', sessionsCompleted: 26, totalSessions: 36, restingHR: 72, restingHRTrend: '80→72', caqFear: 0.8, caqAvoidance: 0.4, phqScore: 2, medAdherence: 98 },
  { id: 'p004', name: 'James Thompson', age: 52, week: 3, avatar: '👨🏾', status: 'green', sessionsCompleted: 8, totalSessions: 36, restingHR: 80, restingHRTrend: '88→80', caqFear: 2.0, caqAvoidance: 1.4, phqScore: 5, medAdherence: 92 },
  { id: 'p005', name: 'Susan Kim', age: 63, week: 11, avatar: '👩🏻', status: 'green', sessionsCompleted: 32, totalSessions: 36, restingHR: 68, restingHRTrend: '76→68', caqFear: 0.6, caqAvoidance: 0.2, phqScore: 1, medAdherence: 100 },
  { id: 'p006', name: 'Michael Brown', age: 59, week: 6, avatar: '👨🏽', status: 'green', sessionsCompleted: 17, totalSessions: 36, restingHR: 76, restingHRTrend: '84→76', caqFear: 1.6, caqAvoidance: 1.0, phqScore: 4, medAdherence: 88 },
  { id: 'p007', name: 'Helen Davis', age: 68, week: 4, avatar: '👩🏼', status: 'green', sessionsCompleted: 11, totalSessions: 36, restingHR: 79, restingHRTrend: '85→79', caqFear: 1.8, caqAvoidance: 1.2, phqScore: 5, medAdherence: 94 },
  { id: 'p008', name: 'David Martinez', age: 55, week: 8, avatar: '👨🏻', status: 'green', sessionsCompleted: 23, totalSessions: 36, restingHR: 73, restingHRTrend: '82→73', caqFear: 1.0, caqAvoidance: 0.6, phqScore: 3, medAdherence: 96 },
  { id: 'p009', name: 'Dorothy Wilson', age: 74, week: 6, avatar: '👩🏽', status: 'yellow', sessionsCompleted: 14, totalSessions: 36, restingHR: 80, restingHRTrend: '84→80', caqFear: 2.4, caqAvoidance: 1.8, phqScore: 6, medAdherence: 78, lastAlert: 'Missed 2 sessions this week' },
  { id: 'p010', name: 'Richard Taylor', age: 61, week: 4, avatar: '👨🏿', status: 'yellow', sessionsCompleted: 8, totalSessions: 36, restingHR: 82, restingHRTrend: '86→82', caqFear: 2.6, caqAvoidance: 2.0, phqScore: 7, medAdherence: 72, lastAlert: 'Med adherence dropped below 80%' },
  { id: 'p011', name: 'Barbara Anderson', age: 66, week: 7, avatar: '👩🏻', status: 'yellow', sessionsCompleted: 16, totalSessions: 36, restingHR: 81, restingHRTrend: '85→81', caqFear: 2.2, caqAvoidance: 2.2, phqScore: 8, medAdherence: 82, lastAlert: 'CAQ avoidance score spiked +1.2' },
  { id: 'p012', name: 'Thomas Jackson', age: 57, week: 5, avatar: '👨🏼', status: 'red', sessionsCompleted: 6, totalSessions: 36, restingHR: 86, restingHRTrend: '90→86', caqFear: 3.2, caqAvoidance: 2.8, phqScore: 12, medAdherence: 60, lastAlert: 'No activity for 5 days, PHQ score critical' },
];
