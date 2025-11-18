"use client";
import StudentButton from "@/components/students/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function QuizPage() {
  const [quizNum, setQuizNum] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(
    new Array(5).fill(null)
  );
  const [showResults, setShowResults] = useState(false);

  // mock Quiz
  const Quiz = [
    {
      question: "What is the main purpose of responsive design?",
      options: [
        "To make websites load faster",
        "To adapt layouts to different screen sizes",
        "To improve SEO rankings",
        "To reduce server costs",
      ],
      answer: "To adapt layouts to different screen sizes",
    },
    {
      question: "Which CSS unit is relative to the viewport width?",
      options: ["px", "em", "vw", "pt"],
      answer: "vw",
    },
    {
      question: "What does the 'box-sizing: border-box' property do?",
      options: [
        "Removes the border from elements",
        "Includes padding and border in the element's total width and height",
        "Creates a box shadow effect",
        "Changes the border style to a box shape",
      ],
      answer:
        "Includes padding and border in the element's total width and height",
    },
    {
      question:
        "Which JavaScript method is used to select an element by its ID?",
      options: [
        "querySelector()",
        "getElementsByClassName()",
        "getElementById()",
        "selectElement()",
      ],
      answer: "getElementById()",
    },
    {
      question: "What is the default display value of a <div> element?",
      options: ["inline", "block", "flex", "grid"],
      answer: "block",
    },
  ];

  // Calculate progress percentage
  const progressPercentage = ((quizNum + 1) / Quiz.length) * 100;

  // Function to determine progress bar color based on percentage
  const getProgressColor = (percent: number) => {
    if (percent <= 20) return "#ef4444"; // red
    if (percent <= 40) return "#f97316"; // orange
    if (percent <= 60) return "#eab308"; // yellow
    if (percent <= 80) return "#3b82f6"; // blue
    return "#22c55e"; // green
  };

  // Calculate score
  const calculateScore = () => {
    let correct = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === Quiz[index].answer) {
        correct++;
      }
    });
    return correct;
  };

  const handleAnswerSelect = (option: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[quizNum] = option;
    setUserAnswers(newAnswers);
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    // If last question, show confirmation
    if (quizNum === Quiz.length - 1) {
      const confirmSubmit = window.confirm(
        "Are you sure you want to submit your quiz?"
      );
      if (confirmSubmit) {
        setShowResults(true);
      }
    } else {
      // Next Question
      setQuizNum(quizNum + 1);
      setSelectedAnswer(userAnswers[quizNum + 1]);
    }
  };

  const handlePrevious = () => {
    // Previous Question
    if (quizNum > 0) {
      setQuizNum(quizNum - 1);
      setSelectedAnswer(userAnswers[quizNum - 1]);
    }
  };

  const handleRetakeQuiz = () => {
    setQuizNum(0);
    setUserAnswers(new Array(5).fill(null));
    setSelectedAnswer(null);
    setShowResults(false);
  };

  const router = useRouter();

  // Results View
  if (showResults) {
    const score = calculateScore();
    const percentage = (score / Quiz.length) * 100;

    return (
      <section className="mt-6 sm:mt-8">
        <h3 className="text-2xl md:text-[2.5rem] font-bold text-neutral-900 mb-2">
          Quiz Results
        </h3>
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-neutral-900 hover:text-orange-300 font-bold text-[16px] md:text-[20px] mb-6 transition-colors flex items-center gap-2"
        >
          <span className="text-[16px] md:text-[20px]">←</span> Back
        </button>

        <div className="bg-white rounded-2xl p-6 md:p-8">
          {/* Score Summary */}
          <div className="text-center mb-8 pb-6 border-b">
            <h4 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
              Your Score
            </h4>
            <p className="text-5xl md:text-6xl font-bold text-orange-500 mb-2">
              {score} / {Quiz.length}
            </p>
            <p className="text-xl text-neutral-600">
              {percentage.toFixed(0)}% Correct
            </p>
            <p className="text-lg text-neutral-500 mt-2">
              {percentage >= 80
                ? "Excellent work!"
                : percentage >= 60
                ? "Good job!"
                : "Keep practicing!"}
            </p>
          </div>

          {/* Detailed Results */}
          <div className="space-y-6">
            <h5 className="text-xl font-bold text-neutral-900">
              Question Review
            </h5>

            {Quiz.map((quiz, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === quiz.answer;

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? "border-green-300 bg-green-50"
                      : "border-red-300 bg-red-50"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span
                      className={`text-xl font-bold ${
                        isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isCorrect ? "✓" : "✗"}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900 mb-2">
                        Question {index + 1}: {quiz.question}
                      </p>

                      {!isCorrect && (
                        <>
                          <p className="text-sm text-red-700 mb-1">
                            <span className="font-semibold">Your answer:</span>{" "}
                            {userAnswer || "Not answered"}
                          </p>
                          <p className="text-sm text-green-700">
                            <span className="font-semibold">
                              Correct answer:
                            </span>{" "}
                            {quiz.answer}
                          </p>
                        </>
                      )}

                      {isCorrect && (
                        <p className="text-sm text-green-700">
                          <span className="font-semibold">Your answer:</span>{" "}
                          {userAnswer} ✓
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleRetakeQuiz}
              className="px-6 py-3 rounded-lg border-2 border-orange-500 text-orange-500 font-semibold hover:bg-orange-50 transition-all"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all"
            >
              Back to Lessons
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Quiz View
  return (
    <section className="mt-6 sm:mt-8">
      <h3 className="text-2xl md:text-[2.5rem] font-bold text-neutral-900 mb-2">
        Quiz
      </h3>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="text-neutral-900 hover:text-orange-300 font-bold text-[16px] md:text-[20px] mb-6 transition-colors flex items-center gap-2"
      >
        <span className="text-[16px] md:text-[20px]">←</span> Back
      </button>

      <div className="flex justify-center items-center w-full h-[80vh]">
        <div className="bg-white flex flex-col gap-4 py-6 px-4 rounded-2xl w-full max-w-3xl">
          {Quiz.map((quiz, index) => (
            <div
              key={quiz.question}
              className={quizNum === index ? "block" : "hidden"}
            >
              {/* Quiz No and completion Ratio */}
              <aside className="text-neutral-900 text-sm flex items-center justify-between mb-3">
                <p className="font-medium">
                  Question {index + 1} of {Quiz.length}
                </p>
                <p className="font-semibold">
                  {Math.round(progressPercentage)}%
                </p>
              </aside>

              {/* Quiz progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8 overflow-hidden">
                <div
                  className="h-full transition-all duration-500 ease-out rounded-full"
                  style={{
                    width: `${progressPercentage}%`,
                    backgroundColor: getProgressColor(progressPercentage),
                  }}
                />
              </div>

              {/* Question */}
              <h4 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">
                {quiz.question}
              </h4>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {quiz.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-start gap-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={() => handleAnswerSelect(option)}
                      className="mt-1 w-4 h-4 accent-orange-500"
                    />
                    <span className="text-neutral-900">{option}</span>
                  </label>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4">
                <StudentButton
                  onClick={handlePrevious}
                  disabled={quizNum === 0}
                  className="px-6 py-3 rounded-lg border-2 font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </StudentButton>
                <StudentButton
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  className="px-6 py-3 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {quizNum === Quiz.length - 1
                    ? "Submit Quiz"
                    : "Next Question"}
                </StudentButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
