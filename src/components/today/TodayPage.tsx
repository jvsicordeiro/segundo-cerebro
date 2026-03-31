'use client'

import React, { useState } from 'react'
import { Mic, Camera, KeyboardIcon, Shuffle, Zap, Heart, AlertCircle } from 'lucide-react'

const VoiceBar = () => (
  <div className="bg-card rounded-2xl p-6 mb-4">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
        <Mic className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-t1 mb-1">Fale com seu cérebro</h3>
        <p className="text-sm text-t3 mb-3">Gasto, ideia, memória, tarefa... só falar</p>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full bg-border flex items-center justify-center hover:bg-border2">
            <Camera className="w-4 h-4 text-t2" />
          </button>
          <button className="w-8 h-8 rounded-full bg-border flex items-center justify-center hover:bg-border2">
            <KeyboardIcon className="w-4 h-4 text-t2" />
          </button>
        </div>
      </div>
    </div>
  </div>
)

const ThisDay = () => (
  <div className="bg-card rounded-2xl p-5 mb-4">
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-t1 mb-3">📅 Há 1 ano — 29 mar 2025</h4>
      <p className="text-sm text-t2 leading-relaxed mb-4">
        Lembrei daquele dia que você estava tão entusiasmado com o novo projeto. A conversa com o time durou horas e vocês traçaram um plano incrível para os próximos meses.
      </p>
      <div className="bg-border rounded-lg h-32 mb-4 flex items-center justify-center">
        <span className="text-t3 text-sm">Imagem da memória</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        <span className="px-3 py-1 bg-border text-xs text-t2 rounded-full">Trabalho</span>
        <span className="px-3 py-1 bg-border text-xs text-t2 rounded-full">Pessoas</span>
        <span className="px-3 py-1 bg-border text-xs text-t2 rounded-full">Crescimento</span>
      </div>
    </div>
    <h4 className="text-xs font-semibold text-t3 uppercase tracking-wide">Esse Dia</h4>
  </div>
)

const Redescubra = () => (
  <div className="bg-card rounded-2xl p-5 mb-4">
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-sm font-semibold text-t1">🔀 Redescubra</h4>
      <button className="w-8 h-8 rounded-full bg-border flex items-center justify-center hover:bg-border2">
        <Shuffle className="w-4 h-4 text-t2" />
      </button>
    </div>
    <p className="text-sm text-t2 leading-relaxed mb-4">
      Você anotou: "Recebi um feedback interessante sobre comunicação. Preciso pensar mais sobre isso."
    </p>
    <div className="bg-border rounded-lg h-32 mb-4 flex items-center justify-center">
      <span className="text-t3 text-sm">Imagem aleatória</span>
    </div>
    <div className="flex gap-2 flex-wrap">
      <span className="px-3 py-1 bg-border text-xs text-t2 rounded-full">Desenvolvimento</span>
      <span className="px-3 py-1 bg-border text-xs text-t2 rounded-full">Reflexão</span>
    </div>
  </div>
)

const Briefing = () => (
  <div className="bg-card rounded-2xl p-5 mb-4">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
      <h4 className="text-sm font-semibold text-t1">Briefing do dia</h4>
    </div>
    <p className="text-sm text-t2 leading-relaxed">
      Você tem <span className="text-blue-500 font-semibold">3 tarefas</span> hoje. <span className="text-org font-semibold">1 está vencida</span>. Seu humor está em <span className="text-grn font-semibold">alta</span> — aproveite para focar em algo desafiador!
    </p>
  </div>
)

const ScoreHabits = () => {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Meditação', emoji: '🧘', done: true },
    { id: 2, name: 'Exercício', emoji: '💪', done: false },
    { id: 3, name: 'Leitura', emoji: '📚', done: true },
    { id: 4, name: 'Água', emoji: '💧', done: false },
    { id: 5, name: 'Dormir cedo', emoji: '😴', done: false },
  ])

  const toggleHabit = (id: number) => {
    setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done } : h))
  }

  return (
    <div className="bg-card rounded-2xl p-5 mb-4">
      <div className="mb-4">
        <div className="text-3xl font-bold text-t1 mb-1">78</div>
        <h4 className="text-sm font-semibold text-t1 mb-1">Seu dia até agora</h4>
        <p className="text-xs text-t3">3/5 hábitos · humor 😊 · 2 tarefas</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {habits.map(habit => (
          <button
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
              habit.done
                ? 'bg-grn text-white'
                : 'bg-border text-t2 hover:bg-border2'
            }`}
          >
            <span>{habit.emoji}</span>
            <span>{habit.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(3)
  const moods = ['😫', '😐', '🙂', '😊', '🔥']

  return (
    <div className="bg-card rounded-2xl p-5 mb-4">
      <h4 className="text-sm font-semibold text-t1 mb-4">Como você tá?</h4>
      <div className="flex justify-between gap-2">
        {moods.map((mood, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedMood(selectedMood === idx ? null : idx)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition ${
              selectedMood === idx
                ? 'ring-2 ring-blue-500 bg-border'
                : 'bg-border hover:bg-border2'
            }`}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  )
}

const Timeline = () => (
  <div className="bg-card rounded-2xl p-5 mb-4">
    <h4 className="text-sm font-semibold text-t1 mb-4">Timeline</h4>
    <div className="space-y-3">
      {/* Done event */}
      <div className="flex gap-4">
        <div className="flex flex-col items-center pt-0.5">
          <div className="w-6 h-6 rounded-full bg-grn flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs">✓</span>
          </div>
          <div className="w-0.5 h-12 bg-border mt-1"></div>
        </div>
        <div className="flex-1 pt-1">
          <p className="text-xs text-t3 mb-1">08:30</p>
          <p className="text-sm font-medium text-t1 mb-1">Meditação matinal</p>
          <p className="text-xs text-t3">Hábito · 30 min</p>
        </div>
      </div>

      {/* Current event */}
      <div className="flex gap-4">
        <div className="flex flex-col items-center pt-0.5">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <div className="w-0.5 h-12 bg-border mt-1"></div>
        </div>
        <div className="flex-1 pt-1">
          <p className="text-xs text-t3 mb-1">14:00</p>
          <p className="text-sm font-medium text-t1 mb-1">Reunião com cliente</p>
          <p className="text-xs text-t3">Trabalho · 1h · <span className="text-blue-500">Conectado</span></p>
        </div>
      </div>

      {/* Future event */}
      <div className="flex gap-4">
        <div className="flex flex-col items-center pt-0.5">
          <div className="w-6 h-6 rounded-full bg-border flex items-center justify-center flex-shrink-0 text-lg">
            ☕
          </div>
          <div className="w-0.5 h-12 bg-border mt-1"></div>
        </div>
        <div className="flex-1 pt-1">
          <p className="text-xs text-t3 mb-1">17:30</p>
          <p className="text-sm font-medium text-t1 mb-1">Café com amigo</p>
          <p className="text-xs text-t3">Pessoal · 1h</p>
        </div>
      </div>
    </div>
  </div>
)

const Radar = () => (
  <div className="grid grid-cols-3 gap-3 mb-4">
    <div className="bg-card rounded-2xl p-4 text-center">
      <div className="text-lg font-bold text-grn mb-1">R$2.4k</div>
      <p className="text-xs text-t3">Sobra</p>
    </div>
    <div className="bg-card rounded-2xl p-4 text-center">
      <div className="text-lg font-bold text-blue-500 mb-1">3/5</div>
      <p className="text-xs text-t3">Metas</p>
    </div>
    <div className="bg-card rounded-2xl p-4 text-center">
      <div className="text-lg font-bold text-pnk mb-1">23🔥</div>
      <p className="text-xs text-t3">Streak</p>
    </div>
  </div>
)

const Alerts = () => (
  <div className="space-y-3">
    <div className="bg-card rounded-2xl p-4 border-l-4 border-org">
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-org flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-t1 mb-1">Tarefa atrasada</p>
          <p className="text-xs text-t3 mb-2">Revisar documentação — vence hoje</p>
          <p className="text-xs text-blue-500 cursor-pointer">Ver mais</p>
        </div>
      </div>
    </div>

    <div className="bg-card rounded-2xl p-4 border-l-4 border-red">
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-red flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-t1 mb-1">Meta em risco</p>
          <p className="text-xs text-t3 mb-2">Você está 30% abaixo da meta de leitura</p>
          <p className="text-xs text-blue-500 cursor-pointer">Ver mais</p>
        </div>
      </div>
    </div>
  </div>
)

const TodayPage = () => {
  return (
    <div className="px-5 pb-24">
      <VoiceBar />
      <ThisDay />
      <Redescubra />
      <Briefing />
      <ScoreHabits />
      <MoodTracker />
      <Timeline />
      <Radar />
      <Alerts />
    </div>
  )
}

export default TodayPage
