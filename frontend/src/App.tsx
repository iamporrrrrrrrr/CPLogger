import { useState, useEffect } from 'react'
import {Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import axios from 'axios'
import './App.css'

function App() {
  const [ user, setUser ] = useState<any>(false)
  useEffect(() => {
    axios.get('http://localhost:5556/auth/login/success', {withCredentials: true})
      .then((response) => {
        console.log(response)
        if(response.status === 200 ) setUser(response.data.user)
      })
      .catch((error) => {
        console.log(error)
      })
  },[])
  return (
    <Routes>
      <Route path='/' element={user ? <Home user={user}/>: <Navigate to='/login' />} />
      <Route path='/login' element={user ? <Navigate to='/' />: <Login />} />
    </Routes>
  )
}

export default App
