'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { todaySession } from '@/lib/mockData';

type SessionState = 'pre' | 'active' | 'complete';

export default function ExercisePage() {
    const [state, setState] = useState<SessionState>('pre');
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [remaining, setRemaining] = useState(todaySession.phases[0].duration * 60);
    const [phaseElapsed, setPhaseElapsed] = useState(0);
    const [heartRate, setHeartRate] = useState(78);

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
