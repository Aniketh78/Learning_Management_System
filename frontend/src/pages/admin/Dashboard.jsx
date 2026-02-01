import { Users, GraduationCap, Book, LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export function AdminDashboard() {
    const cards = [
        {
            title: 'Manage Teachers',
            description: 'Add and manage teacher accounts',
            icon: Users,
            link: '/admin/teachers',
            color: 'primary',
        },
        {
            title: 'Manage Students',
            description: 'Add and manage student accounts',
            icon: GraduationCap,
            link: '/admin/students',
            color: 'success',
        },
        {
            title: 'Manage Subjects',
            description: 'Create and organize subjects',
            icon: Book,
            link: '/admin/subjects',
            color: 'warning',
        },
        {
            title: 'Assign Teachers',
            description: 'Assign teachers to subjects',
            icon: LinkIcon,
            link: '/admin/assign',
            color: 'info',
        },
    ];

    return (
        <div className="dashboard animate-fadeIn">
            <div className="page-header">
                <h1 className="page-title">Admin Dashboard</h1>
                <p className="page-description">Manage your learning management system</p>
            </div>

            <div className="dashboard-grid">
                {cards.map((card) => (
                    <Link to={card.link} key={card.title} className="dashboard-card">
                        <div className={`dashboard-card-icon ${card.color}`}>
                            <card.icon size={24} strokeWidth={1.75} />
                        </div>
                        <div className="dashboard-card-content">
                            <h3 className="dashboard-card-title">{card.title}</h3>
                            <p className="dashboard-card-description">{card.description}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="dashboard-welcome">
                <div className="welcome-content">
                    <h2>Welcome to EduVerse</h2>
                    <p>
                        Get started by adding teachers and students, creating subjects, and assigning teachers to their courses.
                        Use the sidebar to navigate between different sections.
                    </p>
                </div>
            </div>
        </div>
    );
}
