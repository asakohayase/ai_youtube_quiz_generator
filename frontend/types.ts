export interface QuizQuestion {
    question: string;
    options: string[];
    correct_answer: number;
}

  
export interface QuizResponse {
    quiz: QuizQuestion[];
}
  