import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import AdminLayout from './components/Layout/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import ClientView from './pages/Admin/ClientView';
import ClientLayout from './components/Layout/ClientLayout';
import ClientDashboard from './pages/Client/ClientDashboard';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white font-sans transition-colors duration-300">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="client/:clientId" element={<ClientView />} />
              <Route path="clients" element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Client Routes */}
            <Route path="/client" element={<ClientLayout />}>
              <Route path="dashboard" element={<ClientDashboard />} />
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
