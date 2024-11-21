"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flashcard } from "@/lib/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cards: Flashcard[];
}

export default function QuizDialog({
  open,
  onOpenChange,
  cards,
}: QuizDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizCards, setQuizCards] = useState<Flashcard[]>([]);

  useEffect(() => {
    if (open) {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setQuizCards(shuffled.slice(0, 5));
      setCurrentIndex(0);
      setScore(0);
      setAnswer("");
      setShowAnswer(false);
    }
  }, [open, cards]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAnswer) {
      setShowAnswer(true);
      if (
        answer.toLowerCase().trim() === quizCards[currentIndex].answer.toLowerCase().trim()
      ) {
        setScore(score + 1);
      }
    } else {
      if (currentIndex < quizCards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setAnswer("");
        setShowAnswer(false);
      } else {
        onOpenChange(false);
      }
    }
  };

  if (cards.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quiz Mode</DialogTitle>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to create some flashcards before you can start a quiz!
            </AlertDescription>
          </Alert>
          <Button onClick={() => onOpenChange(false)} className="mt-4">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  if (quizCards.length === 0) return null;

  const progress = ((currentIndex + 1) / quizCards.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quiz Mode</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Progress value={progress} className="w-full" />
          <Card>
            <CardHeader className="text-center">
              <p className="text-sm text-muted-foreground">
                Question {currentIndex + 1} of {quizCards.length}
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg font-medium mb-4">
                {quizCards[currentIndex].question}
              </p>
              {showAnswer && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Correct answer:</p>
                  <p className="text-lg font-medium">
                    {quizCards[currentIndex].answer}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <Input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  disabled={showAnswer}
                  required
                />
                <Button type="submit" className="w-full">
                  {showAnswer
                    ? currentIndex < quizCards.length - 1
                      ? "Next Question"
                      : "Finish Quiz"
                    : "Check Answer"}
                </Button>
              </form>
            </CardFooter>
          </Card>
          <p className="text-center text-sm text-muted-foreground">
            Current Score: {score}/{currentIndex + 1}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}