import { useEffect, useState } from 'react';
import { studentAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { UserPlus, Check, Inbox } from 'lucide-react';
import './Student.css';

export function Enroll() {
    const [options, setOptions] = useState([]);
    const [selections, setSelections] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();

    useEffect(() => {
        loadOptions();
    }, []);

    const loadOptions = async () => {
        try {
            const response = await studentAPI.getEnrollmentOptions();
            setOptions(response.data);
        } catch (error) {
            toast.error('Failed to load enrollment options');
        } finally {
            setLoading(false);
        }
    };

    const handleTeacherSelect = (subjectId, teacherId) => {
        setSelections((prev) => ({
            ...prev,
            [subjectId]: teacherId,
        }));
    };

    const handleEnroll = async () => {
        const enrollments = Object.entries(selections)
            .filter(([_, teacherId]) => teacherId)
            .map(([subjectId, teacherId]) => ({
                subjectId: parseInt(subjectId),
                teacherId: parseInt(teacherId),
            }));

        if (enrollments.length === 0) {
            toast.warning('Please select at least one subject with a teacher');
            return;
        }

        setSubmitting(true);
        try {
            await studentAPI.enroll(enrollments);
            toast.success('Enrolled successfully!');
            setSelections({});
            loadOptions();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to enroll');
        } finally {
            setSubmitting(false);
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
                <h1 className="page-title">Enroll in Courses</h1>
                <p className="page-description">Browse available subjects and select a teacher</p>
            </div>

            {options.length === 0 ? (
                <div className="empty-state">
                    <Inbox size={48} className="empty-state-icon" />
                    <h3>No Courses Available</h3>
                    <p>There are no courses available for enrollment at this time.</p>
                </div>
            ) : (
                <>
                    <div className="enrollment-list">
                        {options.map((option) => (
                            <div key={option.subjectId} className="enrollment-option">
                                <h3 className="enrollment-subject">{option.subjectName}</h3>
                                <div className="teacher-select">
                                    <label htmlFor={`teacher-${option.subjectId}`}>Select Teacher:</label>
                                    <select
                                        id={`teacher-${option.subjectId}`}
                                        value={selections[option.subjectId] || ''}
                                        onChange={(e) => handleTeacherSelect(option.subjectId, e.target.value)}
                                    >
                                        <option value="">Choose a teacher...</option>
                                        {option.teachers.map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleEnroll}
                            disabled={submitting || Object.keys(selections).length === 0}
                        >
                            {submitting ? (
                                <div className="spinner"></div>
                            ) : (
                                <>
                                    <Check size={18} />
                                    Confirm Enrollment
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
