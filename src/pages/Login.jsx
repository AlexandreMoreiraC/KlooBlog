import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth, signInWithEmailAndPassword } from "../services/Firebase"
import './Login.css'  // importando o CSS

export default function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, senha)
      navigate("/")  // redireciona para a Home após login
    } catch (err) {
      setErro("Email ou senha inválidos.")
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
        {erro && <p className="login-error">{erro}</p>}
      </form>
    </div>
  )
}
