import { useEffect, useState } from 'react';
import { studentAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Book, User, Inbox } from 'lucide-react';
import './Student.css';

export function MySubjects() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            const response = await studentAPI.getMySubjects();
            setSubjects(response.data);
        } catch (error) {
            toast.error('Failed to load subjects');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1 className="page-title">My Subjects</h1>
                <p className="page-description">Courses you are currently enrolled in</p>
            </div>

            {subjects.length === 0 ? (
                <div className="empty-state">
                    <Inbox size={48} className="empty-state-icon" />
                    <h3>No Subjects Yet</h3>
                    <p>You haven't enrolled in any subjects. Start by browsing available courses.</p>
                </div>
            ) : (
                <div className="subjects-grid">
                    {subjects.map((subject) => (
                        <div key={subject.subjectId} className="subject-card">
                            <span className="subject-code">{subject.subjectCode}</span>
                            <h3 className="subject-name">{subject.subjectName}</h3>
                            <div className="subject-teacher">
                                <User size={14} />
                                <span>{subject.teacherName}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
