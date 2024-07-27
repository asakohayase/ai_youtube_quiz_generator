'use server'

import { QuizResponse } from "@/types";

export async function generateQuiz(videoId: string, numQuestions: number): Promise<QuizResponse> {
  try {
    console.log('Sending request with:', { video_id: videoId, num_questions: numQuestions });
    const response = await fetch('http://127.0.0.1:8000/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_id:videoId, num_questions:numQuestions }),
    });
    if (!response.ok) {
      // throw new Error('Failed to generate quiz');
      const errorText = await response.text();
      console.error('Server responded with:', response.status, errorText);
      throw new Error(`Failed to generate quiz: ${response.status} ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
}