import { Link } from 'react-router-dom';
import { ClipboardList, FileText, Plus } from 'lucide-react';
import '../admin/Dashboard.css';

export function TeacherDashboard() {
    const cards = [
        {
            title: 'Create Assignment',
            description: 'Add new assignments for your students',
            icon: Plus,
            link: '/teacher/assignments',
            color: 'primary',
        },
        {
            title: 'View Submissions',
            description: 'Review student submissions',
            icon: FileText,
            link: '/teacher/submissions',
            color: 'success',
        },
    ];

    return (
        <div className="dashboard animate-fadeIn">
            <div className="page-header">
                <h1 className="page-title">Teacher Dashboard</h1>
                <p className="page-description">Manage your classes and assignments</p>
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
                    <h2>Welcome, Teacher!</h2>
                    <p>
                        Use the sidebar to create assignments for your students and review their submissions.
                        Stay organized and help your students succeed.
                    </p>
                </div>
            </div>
        </div>
    );
}
