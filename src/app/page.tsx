'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
      {/* 🛡️ GUARDIAN STATUS — THE HERO */}
      <div className="guardian-card" style={{ animation: 'fadeInUp 0.4s ease forwards' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div className="guardian-icon">
            <Shield size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.02em' }}>
              GUARDIAN ACTIVE
            </div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(16, 185, 129, 0.8)' }}>
              Watching your heart
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>74</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(16, 185, 129, 0.7)' }}>bpm</div>
          </div>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'rgba(16, 185, 129, 0.6)', marginTop: 'var(--space-sm)' }}>
          Last checked: {hrAge} seconds ago
        </div>
        <Link href="/emergency" style={{ textDecoration: 'none' }}>
          <div style={{
            marginTop: 'var(--space-md)',
            padding: '10px var(--space-md)',
            background: 'rgba(16, 185, 129, 0.08)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            color: 'rgba(16, 185, 129, 0.7)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
          }}>
            <Shield size={14} />
            If something happens, I&apos;ll get help in under 90 seconds
            <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
          </div>
        </Link>
      </div>

      {/* Greeting + Progress */}
      <div style={{ marginBottom: 'var(--space-lg)', animation: 'fadeInUp 0.5s ease forwards', animationDelay: '0.05s', opacity: 0, animationFillMode: 'forwards' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              Good morning, {patient.firstName}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>
              Week {patient.currentWeek} of {patient.totalWeeks} · {patient.sessionsCompleted}/{patient.totalSessions} sessions
            </p>
          </div>
        </div>
        <div className="progress-bar" style={{ marginTop: 'var(--space-md)' }}>
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* AI Companion Card (Moved to front per user request) */}
      <Link href="/chat" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card stagger-1" style={{ animationFillMode: 'forwards', background: 'linear-gradient(145deg, rgba(0,212,170,0.1) 0%, rgba(0,0,0,0) 100%)', border: '1px solid rgba(0,212,170,0.3)' }}>
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

      {/* Rewards & Incentives */}
      <div className="card stagger-2" style={{ animationFillMode: 'forwards' }}>
        <div className="card-header">
          <span className="card-title">🎁 Next Reward</span>
          <span className="badge badge-yellow" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}>450 / 500 pts</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
          <div style={{ fontSize: '2rem' }}>👕</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Nike x HeartBridge Dri-FIT Tee</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Complete 2 more sessions to earn!</p>
          </div>
        </div>
        <div className="progress-bar" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="progress-bar-fill" style={{ width: '90%', background: 'linear-gradient(90deg, #F59E0B, #FBBF24)' }} />
        </div>
      </div>

      {/* Today's Exercise */}
      <Link href="/exercise" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card stagger-3" style={{ animationFillMode: 'forwards' }}>
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

      {/* Medications */}
      <Link href="/medications" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card stagger-4" style={{ animationFillMode: 'forwards' }}>
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
      <div className="card stagger-5" style={{ animationFillMode: 'forwards' }}>
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
      <div className="card stagger-6" style={{ animationFillMode: 'forwards' }}>
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
