import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { UserPlus, Mail, Lock, User, Users, Search } from 'lucide-react';
import '../FormPage.css';

export function ManageTeachers() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const toast = useToast();

    useEffect(() => {
        loadTeachers();
    }, []);

    const loadTeachers = async () => {
        try {
            const response = await adminAPI.getTeachers();
            setTeachers(response.data);
        } catch (error) {
            toast.error('Failed to load teachers');
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
            await adminAPI.createTeacher({ name, email, password });
            toast.success('Teacher created successfully!');
            setName('');
            setEmail('');
            setPassword('');
            loadTeachers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create teacher');
        } finally {
            setLoading(false);
        }
    };

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="form-page animate-fadeIn">
            <div className="page-header">
                <h1 className="page-title">Manage Teachers</h1>
                <p className="page-description">Create and view teacher accounts</p>
            </div>

            <div className="form-container" style={{ maxWidth: '1200px' }}>
                <div className="form-card">
                    <div className="form-card-header">
                        <div className="form-card-icon">
                            <UserPlus size={24} strokeWidth={1.75} />
                        </div>
                        <div>
                            <h2 className="form-card-title">Add New Teacher</h2>
                            <p className="form-card-subtitle">Enter the details for the new teacher</p>
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
                                        placeholder="Enter teacher's full name"
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
                                    Create Teacher
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="form-card" style={{ marginTop: '2rem' }}>
                    <div className="form-card-header">
                        <div className="form-card-icon success">
                            <Users size={24} strokeWidth={1.75} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 className="form-card-title">Teachers List ({teachers.length})</h2>
                            <p className="form-card-subtitle">View all registered teachers</p>
                        </div>
                        <div className="input-wrapper" style={{ maxWidth: '300px', margin: 0 }}>
                            <Search size={18} className="input-icon" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search teachers..."
                            />
                        </div>
                    </div>

                    <div className="form-content">
                        {filteredTeachers.length === 0 ? (
                            <div className="empty-state">
                                <Users size={48} strokeWidth={1} style={{ opacity: 0.3 }} />
                                <p>No teachers found</p>
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
                                        {filteredTeachers.map((teacher) => (
                                            <tr key={teacher.id}>
                                                <td>#{teacher.id}</td>
                                                <td>{teacher.name}</td>
                                                <td>{teacher.email}</td>
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
