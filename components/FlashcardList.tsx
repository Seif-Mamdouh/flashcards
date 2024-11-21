"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Edit2, Trash2 } from "lucide-react";
import { Flashcard } from "@/lib/types";
import EditCardDialog from "./EditCardDialog";

interface FlashcardListProps {
  cards: Flashcard[];
  onEdit: (id: string, question: string, answer: string) => void;
  onRemove: (id: string) => void;
}

export default function FlashcardList({
  cards,
  onEdit,
  onRemove,
}: FlashcardListProps) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  const toggleCard = (id: string) => {
    const newFlippedCards = new Set(flippedCards);
    if (flippedCards.has(id)) {
      newFlippedCards.delete(id);
    } else {
      newFlippedCards.add(id);
    }
    setFlippedCards(newFlippedCards);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.id} className="relative">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingCard(card)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(card.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent
            onClick={() => toggleCard(card.id)}
            className="cursor-pointer min-h-[150px] flex items-center justify-center text-center p-6"
          >
            <p className="text-lg">
              {flippedCards.has(card.id) ? card.answer : card.question}
            </p>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground text-center">
            Click to {flippedCards.has(card.id) ? "see question" : "reveal answer"}
          </CardFooter>
        </Card>
      ))}

      {editingCard && (
        <EditCardDialog
          card={editingCard}
          open={!!editingCard}
          onOpenChange={(open) => !open && setEditingCard(null)}
          onEdit={onEdit}
        />
      )}
    </div>
  );
}