import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
};

// Admin API
export const adminAPI = {
    createTeacher: (data) => api.post('/admin/teacher', data),
    createStudent: (data) => api.post('/admin/student', data),
    createSubject: (data) => api.post('/admin/subjects', data),
    assignTeacher: (teacherId, subjectId) => api.post('/admin/assign', { teacherId, subjectId }),
    getTeachers: () => api.get('/admin/teachers'),
    getStudents: () => api.get('/admin/students'),
    getSubjects: () => api.get('/admin/subjects'),
};

// Student API
export const studentAPI = {
    getEnrollmentOptions: () => api.get('/student/enroll/options'),
    enroll: (enrollments) => api.post('/student/enroll', enrollments),
    getMySubjects: () => api.get('/student/enroll/my-subjects'),
    getMyAssignments: () => api.get('/student/enroll/my-assignments'),
    getAssignmentsBySubject: (subjectId) => api.get(`/student/enroll/subject/${subjectId}/assignments`),
    submitAssignment: (assignmentId, content) => api.post('/student/submissions', { assignmentId, content }),
};

// Teacher API
export const teacherAPI = {
    createAssignment: (data) => api.post('/teacher/assignments', data),
    getSubmissions: (assignmentId) => api.get(`/teacher/submissions/assignment/${assignmentId}`),
    getMySubjects: () => api.get('/teacher/subjects'),
    getMyAssignments: () => api.get('/teacher/assignments'),
};

export default api;
