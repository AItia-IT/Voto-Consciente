import { useState, useRef, useEffect } from "react";
import { SpeakerButton } from "@/components/speaker-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { useCreateOpenaiConversation } from "@workspace/api-client-react";
import mascoteImg from "@/assets/mascote.png";

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const SUGGESTIONS = [
  "O que é democracia?",
  "Como identificar fake news?",
  "Quem é o vereador?",
  "Como funciona a urna?"
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Olá! Sou a Sônia, sua professora digital de cidadania. O que você gostaria de aprender hoje?' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [convId, setConvId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const createConv = useCreateOpenaiConversation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    setIsLoading(true);
    setInput("");
    
    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    
    let currentConvId = convId;
    if (!currentConvId) {
      try {
        const conv = await createConv.mutateAsync({ data: { title: "Chat Sônia" } });
        currentConvId = conv.id;
        setConvId(conv.id);
      } catch (e) {
        console.error("Failed to create conversation", e);
        setIsLoading(false);
        return;
      }
    }

    // Add empty assistant message for streaming
    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const resp = await fetch(`${baseUrl}api/openai/conversations/${currentConvId}/messages`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text })
      });
      
      if (!resp.body) throw new Error("No response body");
      
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      while(true) {
        const { done, value } = await reader.read();
        if(done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for(const line of lines) {
          if(line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (!dataStr.trim()) continue;
            
            try {
              const data = JSON.parse(dataStr);
              if(data.content) {
                setMessages(prev => prev.map(m => 
                  m.id === assistantId ? { ...m, content: m.content + data.content } : m
                ));
              }
              if(data.done) {
                // finished
              }
            } catch (e) {
              // Ignore parse errors on incomplete chunks
            }
          }
        }
      }
    } catch (e) {
      console.error("Stream error", e);
      setMessages(prev => prev.map(m => 
        m.id === assistantId && m.content === '' 
          ? { ...m, content: "Desculpe, tive um problema de conexão. Podemos tentar novamente?" } 
          : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white border border-border rounded-2xl overflow-hidden shadow-sm relative max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-muted/30 border-b p-4 flex items-center gap-4 shrink-0">
        <img src={mascoteImg} alt="Sônia" className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm shrink-0" />
        <div>
          <h2 className="font-extrabold text-xl text-foreground">Sônia</h2>
          <p className="text-muted-foreground font-medium text-sm">Sua professora digital</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 text-xl leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                : 'bg-muted/50 rounded-tl-sm text-foreground border border-border'
            }`}>
              {m.content || (m.role === 'assistant' && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />)}
            </div>
            {m.role === 'assistant' && m.content && (
              <div className="mt-2 ml-2">
                <SpeakerButton text={m.content} className="h-10 w-10 bg-white shadow-sm border border-border" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t shrink-0">
        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
          {SUGGESTIONS.map(s => (
            <button 
              key={s}
              onClick={() => sendMessage(s)}
              disabled={isLoading}
              className="whitespace-nowrap bg-muted/50 hover:bg-muted text-foreground px-4 py-2 rounded-full font-medium text-sm border border-border transition-colors disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
        <form 
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex gap-2"
        >
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            disabled={isLoading}
            className="flex-1 h-16 text-xl rounded-xl bg-muted/30 border-border focus-visible:ring-primary"
            data-testid="input-chat"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            className="h-16 w-16 rounded-xl shadow-md shrink-0 bg-primary hover:bg-primary/90"
            data-testid="button-send-chat"
          >
            {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : <Send className="h-8 w-8" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
