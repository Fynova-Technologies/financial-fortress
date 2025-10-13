import React, { useState } from 'react';
import { ChevronLeft, CheckCircle } from 'lucide-react';

type PhilosophyKey = 'FIRE' | 'Balanced' | 'YOLO' | 'Conservative' | 'Aggressive';

type OptionScore = Partial<Record<PhilosophyKey, number>>;

type QuestionOption = {
  label: string;
  scores: OptionScore;
};

type Question = {
  id: number;
  text: string;
  options: QuestionOption[];
};

type FinancialData = {
  income: number;
  expenses: number;
  debt: number;
  savingsRate: number;
  dti: number;
  emergencyFund: number;
  netWorthGrowth: number;
};

type QuizResult = {
  classification: string;
  primary: string;
  secondary: string;
  scores: Record<string, number>;
  confidence: number;
  completedAt: string;
};

type PhilosophyQuizProps = {
  onComplete?: (result: QuizResult) => void;
  onSkip?: () => void;
  showSkipOption?: boolean;
};

const PhilosophyQuiz: React.FC<PhilosophyQuizProps> = ({
    onComplete,
    onSkip,
    showSkipOption
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const [financialData] = useState<FinancialData>({
    income: 5000,
    expenses: 3500,
    debt: 500,
    savingsRate: 30,
    dti: 10,
    emergencyFund: 4,
    netWorthGrowth: 8
  });

  const questions: Question[] = [
    {
      id: 1,
      text: "When you get extra income, what do you usually do?",
      options: [
        { label: "A. Save/invest all", scores: { FIRE: 2 } },
        { label: "B. Save most, enjoy a little", scores: { Balanced: 2 } },
        { label: "C. Spend on experiences", scores: { YOLO: 2 } },
        { label: "D. Pay off debts", scores: { Conservative: 2 } },
        { label: "E. Take investment risk", scores: { Aggressive: 2 } }
      ]
    },
    {
      id: 2,
      text: "How do you feel about taking investment risks?",
      options: [
        { label: "A. Hate risk", scores: { Conservative: 2 } },
        { label: "B. Prefer stable returns", scores: { Balanced: 2 } },
        { label: "C. Take moderate risks", scores: { Aggressive: 2 } },
        { label: "D. Take big risks for high rewards", scores: { FIRE: 2, Aggressive: 1 } },
        { label: "E. Don't care much", scores: { YOLO: 2 } }
      ]
    },
    {
      id: 3,
      text: "How important is retiring early to you?",
      options: [
        { label: "A. Extremely important", scores: { FIRE: 3 } },
        { label: "B. Somewhat important", scores: { Balanced: 1 } },
        { label: "C. Not important", scores: { YOLO: 2 } },
        { label: "D. I prefer financial security", scores: { Conservative: 2 } }
      ]
    },
    {
      id: 4,
      text: "What best describes your spending habit?",
      options: [
        { label: "A. Track every expense", scores: { FIRE: 2 } },
        { label: "B. Spend within budget", scores: { Balanced: 2 } },
        { label: "C. Enjoy today, save later", scores: { YOLO: 2 } },
        { label: "D. Avoid unnecessary spending", scores: { Conservative: 2 } }
      ]
    },
    {
      id: 5,
      text: "How would you handle a market crash?",
      options: [
        { label: "A. Panic and withdraw", scores: { Conservative: 2 } },
        { label: "B. Wait and watch", scores: { Balanced: 2 } },
        { label: "C. Buy more (opportunity!)", scores: { FIRE: 2, Aggressive: 1 } },
        { label: "D. Ignore it", scores: { YOLO: 2 } }
      ]
    },
    {
      id: 6,
      text: "What motivates you financially?",
      options: [
        { label: "A. Independence and freedom", scores: { FIRE: 2 } },
        { label: "B. Stability and peace", scores: { Conservative: 2 } },
        { label: "C. Balanced lifestyle", scores: { Balanced: 2 } },
        { label: "D. Living life fully", scores: { YOLO: 2 } },
        { label: "E. Outperforming others", scores: { Aggressive: 2 } }
      ]
    },
    {
      id: 7,
      text: "How long is your financial planning horizon?",
      options: [
        { label: "A. >15 years", scores: { FIRE: 2 } },
        { label: "B. 5–10 years", scores: { Balanced: 2 } },
        { label: "C. <2 years", scores: { YOLO: 2 } },
        { label: "D. Focused on short-term security", scores: { Conservative: 2 } }
      ]
    },
    {
      id: 8,
      text: "How do you use credit or loans?",
      options: [
        { label: "A. Avoid debt at all cost", scores: { FIRE: 1, Conservative: 2 } },
        { label: "B. Use strategically", scores: { Balanced: 2 } },
        { label: "C. Use freely, can pay later", scores: { YOLO: 2 } },
        { label: "D. Leverage debt for investments", scores: { Aggressive: 2 } }
      ]
    },
    {
      id: 9,
      text: "You receive a $5,000 bonus. You would:",
      options: [
        { label: "A. Invest it immediately", scores: { FIRE: 2, Aggressive: 1 } },
        { label: "B. Save part, enjoy part", scores: { Balanced: 2 } },
        { label: "C. Spend it all on travel", scores: { YOLO: 3 } },
        { label: "D. Pay off loans", scores: { Conservative: 2 } }
      ]
    },
    {
      id: 10,
      text: "How often do you check your financial progress?",
      options: [
        { label: "A. Weekly", scores: { FIRE: 2 } },
        { label: "B. Monthly", scores: { Balanced: 2 } },
        { label: "C. Rarely", scores: { YOLO: 2 } },
        { label: "D. When in trouble", scores: { Conservative: 2 } }
      ]
    }
  ];

  const calculateResults = (answersToUse = answers) => {
    const scores: Record<PhilosophyKey, number> = {
      FIRE: 0,
      Balanced: 0,
      YOLO: 0,
      Conservative: 0,
      Aggressive: 0
    };

    Object.entries(answersToUse).forEach(([qIndexStr, optionIndex]) => {
      const qIndex = Number(qIndexStr);
      const question = questions[qIndex];
      if (!question) return;
      const option = question.options[optionIndex];
      if (!option) return;

      (Object.entries(option.scores) as [PhilosophyKey, number][]).forEach(([phil, points]) => {
        if (typeof points === 'number') {
          scores[phil] += points;
        }
      });
    });

    // apply financial data overrides/boosts
    if (financialData.savingsRate >= 40) {
      scores.FIRE += 2;
      scores.Conservative += 1;
    }

    if (financialData.dti > 40) {
      scores.YOLO += 2;
      scores.FIRE = Math.max(0, scores.FIRE - 1);
    }

    if (financialData.netWorthGrowth > 10) {
      scores.FIRE += 1;
      scores.Balanced += 1;
    }

    if (financialData.emergencyFund < 2) {
      scores.YOLO += 2;
    }

    if (financialData.dti > 36) {
      scores.Conservative += 3;
      scores.YOLO = Math.max(0, scores.YOLO - 2);
    }

    const sorted = (Object.entries(scores) as [PhilosophyKey, number][])
      .sort((a, b) => b[1] - a[1]);

    const primary = sorted[0];
    const secondary = sorted[1] ?? [primary[0], 0];

    const maxPossible = 30;
    const confidence = Math.round((primary[1] / maxPossible) * 100);

    let classification: string;
    if (confidence >= 60) {
      classification = primary[0];
    } else if (secondary[1] >= primary[1] * 0.85) {
      classification = `${primary[0]}-${secondary[0]} Hybrid`;
    } else {
      classification = `${primary[0]}-leaning`;
    }

    return {
      primary: primary[0] as PhilosophyKey,
      secondary: secondary[0] as PhilosophyKey,
      scores,
      confidence,
      classification,
      allScores: sorted
    };
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = { ...answers, [currentQuestion]: optionIndex };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1)), 300);
    } else {
      // Last question answered - calculate results and complete immediately
      setTimeout(() => {
        const results = calculateResults(newAnswers);
        if (onComplete) {
          onComplete({
            classification: results.classification,
            primary: results.primary,
            secondary: results.secondary,
            scores: results.scores,
            confidence: results.confidence,
            completedAt: new Date().toISOString()
          });
        }
      }, 300);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <div className="inline-block bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold mb-4">
              Question {currentQuestion + 1}
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
            {questions[currentQuestion].text}
          </h2>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                  answers[currentQuestion] === index
                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 font-medium text-lg">{option.label}</span>
                  {answers[currentQuestion] === index && (
                    <CheckCircle className="w-6 h-6 text-indigo-600" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-5 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 transition font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhilosophyQuiz;