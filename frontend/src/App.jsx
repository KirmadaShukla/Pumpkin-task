import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './Login'
import SignupPage from './Signup'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />
    </Routes>
  )
}

export default App
