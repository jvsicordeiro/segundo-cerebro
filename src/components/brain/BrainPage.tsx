'use client';

import { Mic, Send, Link as LinkIcon, Sparkles, Eye, HelpCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  connections?: Array<{ text: string }>;
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'assistant',
    content:
      'Oi! Sou seu Cérebro — seu assistente de memórias e histórias de vida. Posso ajudar você a explorar e entender melhor quem você é, quantos jogos do SPFC foi, como conheceu pessoas importantes, e muito mais. O que gostaria de saber sobre sua vida?',
  },
];

const suggestions = [
  'Quantos jogos do SPFC fui?',
  'Como conheci minha esposa?',
  'Meu ano em números',
];

const modes = [
  { id: 'normal', label: 'Normal', icon: Sparkles },
  { id: 'witness', label: 'Testemunha', icon: Eye },
  { id: 'whatif', label: 'E se?', icon: HelpCircle },
];

export default function BrainPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<string>('normal');
  const [showInsights, setShowInsights] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content:
          'Você teve um total de 32 jogos do SPFC registrados! Desses, 18 vitórias, 8 empates e 6 derrotas. Você estava presente em partidas memoráveis como a vitória 3x1 contra o Palmeiras em 2023 e o jogo contra o Santos em Gramado com sua esposa em 2024.',
        connections: [
          { text: 'SPFC — Jogos' },
          { text: 'Esposa' },
          { text: 'Gramado' },
        ],
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--t1)' }}>
          🧠 Cérebro
        </h1>
        <p className="text-sm" style={{ color: 'var(--t2)' }}>
          Pergunte qualquer coisa sobre sua vida
        </p>
      </div>

      {/* Mode Toggles */}
      <div className="px-5 pb-3 flex-shrink-0 flex gap-2 overflow-x-auto">
        {modes.map(mode => {
          const ModeIcon = mode.icon
          return (
            <button
              key={mode.id}
              onClick={() => setCurrentMode(mode.id)}
              className={`px-3 py-2 rounded-full text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                currentMode === mode.id
                  ? 'bg-acc text-white'
                  : 'bg-card text-t1 hover:bg-card2'
              }`}
            >
              <ModeIcon size={14} />
              {mode.label}
            </button>
          )
        })}
      </div>

      {/* Suggestions Row */}
      <div className="px-5 pb-4 flex-shrink-0 overflow-x-auto">
        <div className="flex gap-2">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestion(suggestion)}
              className="px-3 py-2 rounded-full text-xs whitespace-nowrap transition-all hover:opacity-80"
              style={{
                backgroundColor: 'var(--card2)',
                color: 'var(--t1)',
                border: '1px solid var(--border)',
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex gap-3 max-w-xs ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar for assistant */}
              {message.type === 'assistant' && (
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: 'white',
                  }}
                >
                  🧠
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  message.type === 'user'
                    ? 'rounded-br-none'
                    : 'rounded-bl-none'
                }`}
                style={{
                  backgroundColor:
                    message.type === 'user'
                      ? 'var(--acc)'
                      : 'var(--card)',
                  color:
                    message.type === 'user'
                      ? 'white'
                      : 'var(--t1)',
                }}
              >
                <p className="leading-relaxed">{message.content}</p>

                {/* Connections pills */}
                {message.connections && message.connections.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.connections.map((conn, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: 'var(--card2)',
                          color: 'var(--acc)',
                        }}
                      >
                        <LinkIcon size={12} />
                        {conn.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div
              className="flex gap-3"
            >
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: 'white',
                }}
              >
                🧠
              </div>
              <div
                className="rounded-2xl rounded-bl-none px-4 py-3"
                style={{
                  backgroundColor: 'var(--card)',
                }}
              >
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: 'var(--t2)' }}
                  />
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: 'var(--t2)' }}
                  />
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: 'var(--t2)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Identity Insights Panel */}
      {showInsights && (
        <div className="px-5 pb-4 flex-shrink-0 bg-card rounded-2xl mx-5 p-4 mb-3">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-semibold text-t1">Insights sobre você</h3>
            <button
              onClick={() => setShowInsights(false)}
              className="text-t3 hover:text-t1 transition"
            >
              ✕
            </button>
          </div>
          <ul className="space-y-2 text-xs text-t2">
            <li>• Você tem paixão por futebol — 32 jogos do SPFC documentados</li>
            <li>• Viajante frequente com 8 viagens documentadas</li>
            <li>• Pessoa nostálgica que valoriza memórias com pessoas</li>
          </ul>
        </div>
      )}

      {/* Input Bar */}
      <div
        className="flex-shrink-0 px-5 py-4 border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-3 mb-3">
          {/* Mic Button */}
          <button
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-70"
            style={{ backgroundColor: 'var(--card2)' }}
          >
            <Mic size={18} style={{ color: 'var(--t2)' }} />
          </button>

          {/* Input Field */}
          <input
            type="text"
            placeholder="Pergunte sobre sua vida..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1 px-4 py-2 rounded-full outline-none text-sm"
            style={{
              backgroundColor: 'var(--card2)',
              color: 'var(--t1)',
            }}
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-50 hover:disabled:opacity-50"
            style={{ backgroundColor: 'var(--acc)' }}
          >
            <Send size={16} color="white" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="flex-1 px-3 py-2 rounded-full bg-card text-t1 hover:bg-card2 transition"
          >
            📊 Insights
          </button>
          <button className="flex-1 px-3 py-2 rounded-full bg-card text-t1 hover:bg-card2 transition">
            📅 Anuário
          </button>
          <button className="flex-1 px-3 py-2 rounded-full bg-card text-t1 hover:bg-card2 transition">
            📖 Autobiografia
          </button>
        </div>
      </div>
    </div>
  );
}
