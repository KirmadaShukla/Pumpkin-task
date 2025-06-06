import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './Login'
import SignupPage from './Signup'
import './App.css'
import { useSelector } from 'react-redux'
import ChatPage from './Chat'

function App() {
  const { isAuth } = useSelector(state => state.user)
  return (
    <Routes>
      <Route path="/" element={isAuth ? <Navigate to="/chat" /> : <Navigate to="/login" />} />
      <Route path='/login' element={!isAuth ? <LoginPage /> : <Navigate to="/chat" />} />
      <Route path='/signup' element={!isAuth ? <SignupPage /> : <Navigate to="/chat" />} />
      <Route path='/chat' element={isAuth ? <ChatPage /> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default App
