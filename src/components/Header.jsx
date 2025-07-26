import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  auth,
  onAuthStateChanged,
  db,
  doc,
  getDoc,
  signOut
} from '../services/Firebase'
import './Header.css'

export default function Header() {
  const [user, setUser] = useState(null)
  const [nome, setNome] = useState(null)  // null = ainda carregando
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        // Exibe displayName/email enquanto busca Firestore
        setNome(currentUser.displayName || currentUser.email)

        const ref = doc(db, "users", currentUser.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setNome(snap.data().nome)
        }
      } else {
        setNome("")
      }
    })
    return () => unsubscribe()
  }, [])

  async function handleLogout() {
    try {
      await signOut(auth)
      setUser(null)
      setNome("")
      navigate('/')
    } catch (error) {
      console.error("Erro ao sair:", error)
    }
  }

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">Kloo</Link>
        <nav>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          <NavLink to="/sobre" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Sobre</NavLink>

          {!user && (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Login</NavLink>
            </>
          )}

          {user && (
            <>
              <span className="nav-user">Olá, {nome === null ? "Carregando..." : nome}</span>
              {user.email.toLowerCase() === "admin@kloo.com" && (
                <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Painel Administrador</NavLink>
              )}
              <button onClick={handleLogout} className="nav-logout-button">Sair</button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}