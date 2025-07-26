import React, { useState, useEffect } from "react"
import { auth, createUserWithEmailAndPassword, updateProfile, db, collection, addDoc } from "../services/Firebase"
import { useNavigate } from "react-router-dom"
import './Register.css'

export default function Register() {
  const [form, setForm] = useState({
    nome: "",
    nascimento: "",
    email: "",
    senha: "",
    confirmaSenha: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)  // estado para sucesso
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleRegister(e) {
    e.preventDefault()

    if (form.senha !== form.confirmaSenha) {
      setError("As senhas não coincidem.")
      return
    }

    if (!form.nascimento) {
      setError("Informe sua data de nascimento.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.senha)

      await updateProfile(userCredential.user, {
        displayName: form.nome
      })

      await addDoc(collection(db, "users"), {
        uid: userCredential.user.uid,
        nome: form.nome,
        nascimento: form.nascimento,
        email: form.email,
        criadoEm: new Date()
      })

      setSucesso(true)
      setForm({ nome: "", nascimento: "", email: "", senha: "", confirmaSenha: "" })
    } catch (err) {
      setError("Erro ao registrar: " + err.message)
    }
    setLoading(false)
  }

  // redireciona automaticamente para '/' 2 segundos após sucesso
  useEffect(() => {
    if (sucesso) {
      const timer = setTimeout(() => {
        navigate('/')
      }, 2000) // aguarda 2 segundos para mostrar a mensagem
      return () => clearTimeout(timer)
    }
  }, [sucesso, navigate])

  if (sucesso) {
    return (
      <div className="register-container">
        <div className="register-form">
          <h2>Registro concluído com sucesso!</h2>
          <p>Você será redirecionado para a página inicial...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h2>Registrar Usuário</h2>

        <input
          type="text"
          name="nome"
          placeholder="Nome completo"
          value={form.nome}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="nascimento"
          placeholder="Data de nascimento"
          value={form.nascimento}
          onChange={handleChange}
          required
          max={new Date().toISOString().split("T")[0]}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          required
          minLength={6}
        />

        <input
          type="password"
          name="confirmaSenha"
          placeholder="Confirme a senha"
          value={form.confirmaSenha}
          onChange={handleChange}
          required
          minLength={6}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}
