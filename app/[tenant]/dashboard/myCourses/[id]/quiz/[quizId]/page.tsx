"use client";
import StudentButton from "@/components/students/Button";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axiosClientInstance";
import TuteraLoading from "@/components/Reuse/Loader";

interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  _id: string;
}

interface QuizData {
  _id: string;
  moduleId: string;
  questions: Question[];
  isPublished: boolean;
}

export default function QuizPage({
  params,
}: {
  params: Promise<{ id: string; quizId: string }>;
}) {
  const router = useRouter();
  const { id, quizId } = use(params);

  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [moduleTitle, setModuleTitle] = useState<string>("");
  const [quizNum, setQuizNum] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch course data to get quiz
  const fetchCourseData = useCallback(async () => {
    if (!id || !quizId) return;

    try {
      setLoading(true);
      // Fetch the course data (same endpoint as lesson page)
      const response = await api.get(`/v1/studentCourseDetails/${id}`);
      console.log("Course Data:", response.data);
      const courseData = response.data.data;

      // Find the module that contains this quiz
      const module = courseData.modules.find(
        (mod: any) => mod.quiz && mod.quiz._id === quizId
      );

      if (module && module.quiz) {
        setQuizData(module.quiz);
        setModuleTitle(module.title);
        // Initialize user answers array
        setUserAnswers(new Array(module.quiz.questions.length).fill(null));
      } else {
        toast.error("Quiz not found");
      }
    } catch (error: unknown) {
      console.error("Error fetching quiz:", error);
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed to load quiz";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id, quizId]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  if (loading) {
    return <TuteraLoading />;
  }

  if (!quizData) {
    return (
      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-neutral-900">Quiz not found</p>
      </div>
    );
  }

  // Calculate progress percentage
  const progressPercentage = ((quizNum + 1) / quizData.questions.length) * 100;

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
      if (answer === quizData.questions[index].correctAnswerIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[quizNum] = optionIndex;
    setUserAnswers(newAnswers);
    setSelectedAnswer(optionIndex);
  };

  const handleNext = async () => {
    // If last question, show confirmation and submit
    if (quizNum === quizData.questions.length - 1) {
      const confirmSubmit = window.confirm(
        "Are you sure you want to submit your quiz?"
      );
      if (confirmSubmit) {
        try {
          setSubmitting(true);

          // Format answers according to backend requirements
          const formattedAnswers = userAnswers.map((answer, index) => ({
            questionIndex: index,
            selectedOptionIndex: answer !== null ? answer : -1,
            isCorrect: answer === quizData.questions[index].correctAnswerIndex,
          }));

          const submissionData = {
            courseId: id,
            quizId: quizId,
            answers: formattedAnswers,
          };

          console.log("Submitting quiz:", submissionData);

          const response = await api.post(`/v1/submitQuiz`, submissionData);
          console.log("Quiz submission response:", response.data);
          toast.success("Quiz submitted successfully!");
          setShowResults(true);
        } catch (error: unknown) {
          console.error("Error submitting quiz:", error);
          const message =
            (error as { response?: { data?: { error?: string } } })?.response
              ?.data?.error || "Failed to submit quiz";
          toast.error(message);
        } finally {
          setSubmitting(false);
        }
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
    setUserAnswers(new Array(quizData.questions.length).fill(null));
    setSelectedAnswer(null);
    setShowResults(false);
  };

  // Results View
  if (showResults) {
    const score = calculateScore();
    const percentage = (score / quizData.questions.length) * 100;

    return (
      <section className="mt-6 sm:mt-8">
        <h3 className="text-2xl md:text-[2.5rem] font-bold text-neutral-900 mb-2">
          {moduleTitle} - Quiz Results
        </h3>
        {/* Back Button */}
        <button
          onClick={() => router.push(`/dashboard/myCourses/${id}`)}
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
              {score} / {quizData.questions.length}
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

          {/* Question Review Header with Retake Button */}
          <div className="flex items-center justify-between mb-6">
            <h5 className="text-xl font-bold text-neutral-900">
              Question Review
            </h5>
            <button
              onClick={handleRetakeQuiz}
              className="px-5 py-2.5 rounded-lg border-2 border-orange-500 text-orange-500 font-semibold hover:bg-orange-50 transition-all"
            >
              Retake Quiz
            </button>
          </div>

          {/* Detailed Results */}
          <div className="space-y-6 mb-8">
            {quizData.questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correctAnswerIndex;
              const userAnswerText =
                userAnswer !== null ? question.options[userAnswer] : null;
              const correctAnswerText =
                question.options[question.correctAnswerIndex];

              return (
                <div
                  key={question._id}
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
                        Question {index + 1}: {question.questionText}
                      </p>

                      {!isCorrect && (
                        <>
                          <p className="text-sm text-red-700 mb-1">
                            <span className="font-semibold">Your answer:</span>{" "}
                            {userAnswerText || "Not answered"}
                          </p>
                          <p className="text-sm text-green-700">
                            <span className="font-semibold">
                              Correct answer:
                            </span>{" "}
                            {correctAnswerText}
                          </p>
                        </>
                      )}

                      {isCorrect && (
                        <p className="text-sm text-green-700">
                          <span className="font-semibold">Your answer:</span>{" "}
                          {userAnswerText} ✓
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex justify-center gap-4 pt-6 border-t">
            <button
              onClick={() => router.push(`/dashboard/myCourses/${id}`)}
              className="px-6 py-3 rounded-lg border-2 border-neutral-500 text-neutral-700 font-semibold hover:bg-neutral-50 transition-all"
            >
              Back to Lessons
            </button>
            <button
              onClick={() => router.push(`/dashboard`)}
              className="px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all"
            >
              Back to Dashboard
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
        {moduleTitle} - Quiz
      </h3>
      {/* Back Button */}
      <button
        onClick={() => router.push(`/dashboard/myCourses/${id}`)}
        className="text-neutral-900 hover:text-orange-300 font-bold text-[16px] md:text-[20px] mb-6 transition-colors flex items-center gap-2"
      >
        <span className="text-[16px] md:text-[20px]">←</span> Back
      </button>

      <div className="flex justify-center items-center w-full h-[80vh]">
        <div className="bg-white flex flex-col gap-4 py-6 px-4 rounded-2xl w-full max-w-3xl">
          {quizData.questions.map((question, index) => (
            <div
              key={question._id}
              className={quizNum === index ? "block" : "hidden"}
            >
              {/* Quiz No and completion Ratio */}
              <aside className="text-neutral-900 text-sm flex items-center justify-between mb-3">
                <p className="font-medium">
                  Question {index + 1} of {quizData.questions.length}
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
                {question.questionText}
              </h4>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-start gap-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={optionIndex}
                      checked={selectedAnswer === optionIndex}
                      onChange={() => handleAnswerSelect(optionIndex)}
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
                  disabled={selectedAnswer === null || submitting}
                  className="px-6 py-3 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {submitting
                    ? "Submitting..."
                    : quizNum === quizData.questions.length - 1
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
