import './App.css'
import './main.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Projects from './pages/Projects'
import AdminChat from './pages/AdminChat'
import ChatWidget from './components/GlobalComponent/ChatWidget'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/admin/chat" element={<AdminChat />} />
        </Routes>
        <ChatWidget />
      </div>
    </Router>
  )
}

export default App
