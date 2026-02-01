import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Book, Hash, Type, Search } from 'lucide-react';
import '../FormPage.css';

export function ManageSubjects() {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const toast = useToast();

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            const response = await adminAPI.getSubjects();
            setSubjects(response.data);
        } catch (error) {
            toast.error('Failed to load subjects');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !code) {
            toast.warning('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await adminAPI.createSubject({ name, code });
            toast.success('Subject created successfully!');
            setName('');
            setCode('');
            loadSubjects();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create subject');
        } finally {
            setLoading(false);
        }
    };

    const filteredSubjects = subjects.filter(subject =>
        subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="form-page animate-fadeIn">
            <div className="page-header">
                <h1 className="page-title">Manage Subjects</h1>
                <p className="page-description">Create and view subjects in the curriculum</p>
            </div>

            <div className="form-container" style={{ maxWidth: '1200px' }}>
                <div className="form-card">
                    <div className="form-card-header">
                        <div className="form-card-icon subject">
                            <Book size={24} strokeWidth={1.75} />
                        </div>
                        <div>
                            <h2 className="form-card-title">Add New Subject</h2>
                            <p className="form-card-subtitle">Enter the information for the new subject</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="form-content">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label htmlFor="name">Subject Name</label>
                                <div className="input-wrapper">
                                    <Type size={18} className="input-icon" />
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., Mathematics"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="code">Subject Code</label>
                                <div className="input-wrapper">
                                    <Hash size={18} className="input-icon" />
                                    <input
                                        id="code"
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        placeholder="e.g., MATH101"
                                    />
                                </div>
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
                                    <Book size={18} />
                                    Create Subject
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="form-card" style={{ marginTop: '2rem' }}>
                    <div className="form-card-header">
                        <div className="form-card-icon warning">
                            <Book size={24} strokeWidth={1.75} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 className="form-card-title">Subjects List ({subjects.length})</h2>
                            <p className="form-card-subtitle">View all available subjects</p>
                        </div>
                        <div className="input-wrapper" style={{ maxWidth: '300px', margin: 0 }}>
                            <Search size={18} className="input-icon" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search subjects..."
                            />
                        </div>
                    </div>

                    <div className="form-content">
                        {filteredSubjects.length === 0 ? (
                            <div className="empty-state">
                                <Book size={48} strokeWidth={1} style={{ opacity: 0.3 }} />
                                <p>No subjects found</p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Code</th>
                                            <th>Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSubjects.map((subject) => (
                                            <tr key={subject.id}>
                                                <td>#{subject.id}</td>
                                                <td><span className="badge">{subject.code}</span></td>
                                                <td>{subject.name}</td>
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
