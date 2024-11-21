"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Plus } from "lucide-react";
import AddCardDialog from "@/components/AddCardDialog";
import FlashcardList from "@/components/FlashcardList";
import QuizDialog from "@/components/QuizDialog";
import { Flashcard } from "@/lib/types";

export default function Home() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);

  useEffect(() => {
    const savedCards = localStorage.getItem("flashcards");
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    }
  }, []);

  const saveCards = (newCards: Flashcard[]) => {
    setCards(newCards);
    localStorage.setItem("flashcards", JSON.stringify(newCards));
  };

  const addCard = (question: string, answer: string) => {
    const newCard: Flashcard = {
      id: Date.now().toString(),
      question,
      answer,
    };
    saveCards([...cards, newCard]);
  };

  const editCard = (id: string, question: string, answer: string) => {
    const newCards = cards.map((card) =>
      card.id === id ? { ...card, question, answer } : card
    );
    saveCards(newCards);
  };

  const removeCard = (id: string) => {
    const newCards = cards.filter((card) => card.id !== id);
    saveCards(newCards);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Flashcards</h1>
          </div>
          <p className="text-muted-foreground">
            Create and study flashcards to enhance your learning
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Card
          </Button>
          <Button
            onClick={() => setIsQuizDialogOpen(true)}
            variant="secondary"
            className="gap-2"
          >
            <Brain className="w-4 h-4" />
            Start Quiz
          </Button>
        </div>

        {cards.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No flashcards yet. Click &quot;Add Card&quot; to create your first one!
            </p>
          </Card>
        ) : (
          <FlashcardList
            cards={cards}
            onEdit={editCard}
            onRemove={removeCard}
          />
        )}

        <AddCardDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={addCard}
        />

        <QuizDialog
          open={isQuizDialogOpen}
          onOpenChange={setIsQuizDialogOpen}
          cards={cards}
        />
      </div>
    </main>
  );
}