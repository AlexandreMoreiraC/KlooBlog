import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db, doc, getDoc } from '../services/Firebase'
import './Post.css'

export default function Post() {
  const { id } = useParams()
  const [cronica, setCronica] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchCronica() {
      try {
        const docRef = doc(db, "posts", id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setCronica(docSnap.data())
          setError("")
        } else {
          setError("Crônica não encontrada.")
        }
      } catch {
        setError("Erro ao carregar a crônica.")
      } finally {
        setLoading(false)
      }
    }
    fetchCronica()
  }, [id])

  if (loading) {
    return <main className="post-container"><p>Carregando...</p></main>
  }

  if (error) {
    return <main className="post-container"><p>{error}</p></main>
  }

  return (
    <main className="post-container">
      <h1 className="post-title">{cronica.title}</h1>
      <p className="post-author">Autor: <strong>{cronica.author}</strong></p>
      <article className="post-content">
        {cronica.content.map((block, index) => {
          if (block.type === 'paragraph') {
            return <p key={index}>{block.text}</p>
          }
          if (block.type === 'image') {
            return <img key={index} src={block.url} alt={block.alt || ''} className="post-image" />
          }
          return null
        })}
      </article>
    </main>
  )
}
