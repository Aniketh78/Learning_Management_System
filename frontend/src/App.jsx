import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LoginPage } from './pages/Login';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { ManageTeachers } from './pages/admin/ManageTeachers';
import { ManageStudents } from './pages/admin/ManageStudents';
import { ManageSubjects } from './pages/admin/ManageSubjects';
import { AssignTeacher } from './pages/admin/AssignTeacher';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/Dashboard';
import { CreateAssignment } from './pages/teacher/CreateAssignment';
import { ViewSubmissions } from './pages/teacher/ViewSubmissions';

// Student Pages
import { StudentDashboard } from './pages/student/Dashboard';
import { MySubjects } from './pages/student/MySubjects';
import { Enroll } from './pages/student/Enroll';
import { Assignments } from './pages/student/Assignments';

function HomeRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    case 'TEACHER':
      return <Navigate to="/teacher" replace />;
    case 'STUDENT':
      return <Navigate to="/student" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

function NotFound() {
  return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

function Unauthorized() {
  return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <h2>Unauthorized</h2>
      <p>You don't have permission to access this page.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="teachers" element={<ManageTeachers />} />
              <Route path="students" element={<ManageStudents />} />
              <Route path="subjects" element={<ManageSubjects />} />
              <Route path="assign" element={<AssignTeacher />} />
            </Route>

            {/* Teacher Routes */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute allowedRoles={['TEACHER']}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<TeacherDashboard />} />
              <Route path="assignments" element={<CreateAssignment />} />
              <Route path="submissions" element={<ViewSubmissions />} />
            </Route>

            {/* Student Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentDashboard />} />
              <Route path="subjects" element={<MySubjects />} />
              <Route path="enroll" element={<Enroll />} />
              <Route path="assignments" element={<Assignments />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
