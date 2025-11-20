"use client";

import Button from "../Reuse/Button";
import QuizButtons from "./QuizButtons";

interface QuizFormProps {
  currentQuiz: unknown;
  quizzes: unknown[];
  currentQuizIndex: number;
  onBack: () => void;
  onQuizClick: (index: number) => void;
  onDelete: (index: number) => void;
  onQuestionChange: (value: string) => void;
  onOptionChange: (optionIndex: number, value: string) => void;
  onAddNewQuiz: () => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onTouchStart: (e: React.TouchEvent, index: number) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export default function QuizForm({
  currentQuiz,
  quizzes,
  currentQuizIndex,
  onBack,
  onQuizClick,
  onDelete,
  onQuestionChange,
  onOptionChange,
  onAddNewQuiz,
  onDragStart,
  onDragOver,
  onDrop,
  onTouchStart,
  onTouchEnd,
}: QuizFormProps) {
  return (
    <div className="w-full md:w-[80%] mx-auto md:rounded-lg md:px-6 md:py-4 md:border border-dashed">
      <div className="flex justify-between items-center mb-2 mt-2">
        <h3 className="text-[24px] font-semibold text-[#101A33]">Quiz</h3>
        <Button variant="secondary" onClick={onBack} className="px-4 py-2 border-none bg-transparent text-[16px]">
          Back to Module
        </Button>
      </div>
      <QuizButtons
        quizzes={quizzes}
        currentQuizIndex={currentQuizIndex}
        onQuizClick={onQuizClick}
        onDelete={onDelete}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      />
      <div className="space-y-4">
        <div>
          <label className="block text-[#101A33] text-[20px] font-semibold mb-2">
            Add question
          </label>
          <input
            type="text"
            value={currentQuiz?.question || ""}
            onChange={(e) => onQuestionChange(e.target.value)}
            placeholder="Type question here"
            className="w-full px-4 py-3 border border-gray-300  placeholder:text-[#5D5D5D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6]"
          />
        </div>
        <div className="space-y-3">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-5 h-5 text-[#4977E6] border-gray-300 rounded focus:ring-[#4977E6]"
              />
              <input
                type="text"
                value={currentQuiz?.options[index] || ""}
                onChange={(e) => onOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 px-4 py-2 ] placeholder:text-[#5D5D5D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4977E6]"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end ">
          <Button
            variant="secondary"
            onClick={onAddNewQuiz}
            className="px-4 py-2 border-none bg-transparent  text-[18px] text-black"
          >
           <span className="text-[#0EB137]"> (+)</span> Add Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}


