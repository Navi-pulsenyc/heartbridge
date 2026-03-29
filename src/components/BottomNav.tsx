'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Users, User } from 'lucide-react';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/journey', label: 'Journey', icon: Map },
    { href: '/community', label: 'People', icon: Users },
    { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
    const pathname = usePathname();

    // Hide nav on certain pages
    const hiddenPaths = ['/exercise', '/emergency', '/clinician', '/onboard'];
    if (hiddenPaths.some(p => pathname.startsWith(p))) return null;

    return (
        <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
            {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        <Icon aria-hidden size={28} strokeWidth={2} />
                        <span>{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
