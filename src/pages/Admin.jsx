import React, { useState, useEffect } from "react"
import {
  auth,
  signInWithEmailAndPassword,
  signOut,
  db,
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "../services/Firebase"
import "./Admin.css"

export default function Admin() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [posts, setPosts] = useState([])

  const [form, setForm] = useState({
    id: "",
    title: "",
    author: "",
    content: [{ type: "paragraph", text: "" }],
  })

  function criarSlug(texto) {
    return texto.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
  }

  async function login(email, password) {
    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      setError("")
      await fetchPosts()
    } catch (err) {
      setError("Erro ao fazer login: " + err.message)
    }
    setLoading(false)
  }

  async function logout() {
    await signOut(auth)
    setUser(null)
    setForm({ id: "", title: "", author: "", content: [{ type: "paragraph", text: "" }] })
    setPosts([])
  }

  async function fetchPosts() {
    const postsCol = collection(db, "posts")
    const postSnapshot = await getDocs(postsCol)
    const postList = postSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    setPosts(postList)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        await fetchPosts()
      } else {
        setUser(null)
        setPosts([])
      }
    })
    return () => unsubscribe()
  }, [])

  async function handleSave() {
    if (!user || user.email.toLowerCase() !== "admin@kloo.com") {
      setError("Você não tem permissão para publicar.")
      return
    }
    if (!form.title || !form.author || !form.content.length) {
      setError("Preencha todos os campos.")
      return
    }
    setLoading(true)
    try {
      const idPersonalizado = form.id || criarSlug(form.title)
      if (form.id) {
        const postRef = doc(db, "posts", form.id)
        await updateDoc(postRef, { title: form.title, author: form.author, content: form.content })
      } else {
        const postRef = doc(db, "posts", idPersonalizado)
        await setDoc(postRef, { title: form.title, author: form.author, content: form.content, criadoEm: new Date() })
      }
      setForm({ id: "", title: "", author: "", content: [{ type: "paragraph", text: "" }] })
      await fetchPosts()
      setError("")
    } catch (err) {
      setError("Erro ao salvar: " + err.message)
    }
    setLoading(false)
  }

  function handleEdit(post) {
    if (!user || user.email.toLowerCase() !== "admin@kloo.com") {
      setError("Você não tem permissão para editar.")
      return
    }
    setForm(post)
  }

  async function handleDelete(id) {
    if (!user || user.email.toLowerCase() !== "admin@kloo.com") {
      setError("Você não tem permissão para excluir.")
      return
    }
    setLoading(true)
    try {
      await deleteDoc(doc(db, "posts", id))
      await fetchPosts()
      setError("")
    } catch (err) {
      setError("Erro ao excluir: " + err.message)
    }
    setLoading(false)
  }

  function handleChangeTitleAuthor(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleChangeContentText(index, e) {
    const newContent = [...form.content]
    newContent[index].text = e.target.value
    setForm({ ...form, content: newContent })
  }

  function handleAddParagraph() {
    setForm({ ...form, content: [...form.content, { type: "paragraph", text: "" }] })
  }

  function handleAddImage() {
    setForm({ ...form, content: [...form.content, { type: "image", url: "", alt: "" }] })
  }

  function handleChangeImageUrl(index, e) {
    const newContent = [...form.content]
    newContent[index].url = e.target.value
    setForm({ ...form, content: newContent })
  }

  function handleChangeImageAlt(index, e) {
    const newContent = [...form.content]
    newContent[index].alt = e.target.value
    setForm({ ...form, content: newContent })
  }

  function handleRemoveBlock(index) {
    const newContent = form.content.filter((_, i) => i !== index)
    setForm({ ...form, content: newContent })
  }

  if (!user) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Login</h1>
        <LoginForm onLogin={login} loading={loading} error={error} />
      </main>
    )
  }

  if (user.email.toLowerCase() !== "admin@kloo.com") {
    return (
      <main style={{ padding: "2rem" }}>
        <p>Você não tem permissão para acessar esta página.</p>
      </main>
    )
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Administração de Crônicas</h1>
      <p>
        Logado como: <strong>{user.email}</strong>
      </p>
      <button onClick={logout} style={{ marginBottom: "1rem" }}>
        Sair
      </button>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Nova / Editar Crônica</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
        >
          <input
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleChangeTitleAuthor}
            required
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <input
            name="author"
            placeholder="Autor"
            value={form.author}
            onChange={handleChangeTitleAuthor}
            required
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />

          {form.content.map((block, index) => {
            if (block.type === "paragraph") {
              return (
                <div key={index} style={{ marginBottom: "1rem" }}>
                  <textarea
                    placeholder="Parágrafo"
                    value={block.text}
                    onChange={(e) => handleChangeContentText(index, e)}
                    rows="4"
                    style={{ width: "100%" }}
                    required
                  />
                  <button type="button" onClick={() => handleRemoveBlock(index)} style={{ marginTop: "0.25rem" }}>
                    Remover bloco
                  </button>
                </div>
              )
            }
            if (block.type === "image") {
              return (
                <div key={index} style={{ marginBottom: "1rem" }}>
                  <input
                    type="text"
                    placeholder="URL da imagem"
                    value={block.url}
                    onChange={(e) => handleChangeImageUrl(index, e)}
                    style={{ width: "100%", marginBottom: "0.25rem" }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Texto alternativo (alt)"
                    value={block.alt}
                    onChange={(e) => handleChangeImageAlt(index, e)}
                    style={{ width: "100%", marginBottom: "0.25rem" }}
                  />
                  <button type="button" onClick={() => handleRemoveBlock(index)}>
                    Remover bloco
                  </button>
                </div>
              )
            }
            return null
          })}

          <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <button type="button" onClick={handleAddParagraph} style={{ marginRight: "0.5rem" }}>
              Adicionar Parágrafo
            </button>
            <button type="button" onClick={handleAddImage}>
              Adicionar Imagem
            </button>
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Salvando..." : form.id ? "Atualizar" : "Publicar"}
          </button>
        </form>
      </section>

      <section>
        <h2>Crônicas publicadas</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: "1rem" }}>
              <strong>{post.title}</strong> - <em>{post.author}</em>
              <button onClick={() => handleEdit(post)} style={{ marginLeft: "1rem" }}>
                Editar
              </button>
              <button onClick={() => handleDelete(post.id)} style={{ marginLeft: "0.5rem" }}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

function LoginForm({ onLogin, loading, error }) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  function handleSubmit(e) {
    e.preventDefault()
    onLogin(email, password)
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320 }}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
      <button type="submit" disabled={loading} style={{ width: "100%" }}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
    </form>
  )
}