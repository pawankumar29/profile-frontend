import './App.css'
import './main.css'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import Projects from './pages/Projects'
import AdminChat from './pages/AdminChat'
import ChatWidget from './components/GlobalComponent/ChatWidget'

import Payment from './pages/Payment'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import { hasValidSession } from './lib/auth'
import ContactPage from './pages/contact'



function ProtectedAdminRoute({ children }) {
  if (!hasValidSession()) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={< ContactPage />} />

          <Route
            path="/admin/chat"
            element={
              <ProtectedAdminRoute>
                <AdminChat />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
        </Routes>
        <ChatWidget />
      </div>
    </Router>
  )
}

export default App
