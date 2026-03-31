'use client'

import React from 'react'
import { Mic, Brain, DollarSign, CheckSquare, Heart, Camera } from 'lucide-react'

interface CaptureSheetProps {
  onClose: () => void
}

const CaptureSheet: React.FC<CaptureSheetProps> = ({ onClose }) => {
  const captureOptions = [
    {
      id: 'voice',
      emoji: '🎤',
      title: 'Falar',
      subtitle: 'Grave — a IA entende e guarda',
      icon: Mic,
      bgClass: 'bg-gradient-to-br from-blue-400 to-purple-500',
    },
    {
      id: 'thought',
      emoji: '💭',
      title: 'Pensamento',
      subtitle: 'Ideia, reflexão, insight',
      icon: Brain,
      bgClass: 'bg-grn',
    },
    {
      id: 'financial',
      emoji: '💰',
      title: 'Gasto / Receita',
      subtitle: 'Transação financeira',
      icon: DollarSign,
      bgClass: 'bg-red',
    },
    {
      id: 'task',
      emoji: '✅',
      title: 'Tarefa',
      subtitle: 'Algo pra fazer',
      icon: CheckSquare,
      bgClass: 'bg-blue-500',
    },
    {
      id: 'memory',
      emoji: '🧠',
      title: 'Memória',
      subtitle: 'Algo que viveu — emoção, pessoas, contexto',
      icon: Heart,
      bgClass: 'bg-pnk',
    },
    {
      id: 'photo',
      emoji: '📸',
      title: 'Foto / Momento',
      subtitle: 'Imagem com história',
      icon: Camera,
      bgClass: 'bg-org',
    },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 z-40"
        onClick={onClose}
      ></div>

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-w-full">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1 rounded-full bg-border"></div>
        </div>

        {/* Content */}
        <div className="px-5 pb-8">
          <h2 className="text-2xl font-bold text-t1 mb-6">Registrar</h2>

          <div className="space-y-3">
            {captureOptions.map(option => (
              <button
                key={option.id}
                onClick={onClose}
                className="w-full bg-card rounded-2xl p-4 flex items-center gap-4 hover:bg-card2 transition active:scale-95"
              >
                {/* Icon circle */}
                <div
                  className={`${option.bgClass} w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xl`}
                >
                  {option.emoji}
                </div>

                {/* Text */}
                <div className="flex-1 text-left">
                  <p className="font-semibold text-t1 mb-0.5">{option.title}</p>
                  <p className="text-xs text-t3">{option.subtitle}</p>
                </div>

                {/* Chevron */}
                <div className="text-t3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default CaptureSheet
