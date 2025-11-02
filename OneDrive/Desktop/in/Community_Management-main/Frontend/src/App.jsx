import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import SignUpStep1 from './pages/SignUpStep1'
import SignUpStep2 from './pages/SignUpStep2'
import SignUpStep3 from './pages/SignUpStep3'
import TicketsPage from './pages/ticketspage'
import Dashboard from './pages/Dashboard'
import TicketDetails from './pages/TicketDetails'
import EditProfile from './pages/EditProfile'
import CreateTicket from './pages/CreateTicket'
import Home from './pages/Home'
import Members from './pages/Members'
import { isAuthenticated } from './auth'
import StartFundraiser from './pages/StartFundraiser'


function App() {
  const IndexRedirect = () => (
    isAuthenticated() ? <Navigate to="/home" /> : <Navigate to="/login" />
  );

  const PrivateRoute = ({ children }) => (
    isAuthenticated() ? children : <Navigate to="/login" />
  );

  const PublicOnlyRoute = ({ children }) => (
    isAuthenticated() ? <Navigate to="/home" /> : children
  );
  return (
    // Serve the app from the site root. Static assets are served from /static/ by Django.
    // Using a router basename of '/' prevents routes from being prefixed with '/static/'.
    <BrowserRouter basename={'/'}>
      <Routes>
        <Route path="/" element={<IndexRedirect />} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><SignUpStep1 /></PublicOnlyRoute>} />
        <Route path="/signup/step2" element={<PublicOnlyRoute><SignUpStep2 /></PublicOnlyRoute>} />
        <Route path="/signup/step3" element={<PublicOnlyRoute><SignUpStep3 /></PublicOnlyRoute>} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/members" element={<PrivateRoute><Members /></PrivateRoute>} />
        <Route path="/tickets" element={<PrivateRoute><TicketsPage /></PrivateRoute>} />
        <Route path="/tickets/create" element={<PrivateRoute><CreateTicket /></PrivateRoute>} />
        <Route path="/tickets/:id" element={<PrivateRoute><TicketDetails /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/fundraising" element={<PrivateRoute><StartFundraiser /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/home" />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App