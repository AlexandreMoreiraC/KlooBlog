import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db, collection, getDocs } from '../services/Firebase'
import '../styles/global.css'
import './Home.css'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const postsCol = collection(db, 'posts')
      const postSnapshot = await getDocs(postsCol)
      const postList = postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setPosts(postList)
      setLoading(false)
    }
    fetchPosts()
  }, [])

  return (
    <main className="home-container">
      <h1>Crônicas de Futuros Possíveis</h1>

      <section>
        <h2>Crônicas Publicadas</h2>
        {loading && <p>Carregando crônicas...</p>}
        {!loading && posts.length === 0 && <p>Nenhuma crônica publicada ainda.</p>}
        <ul className="post-list">
          {posts.map(post => (
            <li key={post.id} className="post-item">
              <Link to={`/post/${post.id}`} className="post-link">
                <h3 className="post-title">{post.title}</h3>
              </Link>
              <p className="post-meta">por <strong>{post.author}</strong></p>
              <p className="post-preview">
                {(Array.isArray(post.content) ? post.content : [])
                  .filter(block => block.type === "paragraph")
                  .map(block => block.text)
                  .join(" ")
                  .slice(0, 150) + ((Array.isArray(post.content) && post.content.length > 0) ? "..." : "")
                }
              </p>
              <Link to={`/post/${post.id}`} className="read-more">Ler crônica completa →</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
