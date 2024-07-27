'use client'

import { useState, FormEvent } from 'react'
import { generateQuiz } from './actions'
import { QuizQuestion } from '@/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'


export default function Home() {
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

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

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setUserAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[questionIndex] = answer;
      return newAnswers;
    });
  };

  const handleQuizSubmit = () => {
    setShowResults(true);
  };

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
                <Input id="numQuestions" name="numQuestions" type="number" min="1" max="15" required className="text-gray text-sm" />
              </div>
              
              <Button type="submit" disabled={loading} className="w-full bg-limeGreen text-white">
              {loading ? 'Generating Quiz...' : 'Generate Quiz'}
              </Button>
            </form>
          </CardContent>
        </Card>
           
      {quiz && (
        <Card className="mt-8 max-w-2xl mx-auto bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray">Quiz Time! : Show What You Learned ⭐</CardTitle>
          </CardHeader>
          <CardContent>
            {quiz.map((q, index) =>( 
               <div key={q.question} className="mb-6 p-4 bg-yellow rounded-lg">
                <h3 className="font-semibold mb-2">{q.question}</h3>
                <RadioGroup onValueChange={(value) => handleAnswerChange(index, value)} className="space-y-2">
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center">
                    <RadioGroupItem value={option} id={`q${index}-option${optionIndex}`} />
                    <Label htmlFor={`q${index}-option${optionIndex}`} className="ml-2">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              {showResults&&(
                <div className="mt-2">
                  <p className={`font-semibold ${userAnswers[index] === q.correct_answer ? 'text-green' : 'text-pink'}`}>
                      {userAnswers[index] === q.correct_answer ? 'Correct!' : 'Incorrect'}
                    </p>
                  <p>Correct answer: {q.correct_answer}</p>
                  <p className="mt-1 text-sm text-gray">Explanation: {q.explanation}</p>
                </div>)}
               </div>
              ))}
          </CardContent>
          <CardFooter>
            <Button onClick={handleQuizSubmit} className="w-full bg-pink text-white">
              Check Your Answers
            </Button>
          </CardFooter>
        </Card>)}
    </div>
  )
}