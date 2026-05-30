import { useTTS } from "@/hooks/use-tts";
import { Button } from "@/components/ui/button";
import { Volume2, Square, Loader2 } from "lucide-react";
import { useState } from "react";

interface SpeakerButtonProps {
  text: string;
  className?: string;
  label?: string;
}

export function SpeakerButton({ text, className = "", label = "Ouvir" }: SpeakerButtonProps) {
  const { speak, stop, isSpeaking } = useTTS();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (isSpeaking()) {
      stop();
      setLoading(false);
      return;
    }
    setLoading(true);
    await speak(text);
    setLoading(false);
  };

  const active = isSpeaking();
  const busy = loading && !active;

  return (
    <Button
      variant="outline"
      className={`flex items-center gap-2 rounded-full border-primary text-primary hover:bg-primary/10 flex-shrink-0 ${className}`}
      onClick={handleClick}
      data-testid="button-speaker"
      aria-label={active ? "Parar áudio" : label}
    >
      {busy ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : active ? (
        <Square className="h-5 w-5 fill-current" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
      <span className="text-base font-semibold">
        {busy ? "Carregando..." : active ? "Parar" : label}
      </span>
    </Button>
  );
}
