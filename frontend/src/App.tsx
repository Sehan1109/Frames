import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Home'
import AdminDashboard from './components/Admin/AdminDashboard'
import CategoryPage from './components/CollectionPage/CollectionPage'
import ItemPage from './components/ItemPage/ItemPage'

function App() {

  return (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/category/:category' element={<CategoryPage />} />
        <Route path='/item/:id' element={<ItemPage />} />
      </Routes>
  )
}

export default App
