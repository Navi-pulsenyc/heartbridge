'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { todaySession, exerciseTutorials } from '@/lib/mockData';

type SessionState = 'pre' | 'active' | 'complete';

export default function ExercisePage() {
    const [state, setState] = useState<SessionState>('pre');
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [remaining, setRemaining] = useState(todaySession.phases[0].duration * 60);
    const [phaseElapsed, setPhaseElapsed] = useState(0);
    const [heartRate, setHeartRate] = useState(78);
    const [selectedTutorial, setSelectedTutorial] = useState(exerciseTutorials[0]);
    const carouselRef = useRef<HTMLDivElement>(null);

    const phase = todaySession.phases[phaseIndex];
    const phaseDuration = phase ? phase.duration * 60 : 0; // seconds

    // Simulate heart rate based on phase
    useEffect(() => {
        if (state !== 'active') return;
        const interval = setInterval(() => {
            setHeartRate((prev) => {
                const targets: Record<string, number> = {
                    'Warm Up': 88 + Math.random() * 6,
                    'Main Walk': 105 + Math.random() * 12,
                    'Cool Down': 82 + Math.random() * 6,
                    'Stretch': 76 + Math.random() * 4,
                };
                const target = targets[phase?.name] || 80;
                return Math.round(prev + (target - prev) * 0.15);
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [state, phase?.name]);

    // Countdown timer with automatic phase transitions.
    useEffect(() => {
        if (state !== 'active') return;

        if (!phase) {
            setState('complete');
            return;
        }

        const interval = setInterval(() => {
            setRemaining((prev) => {
                if (prev <= 1) {
                    if (phaseIndex < todaySession.phases.length - 1) {
                        const nextPhaseIndex = phaseIndex + 1;
                        setPhaseIndex(nextPhaseIndex);
                        setPhaseElapsed(0);
                        return todaySession.phases[nextPhaseIndex].duration * 60;
                    } else {
                        setState('complete');
                        return 0;
                    }
                }
                return prev - 1;
            });
            setPhaseElapsed((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [state, phase, phaseIndex]);

    const formatTime = useCallback((s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    }, []);

    const getZone = () => {
        if (heartRate <= todaySession.targetHRMax) {
            return { label: '🟢 Safe', className: 'zone-safe' };
        }
        if (heartRate <= 140) {
            return { label: '🟡 Elevated', className: 'zone-elevated' };
        }
        return { label: '🔴 Stop', className: 'zone-danger' };
    };

    const zone = getZone();

    const scrollTutorials = (direction: 'left' | 'right') => {
        const container = carouselRef.current;
        if (!container) return;
        container.scrollBy({
            left: direction === 'right' ? 220 : -220,
            behavior: 'smooth',
        });
    };

    // Pre-session screen
    if (state === 'pre') {
        return (
            <div className="page">
                <div className="page-header">
                    <Link href="/" className="back-btn"><ArrowLeft size={20} /></Link>
                    <h1>Today&apos;s Session</h1>
                </div>

                <div className="card" style={{ marginTop: 'var(--space-md)' }}>
                    <p style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>
                        {todaySession.totalDuration}-minute {todaySession.type.toLowerCase()}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>
                        Choose a quick preview before you start. Demo mode uses guided placeholders only.
                    </p>

                    <div style={{
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-md)',
                        marginBottom: 'var(--space-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-md)',
                    }}>
                        <span style={{ fontSize: '2rem' }}>▶</span>
                        <div>
                            <p style={{ fontWeight: 600 }}>Watch: How to warm up</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>30 seconds</p>
                        </div>
                    </div>

                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                            <p style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                                Workout Previews
                            </p>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <button
                                    type="button"
                                    onClick={() => scrollTutorials('left')}
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '999px',
                                        border: '1px solid var(--border-glass)',
                                        background: 'var(--bg-glass)',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ‹
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollTutorials('right')}
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '999px',
                                        border: '1px solid var(--border-glass)',
                                        background: 'var(--bg-glass)',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                        <div
                            ref={carouselRef}
                            style={{
                            display: 'flex',
                            gap: 'var(--space-sm)',
                            overflowX: 'auto',
                            paddingBottom: 'var(--space-xs)',
                            scrollSnapType: 'x mandatory',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}>
                            {exerciseTutorials.map((tutorial) => (
                                <button
                                    key={tutorial.id}
                                    onClick={() => setSelectedTutorial(tutorial)}
                                    style={{
                                        border: selectedTutorial.id === tutorial.id ? '1px solid var(--accent-teal)' : '1px solid var(--border-glass)',
                                        background: 'var(--bg-glass)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: 'var(--space-sm)',
                                        display: 'grid',
                                        gap: 'var(--space-sm)',
                                        alignItems: 'stretch',
                                        color: 'inherit',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        minWidth: 200,
                                        flex: '0 0 auto',
                                        scrollSnapAlign: 'start',
                                        boxShadow: selectedTutorial.id === tutorial.id
                                            ? '0 0 0 1px rgba(0,212,170,0.28), 0 10px 22px rgba(0,212,170,0.14)'
                                            : 'none',
                                        transform: selectedTutorial.id === tutorial.id ? 'translateY(-1px)' : 'translateY(0)',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <div style={{
                                        borderRadius: '10px',
                                        border: '1px solid var(--border-glass)',
                                        background: tutorial.thumbnail,
                                        minHeight: 68,
                                        display: 'grid',
                                        placeItems: 'center',
                                        fontSize: '1.2rem',
                                    }}>
                                        ▶
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: '999px',
                                                fontSize: '0.68rem',
                                                fontWeight: 700,
                                                background: tutorial.badge === 'New' ? 'var(--accent-blue-dim)' : 'var(--accent-teal-dim)',
                                                color: tutorial.badge === 'New' ? 'var(--accent-blue)' : 'var(--accent-teal)',
                                                textTransform: 'uppercase',
                                            }}>
                                                {tutorial.badge}
                                            </span>
                                        </div>
                                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{tutorial.title}</p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                                            {tutorial.duration} · {tutorial.level} · {tutorial.coach}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-md)',
                        marginBottom: 'var(--space-lg)',
                    }}>
                        <p style={{ fontWeight: 600, marginBottom: 'var(--space-xs)' }}>
                            {selectedTutorial.title} (Preview)
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 'var(--space-sm)' }}>
                            {selectedTutorial.focus}
                        </p>
                        <div style={{
                            borderRadius: '10px',
                            border: '1px solid var(--border-glass)',
                            overflow: 'hidden',
                            background: '#000',
                        }}>
                            <iframe
                                title={selectedTutorial.title}
                                width="100%"
                                height="220"
                                src={`https://www.youtube.com/embed/${selectedTutorial.videoId}?rel=0&modestbranding=1`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                style={{ border: 0, display: 'block' }}
                            />
                        </div>
                        <a
                            href={`https://www.youtube.com/watch?v=${selectedTutorial.videoId}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                display: 'inline-block',
                                marginTop: 'var(--space-sm)',
                                fontSize: '0.78rem',
                                color: 'var(--accent-teal)',
                                textDecoration: 'none',
                            }}
                        >
                            If preview is blocked, open on YouTube ↗
                        </a>
                    </div>

                    <p style={{ fontWeight: 700, marginBottom: 'var(--space-md)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                        Today&apos;s Plan
                    </p>

                    {todaySession.phases.map((p, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            gap: 'var(--space-md)',
                            marginBottom: 'var(--space-md)',
                            padding: 'var(--space-sm) 0',
                        }}>
                            <span style={{
                                width: 28,
                                height: 28,
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--accent-teal-dim)',
                                color: 'var(--accent-teal)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                flexShrink: 0,
                            }}>{i + 1}</span>
                            <div>
                                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name} — {p.duration} min</p>
                                {p.name === 'Main Walk' && (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        Target: {todaySession.targetHRMin}-{todaySession.targetHRMax} bpm
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <button className="btn btn-primary btn-full" onClick={() => setState('active')}>
                    I&apos;m ready — start ▶
                </button>
            </div>
        );
    }

    // Complete screen
    if (state === 'complete') {
        return (
            <div className="page" style={{ textAlign: 'center', paddingTop: '15vh' }}>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>🎉</div>
                <h1 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-sm)' }}>Session Complete!</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 'var(--space-xl)' }}>
                    {todaySession.totalDuration} minutes · Avg HR {heartRate} bpm
                </p>
                <div className="card" style={{ textAlign: 'left' }}>
                    <p style={{ fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Session Summary</p>
                    <div className="metrics-grid">
                        <div className="metric-card">
                            <div className="metric-label">Duration</div>
                            <div className="metric-value">{todaySession.totalDuration}m</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-label">Avg Heart Rate</div>
                            <div className="metric-value">{heartRate}</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-label">Peak HR</div>
                            <div className="metric-value">112</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-label">Recovery</div>
                            <div className="metric-value">3m</div>
                            <div className="metric-trend">↓ Getting faster</div>
                        </div>
                    </div>
                </div>
                <Link href="/" className="btn btn-primary btn-full" style={{ marginTop: 'var(--space-lg)' }}>
                    Back to Home
                </Link>
            </div>
        );
    }

    // Active session
    return (
        <div className="page" style={{ textAlign: 'center' }}>
            {/* Phase indicator */}
            <div className="phase-indicator">
                {todaySession.phases.map((_, i) => (
                    <div
                        key={i}
                        className={`phase-dot ${i < phaseIndex ? 'completed' : ''} ${i === phaseIndex ? 'active' : ''}`}
                    />
                ))}
            </div>

            <p style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--text-secondary)',
                fontWeight: 700,
            }}>
                Phase {phaseIndex + 1} of {todaySession.phases.length}: {phase.name}
            </p>

            {/* Timer */}
            <div className="timer-display">
                {formatTime(remaining)}
            </div>

            {/* Heart Rate */}
            <div className="hr-display">
                <div className="hr-value" style={{ color: zone.className.includes('danger') ? 'var(--status-red)' : 'var(--text-primary)' }}>
                    {heartRate}
                </div>
                <div className="hr-label">bpm</div>
                <div className={`hr-zone ${zone.className}`}>{zone.label}</div>
            </div>

            {/* Phase instruction */}
            <div className="card" style={{ textAlign: 'left', marginTop: 'var(--space-lg)' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    &ldquo;{phase.instruction}&rdquo;
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 'var(--space-sm)' }}>
                    {formatTime(phaseElapsed)} elapsed of {formatTime(phaseDuration)} in this phase
                </p>
            </div>

            {/* SOS button */}
            <Link href="/emergency">
                <button className="sos-btn">SOS</button>
            </Link>
        </div>
    );
}
