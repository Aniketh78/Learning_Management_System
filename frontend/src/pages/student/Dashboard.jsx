import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Book, ClipboardList, UserPlus, Calendar, ChevronRight } from 'lucide-react';
import '../admin/Dashboard.css';
import './Student.css';

export function StudentDashboard() {
    const [subjects, setSubjects] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [subjectsRes, assignmentsRes] = await Promise.all([
                studentAPI.getMySubjects(),
                studentAPI.getMyAssignments(),
            ]);
            setSubjects(subjectsRes.data);
            setAssignments(assignmentsRes.data);
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const cards = [
        {
            title: 'My Subjects',
            description: `${subjects.length} enrolled subjects`,
            icon: Book,
            link: '/student/subjects',
            color: 'primary',
        },
        {
            title: 'Assignments',
            description: `${assignments.length} active assignments`,
            icon: ClipboardList,
            link: '/student/assignments',
            color: 'warning',
        },
        {
            title: 'Enroll',
            description: 'Browse available courses',
            icon: UserPlus,
            link: '/student/enroll',
            color: 'success',
        },
    ];

    const upcomingAssignments = assignments
        .filter((a) => new Date(a.dueDate) >= new Date())
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard animate-fadeIn">
            <div className="page-header">
                <h1 className="page-title">Student Dashboard</h1>
                <p className="page-description">Welcome back! Here's your learning overview</p>
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

            {upcomingAssignments.length > 0 && (
                <div className="upcoming-section">
                    <div className="section-header">
                        <h2 className="section-title">Upcoming Assignments</h2>
                        <Link to="/student/assignments" className="section-link">
                            View All <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="assignments-list">
                        {upcomingAssignments.map((assignment) => (
                            <div key={assignment.id} className="assignment-item">
                                <div className="assignment-info">
                                    <h4 className="assignment-title">{assignment.title}</h4>
                                    <span className="assignment-subject">{assignment.subjectName}</span>
                                </div>
                                <div className="assignment-due">
                                    <Calendar size={14} />
                                    <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
