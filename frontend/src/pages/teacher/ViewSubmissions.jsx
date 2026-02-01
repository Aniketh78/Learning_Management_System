import { useState } from 'react';
import { teacherAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Search, FileText, User, Mail, Clock, Inbox } from 'lucide-react';
import './Teacher.css';

export function ViewSubmissions() {
    const [assignmentId, setAssignmentId] = useState('');
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const toast = useToast();

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!assignmentId) {
            toast.warning('Please enter an assignment ID');
            return;
        }

        setLoading(true);
        try {
            const response = await teacherAPI.getSubmissions(parseInt(assignmentId));
            setSubmissions(response.data);
            setSearched(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load submissions');
            setSubmissions([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateTimeStr) => {
        return new Date(dateTimeStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1 className="page-title">View Submissions</h1>
                <p className="page-description">Review student submissions for an assignment</p>
            </div>

            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="input-wrapper" style={{ flex: 1 }}>
                        <FileText size={18} className="input-icon" />
                        <input
                            type="number"
                            value={assignmentId}
                            onChange={(e) => setAssignmentId(e.target.value)}
                            placeholder="Enter assignment ID"
                            min="1"
                            style={{ paddingLeft: '2.75rem' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? (
                            <div className="spinner" style={{ width: 18, height: 18 }}></div>
                        ) : (
                            <>
                                <Search size={18} />
                                Search
                            </>
                        )}
                    </button>
                </form>
            </div>

            {searched && (
                <div className="submissions-section">
                    {submissions.length === 0 ? (
                        <div className="empty-state">
                            <Inbox size={48} className="empty-state-icon" />
                            <h3>No Submissions</h3>
                            <p>No students have submitted this assignment yet.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Email</th>
                                        <th>Submitted At</th>
                                        <th>Content</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((submission) => (
                                        <tr key={submission.id}>
                                            <td>
                                                <div className="student-cell">
                                                    <User size={16} />
                                                    <span>{submission.studentName}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="email-cell">
                                                    <Mail size={14} />
                                                    <span>{submission.studentEmail}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="time-cell">
                                                    <Clock size={14} />
                                                    <span>{formatDateTime(submission.submittedAt)}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="content-preview">
                                                    {submission.content.length > 100
                                                        ? `${submission.content.substring(0, 100)}...`
                                                        : submission.content}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
