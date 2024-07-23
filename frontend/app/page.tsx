'use client'

import { useState, FormEvent } from 'react'
import { generateQuiz } from './actions'
import { QuizQuestion } from '@/types'


export default function Home() {
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData(event.currentTarget)
      const videoId = formData.get('videoId') as string
      const numQuestions = parseInt(formData.get('numQuestions') as string, 10)
      const data = await generateQuiz(videoId, numQuestions)
      setQuiz(data.quiz)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="videoId" placeholder="YouTube Video ID" className="text-black text-sm" required />
        <input name="numQuestions" type="number" min="1" max="15" className="text-black text-sm" required />
        <button type="submit" disabled={loading}>Generate Quiz</button>
      </form>
      {loading && <p>Loading...</p>}
      {quiz && <pre>{JSON.stringify(quiz, null, 2)}</pre>}
    </div>
  )
}