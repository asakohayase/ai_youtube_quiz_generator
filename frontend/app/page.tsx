'use client'

import { useState, FormEvent } from 'react'
import { generateQuiz } from './actions'
import { QuizQuestion } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


export default function Home() {
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData(event.currentTarget)
      const videoId = formData.get('videoId') as string
      const num_questions = parseInt(formData.get('numQuestions') as string, 10)
      const data = await generateQuiz(videoId, num_questions)
      setQuiz(data.quiz)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue p-8">
        <Card className="max-w-2xl mx-auto bg-white shadow-lg">
          <CardHeader >
            <CardTitle className="text-2xl font-bold text-gray">YouTube Quiz Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="videoId">YouTube Video ID</Label>
                <Input id="videoId" name="videoId" placeholder="Enter YouTube Video ID" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numQuestions">Number of Questions</Label>
                <Input id="numQuestions" name="numQuestions" type="number" min="1" max="15" required className="text-black text-sm" />
              </div>
              
              <Button type="submit" disabled={loading} className="w-full bg-limeGreen hover:bg-green text-white">
              {loading ? 'Generating Quiz...' : 'Generate Quiz'}
              </Button>
            </form>
          </CardContent>
        </Card>
           
      {quiz && (
        <Card className="mt-8 max-w-2xl mx-auto bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray">Quiz Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <pre>{JSON.stringify(quiz, null, 2)}</pre>
          </CardContent>
        </Card>)}
    </div>
  )
}