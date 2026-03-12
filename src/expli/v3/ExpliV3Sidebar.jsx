import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    BookOpen,
    GitFork,
    BarChart3,
    User,
    Bell,
    Settings,
} from "lucide-react";

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/expli" },
    { icon: FileText, label: "Plans", path: "/expli/plans" },
    { icon: BookOpen, label: "Flashcards", path: "/expli/flashcards", disabled: false },
    { icon: GitFork, label: "Diagrams", path: "/expli/diagrams", disabled: false },
    { icon: BarChart3, label: "Analytics", path: "#", disabled: true },
    { icon: User, label: "Profile", path: "#", disabled: true },
];

export default function ExpliV3Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        if (path === "/expli") {
            return location.pathname === "/expli" || location.pathname === "/expli/ask";
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="expli-v3-sidebar-overlay fixed inset-0 bg-black/60 z-[99] hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`expli-v3-sidebar ${isOpen ? "expli-v3-sidebar--open" : ""}`}>
                {/* Logo */}
                <div
                    className="expli-v3-sidebar__logo cursor-pointer"
                    onClick={() => navigate("/expli")}
                >
                    <div className="expli-v3-sidebar__logo-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                    </div>
                    <span className="expli-v3-sidebar__logo-text">Expli</span>
                </div>

                {/* Navigation */}
                <nav className="expli-v3-sidebar__nav">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <button
                                key={item.label}
                                className={`expli-v3-sidebar__item ${active ? "expli-v3-sidebar__item--active" : ""} ${item.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                                onClick={() => {
                                    if (!item.disabled) {
                                        navigate(item.path);
                                        onClose?.();
                                    }
                                }}
                                title={item.disabled ? "Coming in V4" : item.label}
                            >
                                <span className="expli-v3-sidebar__item-icon">
                                    <Icon size={18} />
                                </span>
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Profile */}
                <div className="expli-v3-sidebar__profile">
                    <div className="expli-v3-sidebar__avatar">AJ</div>
                    <div className="expli-v3-sidebar__profile-info">
                        <div className="expli-v3-sidebar__profile-name">Alex Johnson</div>
                        <div className="expli-v3-sidebar__profile-plan">Premium Plan</div>
                    </div>
                </div>
            </aside>
        </>
    );
}
