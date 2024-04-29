import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home, About, Profile, Signin, Signup, CreateListing, UpdateListing } from "./pages"
import Header from './components/Header'
import Private from './components/Private'

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route element={<Private />} >
          <Route path='/profile' element={<Profile />} />
          <Route path='/createlisting' element={<CreateListing />} />
          <Route path='/updatelisting/:listingId' element={<UpdateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App