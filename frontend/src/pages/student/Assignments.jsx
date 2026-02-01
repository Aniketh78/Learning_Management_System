import { useEffect, useState } from 'react';
import { studentAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Calendar, User, Book, Inbox, Send, ChevronDown, ChevronUp } from 'lucide-react';
import './Student.css';

export function Assignments() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [submissionContent, setSubmissionContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();

    useEffect(() => {
        loadAssignments();
    }, []);

    const loadAssignments = async () => {
        try {
            const response = await studentAPI.getMyAssignments();
            setAssignments(response.data);
        } catch (error) {
            toast.error('Failed to load assignments');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (assignmentId) => {
        if (!submissionContent.trim()) {
            toast.warning('Please enter your submission content');
            return;
        }

        setSubmitting(true);
        try {
            await studentAPI.submitAssignment(assignmentId, submissionContent);
            toast.success('Assignment submitted successfully!');
            setSubmissionContent('');
            setExpandedId(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit assignment');
        } finally {
            setSubmitting(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
        setSubmissionContent('');
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date();
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
                <h1 className="page-title">Assignments</h1>
                <p className="page-description">View and submit your assignments</p>
            </div>

            {assignments.length === 0 ? (
                <div className="empty-state">
                    <Inbox size={48} className="empty-state-icon" />
                    <h3>No Assignments</h3>
                    <p>You don't have any assignments yet.</p>
                </div>
            ) : (
                <div className="assignments-list" style={{ gap: '1rem' }}>
                    {assignments.map((assignment) => (
                        <div key={assignment.id} className="assignment-detail-card">
                            <div className="assignment-header">
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
                                        {assignment.title}
                                    </h3>
                                </div>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => toggleExpand(assignment.id)}
                                >
                                    {expandedId === assignment.id ? (
                                        <ChevronUp size={18} />
                                    ) : (
                                        <ChevronDown size={18} />
                                    )}
                                </button>
                            </div>

                            <div className="assignment-meta">
                                <div className="meta-item">
                                    <Book size={14} />
                                    <span>{assignment.subjectName}</span>
                                </div>
                                <div className="meta-item">
                                    <User size={14} />
                                    <span>{assignment.teacherName}</span>
                                </div>
                                <div className="meta-item">
                                    <Calendar size={14} />
                                    <span
                                        style={{
                                            color: isOverdue(assignment.dueDate)
                                                ? 'var(--color-error)'
                                                : 'inherit',
                                        }}
                                    >
                                        Due: {formatDate(assignment.dueDate)}
                                        {isOverdue(assignment.dueDate) && ' (Overdue)'}
                                    </span>
                                </div>
                            </div>

                            {expandedId === assignment.id && (
                                <div className="animate-fadeIn">
                                    <p className="assignment-description">{assignment.description}</p>

                                    <div className="submission-form" style={{ marginTop: '1.5rem' }}>
                                        <h3>Submit Your Work</h3>
                                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                                            <textarea
                                                value={submissionContent}
                                                onChange={(e) => setSubmissionContent(e.target.value)}
                                                placeholder="Enter your submission content..."
                                                rows={5}
                                            />
                                        </div>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleSubmit(assignment.id)}
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <div className="spinner" style={{ width: 18, height: 18 }}></div>
                                            ) : (
                                                <>
                                                    <Send size={16} />
                                                    Submit Assignment
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
