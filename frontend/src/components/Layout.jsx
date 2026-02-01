import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Book,
    Users,
    ClipboardList,
    LogOut,
    GraduationCap,
    UserPlus,
    Link as LinkIcon,
    FileText
} from 'lucide-react';
import './Layout.css';

export function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getNavLinks = () => {
        switch (user?.role) {
            case 'ADMIN':
                return [
                    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
                    { to: '/admin/teachers', icon: Users, label: 'Teachers' },
                    { to: '/admin/students', icon: GraduationCap, label: 'Students' },
                    { to: '/admin/subjects', icon: Book, label: 'Subjects' },
                    { to: '/admin/assign', icon: LinkIcon, label: 'Assign Teachers' },
                ];
            case 'TEACHER':
                return [
                    { to: '/teacher', icon: LayoutDashboard, label: 'Dashboard', end: true },
                    { to: '/teacher/assignments', icon: ClipboardList, label: 'Assignments' },
                    { to: '/teacher/submissions', icon: FileText, label: 'Submissions' },
                ];
            case 'STUDENT':
                return [
                    { to: '/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
                    { to: '/student/subjects', icon: Book, label: 'My Subjects' },
                    { to: '/student/enroll', icon: UserPlus, label: 'Enroll' },
                    { to: '/student/assignments', icon: ClipboardList, label: 'Assignments' },
                ];
            default:
                return [];
        }
    };

    const getRoleLabel = () => {
        switch (user?.role) {
            case 'ADMIN': return 'Administrator';
            case 'TEACHER': return 'Teacher';
            case 'STUDENT': return 'Student';
            default: return 'User';
        }
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="brand">
                        <GraduationCap size={28} strokeWidth={1.5} />
                        <span className="brand-name">EduVerse</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {getNavLinks().map(({ to, icon: Icon, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={20} strokeWidth={1.75} />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            {getRoleLabel().charAt(0)}
                        </div>
                        <div className="user-details">
                            <span className="user-role">{getRoleLabel()}</span>
                            <span className="user-status">Online</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={18} strokeWidth={1.75} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
