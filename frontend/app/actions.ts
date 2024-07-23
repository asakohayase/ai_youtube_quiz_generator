'use server'

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
}

interface QuizResponse {
  quiz: QuizQuestion[];
}

export async function generateQuiz(videoId: string, numQuestions: number): Promise<QuizResponse> {
  try {
    const response = await fetch('http://localhost:8000/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, numQuestions }),
    });
    if (!response.ok) {
      throw new Error('Failed to generate quiz');
    }
    return await response.json();
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
}