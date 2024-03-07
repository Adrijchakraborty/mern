import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home, About, Profile, Signin, Signup} from "./pages"
import Header from './components/Header'

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App