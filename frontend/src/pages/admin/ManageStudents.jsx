import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { UserPlus, Mail, Lock, User, GraduationCap, Search } from 'lucide-react';
import '../FormPage.css';

export function ManageStudents() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const toast = useToast();

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const response = await adminAPI.getStudents();
            setStudents(response.data);
        } catch (error) {
            toast.error('Failed to load students');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toast.warning('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await adminAPI.createStudent({ name, email, password });
            toast.success('Student created successfully!');
            setName('');
            setEmail('');
            setPassword('');
            loadStudents();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create student');
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="form-page animate-fadeIn">
            <div className="page-header">
                <h1 className="page-title">Manage Students</h1>
                <p className="page-description">Create and view student accounts</p>
            </div>

            <div className="form-container" style={{ maxWidth: '1200px' }}>
                <div className="form-card">
                    <div className="form-card-header">
                        <div className="form-card-icon student">
                            <UserPlus size={24} strokeWidth={1.75} />
                        </div>
                        <div>
                            <h2 className="form-card-title">Add New Student</h2>
                            <p className="form-card-subtitle">Enter the details for the new student</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="form-content">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <div className="input-wrapper">
                                    <User size={18} className="input-icon" />
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter student's full name"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter email address"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="spinner"></div>
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    Create Student
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="form-card" style={{ marginTop: '2rem' }}>
                    <div className="form-card-header">
                        <div className="form-card-icon success">
                            <GraduationCap size={24} strokeWidth={1.75} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 className="form-card-title">Students List ({students.length})</h2>
                            <p className="form-card-subtitle">View all registered students</p>
                        </div>
                        <div className="input-wrapper" style={{ maxWidth: '300px', margin: 0 }}>
                            <Search size={18} className="input-icon" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search students..."
                            />
                        </div>
                    </div>

                    <div className="form-content">
                        {filteredStudents.length === 0 ? (
                            <div className="empty-state">
                                <GraduationCap size={48} strokeWidth={1} style={{ opacity: 0.3 }} />
                                <p>No students found</p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStudents.map((student) => (
                                            <tr key={student.id}>
                                                <td>#{student.id}</td>
                                                <td>{student.name}</td>
                                                <td>{student.email}</td>
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
