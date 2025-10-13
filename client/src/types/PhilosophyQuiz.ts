export type QuizResult = {
  classification: string;
  primary: string;
  secondary: string;
  scores: Record<string, number>;
  confidence: number;
  completedAt: string;
};

export type PhilosophyQuizProps = {
  onComplete: (result: QuizResult) => void;
  onSkip: () => void;
  showSkipOption?: boolean;
};

