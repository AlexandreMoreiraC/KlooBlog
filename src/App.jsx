import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Header from "./components/Header"
import Footer from "./components/Footer"

import Home from "./pages/Home"
import Post from "./pages/Post"
import Sobre from "./pages/Sobre"
import Admin from "./pages/Admin"
import Login from "./pages/Login"
import Register from "./pages/Register"

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Post/:id" element={<Post />} />
            <Route path="/Sobre" element={<Sobre />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}