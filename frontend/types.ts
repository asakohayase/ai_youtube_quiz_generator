export interface QuizQuestion {
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}

  
export interface QuizResponse {
    quiz: QuizQuestion[];
}
  