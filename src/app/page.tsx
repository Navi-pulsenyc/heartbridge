'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Shield, MessageCircle } from 'lucide-react';
import {
  patient,
  todaySession,
  nutritionTip,
  medications,
  todayVitals,
  careSchedule,
} from '@/lib/mockData';

export default function HomePage() {
  const progressPct = Math.round((patient.sessionsCompleted / patient.totalSessions) * 100);
  const medsTaken = medications.reduce(
    (sum, m) => sum + m.takenToday.filter(Boolean).length,
    0
  );
  const medsTotal = medications.reduce((sum, m) => sum + m.takenToday.length, 0);
  const nextMed = medications.find((m) => m.takenToday.some((t) => !t));

  const [hrAge, setHrAge] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setHrAge((p) => (p + 1) % 15), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page">
      {/* Guardian — safety / monitoring (above rewards) */}
      <div className="guardian-card stagger-1" style={{ animation: 'fadeInUp 0.4s ease forwards', animationFillMode: 'forwards' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div className="guardian-icon">
            <Shield size={28} strokeWidth={2} aria-hidden />
          </div>
          <div style={{ flex: 1 }}>
            <div className="guardian-title">GUARDIAN ACTIVE</div>
            <div className="guardian-sub">Watching your heart</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="guardian-bpm-value">{todayVitals.heartRate.value ?? '—'}</div>
            <div className="guardian-bpm-label">bpm</div>
          </div>
        </div>
        <div className="guardian-meta">
          Last checked: {hrAge} seconds ago
        </div>
        <Link href="/emergency" style={{ textDecoration: 'none', color: 'inherit' }} aria-label="Emergency and safety information">
          <div className="guardian-assurance">
            <Shield size={18} strokeWidth={2} aria-hidden />
            <span style={{ flex: 1 }}>
              If something happens, I&apos;ll get help in under 90 seconds
            </span>
            <ChevronRight size={18} aria-hidden style={{ flexShrink: 0 }} />
          </div>
        </Link>
      </div>

      {/* Greeting + week progress (clinical dashboard) */}
      <div
        className="home-greeting-block"
        style={{
          marginBottom: 'var(--space-lg)',
          animation: 'fadeInUp 0.5s ease forwards',
          animationDelay: '0.05s',
          opacity: 0,
          animationFillMode: 'forwards',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.55rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Good morning, {patient.firstName}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 8, fontWeight: 500 }}>
              Week {patient.currentWeek} of {patient.totalWeeks} · {patient.sessionsCompleted}/{patient.totalSessions} sessions
            </p>
          </div>
        </div>
        <div className="progress-bar" style={{ marginTop: 'var(--space-md)' }}>
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Next Reward */}
      <div
        className="card stagger-2"
        style={{
          animationFillMode: 'forwards',
          marginBottom: 'var(--space-md)',
          borderColor: 'rgba(234, 179, 8, 0.35)',
          background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 55%)',
        }}
      >
        <div className="card-header">
          <span className="card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span aria-hidden>🎁</span>
            <img
              src="/next-reward-dot.png"
              alt=""
              width={10}
              height={10}
              style={{ display: 'block', flexShrink: 0 }}
            />
            Next Reward
          </span>
          <span className="badge badge-yellow" style={{ background: 'var(--accent-amber-dim)', color: '#854d0e', border: '1px solid rgba(234, 179, 8, 0.5)' }}>
            450 / 500 PTS
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              flexShrink: 0,
              border: '1px solid var(--border-glass)',
              background: 'var(--bg-secondary)',
            }}
          >
            <Image
              src="/reward-nike-tee.png"
              alt="Nike x HeartBridge Dri-FIT Tee — lifestyle preview"
              width={88}
              height={88}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }}
            />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              Nike x <span style={{ background: 'rgba(22, 163, 74, 0.15)', padding: '0 6px', borderRadius: 4, color: 'var(--health-mint-muted)', border: '1px solid rgba(234, 179, 8, 0.45)' }}>HeartBridge</span> Dri-FIT Tee
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Complete 2 more sessions to earn!</p>
          </div>
        </div>
        <div className="progress-bar" style={{ background: 'rgba(234, 179, 8, 0.25)' }}>
          <div className="progress-bar-fill" style={{ width: '90%', background: 'linear-gradient(90deg, #ca8a04, #eab308)' }} />
        </div>
      </div>

      {/* Today's Exercise */}
      <Link href="/exercise" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card stagger-3" style={{ animationFillMode: 'forwards', marginBottom: 'var(--space-md)' }}>
          <div className="card-header">
            <span className="card-title">🏃 Today&apos;s Session</span>
            <span className="badge badge-teal">Day {todaySession.day}</span>
          </div>
          <p style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 4 }}>
            {todaySession.totalDuration}-min {todaySession.type.toLowerCase()}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 'var(--space-md)' }}>
            Target HR: {todaySession.targetHRMin}-{todaySession.targetHRMax} bpm
          </p>
          <button className="btn btn-primary btn-full">
            Start my session ▶
          </button>
        </div>
      </Link>

      {/* AI Companion Card */}
      <Link href="/chat" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card stagger-4 card-coach" style={{ animationFillMode: 'forwards' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{ background: 'var(--accent-teal-dim)', color: 'var(--accent-teal)', padding: '12px', borderRadius: '50%' }}>
              <MessageCircle size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>HeartBridge AI Coach</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 2 }}>Tap to chat, log symptoms, or ask questions 24/7.</p>
            </div>
            <ChevronRight size={20} color="var(--accent-teal)" />
          </div>
        </div>
      </Link>

      {/* Medications */}
      <Link href="/medications" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card stagger-5" style={{ animationFillMode: 'forwards' }}>
          <div className="card-header">
            <span className="card-title">💊 Medications</span>
            <span className="card-link">View all <ChevronRight size={14} /></span>
          </div>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>
            {medsTaken} of {medsTotal} taken today
          </p>
          {nextMed && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Next: {nextMed.name} at {nextMed.times[nextMed.takenToday.indexOf(false)]}
            </p>
          )}
        </div>
      </Link>

      {/* Log My Numbers */}
      <div className="card stagger-6" style={{ animationFillMode: 'forwards' }}>
        <div className="card-header">
          <span className="card-title">📋 Log My Numbers</span>
        </div>
        <div className="vitals-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <Link href="/vitals?type=bp" className="vital-tile" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="vital-icon">❤️</div>
            <div className="vital-name">BP</div>
            {todayVitals.bloodPressure.logged && <div className="vital-check">✓</div>}
          </Link>
          <Link href="/vitals?type=weight" className="vital-tile" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="vital-icon">⚖️</div>
            <div className="vital-name">Wt</div>
            {todayVitals.weight.logged && <div className="vital-check">✓</div>}
          </Link>
          <Link href="/vitals?type=spo2" className="vital-tile" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="vital-icon">💨</div>
            <div className="vital-name">SpO2</div>
            {todayVitals.spo2.logged && <div className="vital-check">✓</div>}
          </Link>
        </div>
        <Link href="/vitals" className="card-link" style={{ marginTop: 'var(--space-md)' }}>
          How to take my vitals <ChevronRight size={14} />
        </Link>
      </div>

      {/* Care Team */}
      <div className="card stagger-7" style={{ animationFillMode: 'forwards' }}>
        <div className="card-header">
          <span className="card-title">👩‍⚕️ Care Team</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: '1.5rem' }}>{careSchedule.nurse.avatar}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{careSchedule.nurse.name}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                Next: {new Date(careSchedule.nurse.nextCheckIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <a href={`tel:${careSchedule.nurse.phone}`} className="btn btn-outline btn-sm">Call nurse now</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: '1.5rem' }}>{careSchedule.doctor.avatar}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{careSchedule.doctor.name}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                Next: {new Date(careSchedule.doctor.nextCheckUp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
