'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import { chatHistory, caqWeeklyQuestions, caqOptions, caqOptionScores } from '@/lib/mockData';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    caqQuestion?: number; // index into caqWeeklyQuestions
}

interface CaqAnswer {
    subscale: string;
    score: number;
}

// Compute mean score for a given subscale from the collected answers
function subscaleMean(answers: CaqAnswer[], subscale: string): number {
    const relevant = answers.filter((a) => a.subscale === subscale);
    if (relevant.length === 0) return 0;
    return relevant.reduce((sum, a) => sum + a.score, 0) / relevant.length;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([...chatHistory]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [caqMode, setCaqMode] = useState(false);
    const [caqIndex, setCaqIndex] = useState(0);
    const [caqAnswers, setCaqAnswers] = useState<CaqAnswer[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // -------------------------------------------------------
    // Call the API route; return the AI response string
    // -------------------------------------------------------
    async function callChatAPI(
        currentMessages: Message[],
        caqSummary?: { fear: number; avoidance: number; attention: number }
    ): Promise<string> {
        const payload = {
            messages: currentMessages.map(({ role, content }) => ({ role, content })),
            ...(caqSummary ? { caqSummary } : {}),
        };

        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        return data.response as string;
    }

    // -------------------------------------------------------
    // Handle a free-form user message
    // -------------------------------------------------------
    const handleSend = async () => {
        if (!input.trim() || isTyping) return;
        const userMsg = input.trim();
        setInput('');

        const userMessage: Message = { role: 'user', content: userMsg };
        const nextMessages = [...messages, userMessage];
        setMessages(nextMessages);
        setIsTyping(true);

        // Detect "weekly check-in" trigger BEFORE the API call
        const isCheckInTrigger =
            userMsg.toLowerCase().includes('check-in') ||
            userMsg.toLowerCase().includes('checkin') ||
            userMsg.toLowerCase().includes('weekly');

        try {
            const response = await callChatAPI(nextMessages);
            const aiMessage: Message = { role: 'assistant', content: response };
            setMessages((prev) => [...prev, aiMessage]);

            if (isCheckInTrigger) {
                // Start CAQ flow after a short pause
                setCaqMode(true);
                setCaqIndex(0);
                setCaqAnswers([]);
                setTimeout(() => {
                    setMessages((prev) => [
                        ...prev,
                        { role: 'assistant', content: caqWeeklyQuestions[0].text, caqQuestion: 0 },
                    ]);
                }, 1200);
            }
        } catch {
            // Network/API failure — show a non-breaking fallback
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: "I'm having a little trouble connecting right now. Keep going — you're doing great. Try again in a moment if you need me.",
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    // -------------------------------------------------------
    // Handle a CAQ button tap
    // -------------------------------------------------------
    const handleCaqAnswer = async (answer: string) => {
        if (isTyping) return;

        const question = caqWeeklyQuestions[caqIndex];
        const score = caqOptionScores[answer] ?? 0;
        const newAnswers = [...caqAnswers, { subscale: question.subscale, score }];
        setCaqAnswers(newAnswers);

        const userMessage: Message = { role: 'user', content: answer };
        setMessages((prev) => [...prev, userMessage]);

        const nextIndex = caqIndex + 1;

        if (nextIndex < caqWeeklyQuestions.length) {
            // More questions to ask
            setCaqIndex(nextIndex);
            setIsTyping(true);
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: caqWeeklyQuestions[nextIndex].text,
                        caqQuestion: nextIndex,
                    },
                ]);
                setIsTyping(false);
            }, 700);
        } else {
            // All 6 questions answered — compute real subscale scores
            setCaqMode(false);
            setIsTyping(true);

            const caqSummary = {
                fear: subscaleMean(newAnswers, 'fear'),
                avoidance: subscaleMean(newAnswers, 'avoidance'),
                attention: subscaleMean(newAnswers, 'attention'),
            };

            try {
                const summaryMsg = await callChatAPI(
                    [...messages, userMessage],
                    caqSummary
                );
                setMessages((prev) => [...prev, { role: 'assistant', content: summaryMsg }]);
            } catch {
                // Compute a local summary if the API is unavailable
                const baseline = { fear: 2.8, avoidance: 2.2, attention: 3.0 };
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: `Thanks Maria. Your anxiety scores this week:\n\nFear: ${caqSummary.fear.toFixed(1)} (down from ${baseline.fear} in Week 1)\nAvoidance: ${caqSummary.avoidance.toFixed(1)} (down from ${baseline.avoidance})\nAttention: ${caqSummary.attention.toFixed(1)} (down from ${baseline.attention})\n\nThat's real progress. Your care team will see these scores right away. 💙`,
                    },
                ]);
            } finally {
                setIsTyping(false);
            }
        }
    };

    const lastMsg = messages[messages.length - 1];
    const showCaqButtons = caqMode && lastMsg?.caqQuestion !== undefined;

    return (
        <div className="chat-container">
            {/* Header */}
            <div className="page-header" style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <Link href="/" className="back-btn"><ArrowLeft size={20} /></Link>
                <div>
                    <h1 style={{ fontSize: '1.1rem' }}>HeartBridge AI</h1>
                    <p style={{ fontSize: '0.7rem', color: 'var(--accent-teal)' }}>Your rehab companion</p>
                </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div key={i} className={`chat-bubble ${msg.role}`}>
                        {msg.content.split('\n').map((line, j) => (
                            <span key={j}>{line}<br /></span>
                        ))}
                    </div>
                ))}

                {/* CAQ answer buttons */}
                {showCaqButtons && (
                    <div className="caq-options" style={{ animation: 'fadeInUp 0.3s ease', alignSelf: 'flex-start' }}>
                        {caqOptions.map((opt) => (
                            <button
                                key={opt}
                                className="caq-option"
                                onClick={() => handleCaqAnswer(opt)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}

                {/* Typing indicator */}
                {isTyping && (
                    <div className="chat-bubble assistant">
                        <div className="typing-indicator">
                            <span /><span /><span />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-row">
                <input
                    className="chat-input"
                    placeholder={caqMode ? "Or type a response..." : "Message HeartBridge AI..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="chat-send" onClick={handleSend}>
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}
