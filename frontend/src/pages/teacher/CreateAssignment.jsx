import { useState, useEffect } from 'react';
import { teacherAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { ClipboardList, Book, Type, Calendar } from 'lucide-react';
import '../FormPage.css';

export function CreateAssignment() {
    const [subjectId, setSubjectId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const toast = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [subjectsRes, assignmentsRes] = await Promise.all([
                teacherAPI.getMySubjects(),
                teacherAPI.getMyAssignments(),
            ]);
            setSubjects(subjectsRes.data);
            setAssignments(assignmentsRes.data);
        } catch (error) {
            toast.error('Failed to load data');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!subjectId || !title || !description || !dueDate) {
            toast.warning('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await teacherAPI.createAssignment({
                subjectId: parseInt(subjectId),
                title,
                description,
                dueDate,
            });
            toast.success('Assignment created successfully!');
            setSubjectId('');
            setTitle('');
            setDescription('');
            setDueDate('');
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create assignment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page animate-fadeIn">
            <div className="page-header">
                <h1 className="page-title">Create Assignment</h1>
                <p className="page-description">Add a new assignment for your students</p>
            </div>

            <div className="form-container" style={{ maxWidth: '1200px' }}>
                <div className="form-card">
                    <div className="form-card-header">
                        <div className="form-card-icon">
                            <ClipboardList size={24} strokeWidth={1.75} />
                        </div>
                        <div>
                            <h2 className="form-card-title">New Assignment</h2>
                            <p className="form-card-subtitle">Enter the assignment information</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="form-content">
                        <div className="form-group">
                            <label htmlFor="subjectId">Select Subject</label>
                            <div className="input-wrapper">
                                <Book size={18} className="input-icon" />
                                <select
                                    id="subjectId"
                                    value={subjectId}
                                    onChange={(e) => setSubjectId(e.target.value)}
                                    style={{ paddingLeft: '2.75rem' }}
                                >
                                    <option value="">Choose a subject...</option>
                                    {subjects.map((subject) => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.code} - {subject.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label htmlFor="title">Assignment Title</label>
                                <div className="input-wrapper">
                                    <Type size={18} className="input-icon" />
                                    <input
                                        id="title"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter assignment title"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="dueDate">Due Date</label>
                                <div className="input-wrapper">
                                    <Calendar size={18} className="input-icon" />
                                    <input
                                        id="dueDate"
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        style={{ paddingLeft: '2.75rem' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the assignment..."
                                rows={4}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading || subjects.length === 0}
                        >
                            {loading ? (
                                <div className="spinner"></div>
                            ) : (
                                <>
                                    <ClipboardList size={18} />
                                    Create Assignment
                                </>
                            )}
                        </button>

                        {subjects.length === 0 && (
                            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                                No subjects assigned to you yet. Please contact admin.
                            </p>
                        )}
                    </form>
                </div>

                <div className="form-card" style={{ marginTop: '2rem' }}>
                    <div className="form-card-header">
                        <div className="form-card-icon success">
                            <ClipboardList size={24} strokeWidth={1.75} />
                        </div>
                        <div>
                            <h2 className="form-card-title">My Assignments ({assignments.length})</h2>
                            <p className="form-card-subtitle">View all your created assignments</p>
                        </div>
                    </div>

                    <div className="form-content">
                        {assignments.length === 0 ? (
                            <div className="empty-state">
                                <ClipboardList size={48} strokeWidth={1} style={{ opacity: 0.3 }} />
                                <p>No assignments created yet</p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Title</th>
                                            <th>Subject</th>
                                            <th>Due Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignments.map((assignment) => (
                                            <tr key={assignment.id}>
                                                <td>#{assignment.id}</td>
                                                <td>{assignment.title}</td>
                                                <td><span className="badge">{assignment.subject?.code}</span></td>
                                                <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
