import React from "react";
import { useTTS } from "@/hooks/use-tts";
import { Button } from "@/components/ui/button";
import { Volume2, Square } from "lucide-react";

export function SpeakerButton({ text, className = "", style }: { text: string, className?: string, style?: React.CSSProperties }) {
  const { speak, stop, isSpeaking } = useTTS();

  return (
    <Button
      variant="outline"
      size="icon"
      className={`rounded-full h-12 w-12 border-primary text-primary hover:bg-primary/10 flex-shrink-0 ${className}`}
      style={style}
      onClick={() => isSpeaking() ? stop() : speak(text)}
      data-testid="button-speaker"
    >
      {isSpeaking() ? <Square className="h-6 w-6 fill-current" /> : <Volume2 className="h-6 w-6" />}
    </Button>
  );
}
