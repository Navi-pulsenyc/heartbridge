'use client';

import Link from 'next/link';
import { ArrowLeft, MessageCircle, UserPlus, Trophy } from 'lucide-react';
import { peerMatches, familyCircle } from '@/lib/mockData';

export default function CommunityPage() {
    return (
        <div className="page">
            <div className="page-header">
                <Link href="/" className="back-btn"><ArrowLeft size={20} /></Link>
                <h1>People</h1>
            </div>

            {/* Peer Matches */}
            <p className="card-title" style={{ marginBottom: 'var(--space-md)', padding: '0 var(--space-xs)' }}>
                🤝 Your Rehab Buddies
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 'var(--space-md)', padding: '0 var(--space-xs)' }}>
                Matched by shared interests from your profile
            </p>

            {peerMatches.map((peer) => (
                <div key={peer.id} className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                        <span style={{ fontSize: '2rem' }}>{peer.avatar}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                <span style={{ fontWeight: 700 }}>{peer.name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{peer.age}</span>
                            </div>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                Week {peer.week} · {peer.interests.join(', ')}
                            </p>
                        </div>
                        <span className="badge badge-teal">{peer.matchScore}% match</span>
                    </div>

                    <div style={{
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-sm)',
                        padding: 'var(--space-sm) var(--space-md)',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        fontStyle: 'italic',
                        marginBottom: 'var(--space-md)',
                    }}>
                        &ldquo;{peer.recentMessage}&rdquo;
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                        <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                            <MessageCircle size={14} /> Chat
                        </button>
                        <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                            🚶 Walk Together
                        </button>
                    </div>
                </div>
            ))}

            {/* Family Circle */}
            <p className="card-title" style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)', padding: '0 var(--space-xs)' }}>
                💙 Family Circle
            </p>

            <Link href="/family" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card">
                    {familyCircle.members.map((member) => (
                        <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                            <span style={{ fontSize: '2rem' }}>{member.avatar}</span>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 600 }}>{member.name}</p>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    {member.relation} · Sees milestones & sessions
                                </p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--accent-teal)', marginTop: 4 }}>
                                    &ldquo;{member.recentMessage}&rdquo; — {member.messageDate}
                                </p>
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-outline btn-sm" style={{ marginTop: 'var(--space-md)', width: '100%' }}>
                        <UserPlus size={14} /> Add family member
                    </button>
                </div>
            </Link>

            {/* Leaderboard */}
            <p className="card-title" style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)', padding: '0 var(--space-xs)' }}>
                <Trophy size={14} style={{ display: 'inline' }} /> Weekly Leaderboard
            </p>
            <div className="card">
                {[
                    { name: 'Linda', sessions: 4, streak: 12, pts: 1280 },
                    { name: 'Maria (you)', sessions: 3, streak: 8, pts: 1050, you: true },
                    { name: 'Gloria', sessions: 3, streak: 6, pts: 920 },
                    { name: 'James', sessions: 2, streak: 4, pts: 680 },
                ].map((entry, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-md)',
                        borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        background: entry.you ? 'var(--accent-teal-dim)' : 'transparent',
                        margin: entry.you ? '0 -var(--space-lg)' : 0,
                        padding: entry.you ? '10px var(--space-lg)' : '10px 0',
                        borderRadius: entry.you ? 'var(--radius-sm)' : 0,
                    }}>
                        <span style={{ fontWeight: 800, width: 24, color: i === 0 ? 'var(--accent-teal)' : 'var(--text-muted)' }}>
                            #{i + 1}
                        </span>
                        <span style={{ flex: 1, fontWeight: entry.you ? 700 : 400 }}>{entry.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🔥 {entry.streak}d</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-teal)' }}>{entry.pts} pts</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
