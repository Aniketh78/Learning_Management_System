import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Link as LinkIcon, Users, Book } from 'lucide-react';
import '../FormPage.css';

export function AssignTeacher() {
    const [teacherId, setTeacherId] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const toast = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [teachersRes, subjectsRes] = await Promise.all([
                adminAPI.getTeachers(),
                adminAPI.getSubjects(),
            ]);
            setTeachers(teachersRes.data);
            setSubjects(subjectsRes.data);
        } catch (error) {
            toast.error('Failed to load data');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!teacherId || !subjectId) {
            toast.warning('Please select both teacher and subject');
            return;
        }

        setLoading(true);
        try {
            await adminAPI.assignTeacher(parseInt(teacherId), parseInt(subjectId));
            toast.success('Teacher assigned successfully!');
            setTeacherId('');
            setSubjectId('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to assign teacher');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page animate-fadeIn">
            <div className="page-header">
                <h1 className="page-title">Assign Teacher</h1>
                <p className="page-description">Link a teacher to a subject they will teach</p>
            </div>

            <div className="form-container">
                <div className="form-card">
                    <div className="form-card-header">
                        <div className="form-card-icon assign">
                            <LinkIcon size={24} strokeWidth={1.75} />
                        </div>
                        <div>
                            <h2 className="form-card-title">Assignment Details</h2>
                            <p className="form-card-subtitle">Select teacher and subject to assign</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="form-content">
                        <div className="form-group">
                            <label htmlFor="teacherId">Select Teacher</label>
                            <div className="input-wrapper">
                                <Users size={18} className="input-icon" />
                                <select
                                    id="teacherId"
                                    value={teacherId}
                                    onChange={(e) => setTeacherId(e.target.value)}
                                    style={{ paddingLeft: '2.75rem' }}
                                >
                                    <option value="">Choose a teacher...</option>
                                    {teachers.map((teacher) => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.name} ({teacher.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

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

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading || teachers.length === 0 || subjects.length === 0}
                        >
                            {loading ? (
                                <div className="spinner"></div>
                            ) : (
                                <>
                                    <LinkIcon size={18} />
                                    Assign Teacher
                                </>
                            )}
                        </button>

                        {(teachers.length === 0 || subjects.length === 0) && (
                            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                                {teachers.length === 0 && 'Please create teachers first. '}
                                {subjects.length === 0 && 'Please create subjects first.'}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
