'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Video, TrendingDown } from 'lucide-react';
import { clinicianPatients, vitalsHistory, caqHistory, phqHistory, medications } from '@/lib/mockData';
import type { ClinicianPatient } from '@/lib/mockData';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function ClinicianPage() {
    const [selected, setSelected] = useState<ClinicianPatient | null>(null);

    const greenCount = clinicianPatients.filter((p) => p.status === 'green').length;
    const yellowCount = clinicianPatients.filter((p) => p.status === 'yellow').length;
    const redCount = clinicianPatients.filter((p) => p.status === 'red').length;

    if (selected) {
        const isMaria = selected.id === 'p001';
        return (
            <div className="page">
                <div className="page-header">
                    <button className="back-btn" onClick={() => setSelected(null)}><ArrowLeft size={20} /></button>
                    <div>
                        <h1 style={{ fontSize: '1.1rem' }}>{selected.avatar} {selected.name}</h1>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Age {selected.age} · Week {selected.week}/12
                        </p>
                    </div>
                    <span className={`badge badge-${selected.status}`} style={{ marginLeft: 'auto' }}>
                        {selected.status.toUpperCase()}
                    </span>
                </div>

                {/* Alert */}
                {selected.lastAlert && (
                    <div className="card" style={{ borderColor: selected.status === 'red' ? 'var(--status-red)' : 'var(--status-yellow)', borderWidth: 2, background: selected.status === 'red' ? 'rgba(239,68,68,0.05)' : 'rgba(245,158,11,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                            <AlertCircle size={16} color={selected.status === 'red' ? 'var(--status-red)' : 'var(--status-yellow)'} />
                            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: selected.status === 'red' ? 'var(--status-red)' : 'var(--status-yellow)' }}>
                                {selected.lastAlert}
                            </span>
                        </div>
                    </div>
                )}

                {/* Key Metrics */}
                <div className="metrics-grid">
                    <div className="metric-card" style={{
                        border: selected.dropoutRisk > 50 ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--border-glass)',
                        background: selected.dropoutRisk > 50 ? 'rgba(239,68,68,0.05)' : 'var(--bg-glass)'
                    }}>
                        <div className="metric-label" style={{ color: selected.dropoutRisk > 50 ? 'var(--status-red)' : 'var(--text-secondary)' }}>
                            30-Day Dropout Risk
                        </div>
                        <div className="metric-value" style={{ color: selected.dropoutRisk > 50 ? 'var(--status-red)' : selected.dropoutRisk > 30 ? 'var(--status-yellow)' : 'var(--status-green)' }}>
                            {selected.dropoutRisk}%
                        </div>
                        <div className="progress-bar" style={{ marginTop: 6 }}>
                            <div className="progress-bar-fill" style={{
                                width: `${selected.dropoutRisk}%`,
                                background: selected.dropoutRisk > 50 ? 'var(--status-red)' : selected.dropoutRisk > 30 ? 'var(--status-yellow)' : 'var(--status-green)'
                            }} />
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-label">Sessions</div>
                        <div className="metric-value">{selected.sessionsCompleted}/{selected.totalSessions}</div>
                        <div className="progress-bar" style={{ marginTop: 6 }}>
                            <div className="progress-bar-fill" style={{ width: `${(selected.sessionsCompleted / selected.totalSessions) * 100}%` }} />
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-label">Resting HR</div>
                        <div className="metric-value">{selected.restingHR}</div>
                        <div className="metric-trend">
                            <TrendingDown size={12} style={{ display: 'inline' }} /> {selected.restingHRTrend}
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-label">Anxiety Score</div>
                        <div className="metric-value" style={{ color: selected.caqFear > 2.0 ? 'var(--status-yellow)' : 'var(--status-green)' }}>
                            {selected.caqFear}
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-label">PHQ Mood</div>
                        <div className="metric-value" style={{ color: selected.phqScore > 8 ? 'var(--status-red)' : selected.phqScore > 5 ? 'var(--status-yellow)' : 'var(--status-green)' }}>
                            {selected.phqScore}
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-label">Meds Taken</div>
                        <div className="metric-value" style={{ color: selected.medAdherence < 80 ? 'var(--status-red)' : 'var(--status-green)' }}>
                            {selected.medAdherence}%
                        </div>
                    </div>
                </div>

                {/* Charts (Maria only) */}
                {isMaria && (
                    <>
                        <div className="card">
                            <p className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Resting Heart Rate Trend</p>
                            <ResponsiveContainer width="100%" height={180}>
                                <LineChart data={vitalsHistory}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(w) => `W${w}`} />
                                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} domain={[65, 90]} />
                                    <Tooltip contentStyle={{ background: '#111D35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                                    <Line type="monotone" dataKey="restingHR" stroke="#00D4AA" strokeWidth={2} dot={{ r: 4, fill: '#00D4AA' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="card">
                            <p className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Anxiety Trend</p>
                            <ResponsiveContainer width="100%" height={180}>
                                <LineChart data={caqHistory}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(w) => `W${w}`} />
                                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} domain={[0, 4]} />
                                    <Tooltip contentStyle={{ background: '#111D35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                                    <Line type="monotone" dataKey="total" stroke="#FF6B6B" strokeWidth={2} dot={{ r: 3 }} name="Anxiety Score" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="card">
                            <p className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Meds Taken Routine</p>
                            {medications.map((med) => (
                                <div key={med.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '0.85rem' }}>{med.name} {med.dose}</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: med.adherenceRate < 90 ? 'var(--status-yellow)' : 'var(--status-green)' }}>
                                        {med.adherenceRate}% {med.adherenceRate === 100 ? '✓' : '⚠'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <button className="btn btn-outline btn-full" style={{ marginTop: 'var(--space-sm)' }}>
                    <Video size={18} /> Schedule Video Check-in
                </button>
            </div>
        );
    }

    // Patient List
    return (
        <div className="page">
            <div className="page-header">
                <Link href="/" className="back-btn"><ArrowLeft size={20} /></Link>
                <div>
                    <h1 style={{ fontSize: '1.1rem' }}>Dr. Patel&apos;s CR Panel</h1>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>12 Active Patients</p>
                </div>
            </div>

            {/* Traffic Light Summary */}
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                <div className="card" style={{ flex: 1, textAlign: 'center', padding: 'var(--space-md)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-green)' }}>{greenCount}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>On Track</div>
                </div>
                <div className="card" style={{ flex: 1, textAlign: 'center', padding: 'var(--space-md)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-yellow)' }}>{yellowCount}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Slipping</div>
                </div>
                <div className="card" style={{ flex: 1, textAlign: 'center', padding: 'var(--space-md)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-red)' }}>{redCount}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Needs Attention</div>
                </div>
            </div>

            {/* Patient Table (Desktop Layout) */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: 'var(--space-md)', fontWeight: 600, color: 'var(--text-secondary)' }}>Patient</th>
                            <th style={{ padding: 'var(--space-md)', fontWeight: 600, color: 'var(--text-secondary)' }}>Week</th>
                            <th style={{ padding: 'var(--space-md)', fontWeight: 600, color: 'var(--text-secondary)' }}>Sessions</th>
                            <th style={{ padding: 'var(--space-md)', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                            <th style={{ padding: 'var(--space-md)', fontWeight: 600, color: 'var(--text-secondary)' }}>Risk Score</th>
                            <th style={{ padding: 'var(--space-md)', fontWeight: 600, color: 'var(--text-secondary)' }}>Anxiety Trend</th>
                            <th style={{ padding: 'var(--space-md)', fontWeight: 600, color: 'var(--text-secondary)' }}>Last Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clinicianPatients
                            .sort((a, b) => {
                                const order = { red: 0, yellow: 1, green: 2 };
                                return order[a.status] - order[b.status];
                            })
                            .map((p) => (
                                <tr
                                    key={p.id}
                                    onClick={() => setSelected(p)}
                                    style={{
                                        borderBottom: '1px solid var(--border-glass)',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        background: p.status === 'red' ? 'rgba(239, 68, 68, 0.03)' : 'transparent',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = p.status === 'red' ? 'rgba(239, 68, 68, 0.03)' : 'transparent'}
                                >
                                    <td style={{ padding: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                        <span className={`status-dot ${p.status}`} />
                                        <span style={{ fontSize: '1.2rem' }}>{p.avatar}</span>
                                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                                    </td>
                                    <td style={{ padding: 'var(--space-md)' }}>W{p.week}</td>
                                    <td style={{ padding: 'var(--space-md)' }}>{p.sessionsCompleted}/{p.totalSessions}</td>
                                    <td style={{ padding: 'var(--space-md)' }}>
                                        <span className={`badge badge-${p.status}`}>{p.status.toUpperCase()}</span>
                                    </td>
                                    <td style={{ padding: 'var(--space-md)', fontWeight: 700, color: p.dropoutRisk > 50 ? 'var(--status-red)' : p.dropoutRisk > 30 ? 'var(--status-yellow)' : 'var(--text-primary)' }}>
                                        {p.dropoutRisk}%
                                    </td>
                                    <td style={{ padding: 'var(--space-md)' }}>
                                        <span style={{ color: p.caqAvoidance > 2.0 || p.caqFear > 2.5 ? 'var(--status-yellow)' : 'var(--text-muted)' }}>
                                            {p.caqAvoidance > 2.0 || p.caqFear > 2.5 ? '↑ rising' : '↓ improv.'}
                                        </span>
                                    </td>
                                    <td style={{ padding: 'var(--space-md)', color: 'var(--text-muted)' }}>
                                        {p.status === 'red' ? '5 days ago' : p.status === 'yellow' ? '3 days ago' : 'today'}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
