import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Home'
import AdminDashboard from './components/Admin/AdminDashboard'

function App() {

  return (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin' element={<AdminDashboard />} />
      </Routes>
  )
}

export default App
