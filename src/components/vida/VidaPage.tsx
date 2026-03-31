'use client'

import React, { useState } from 'react'
import { CheckCircle2, Circle, Calendar } from 'lucide-react'

const ModuleGrid = () => {
  const modules = [
    { emoji: '💰', name: 'Finanças', subtitle: 'R$ 2.4k sobra' },
    { emoji: '❤️', name: 'Saúde', subtitle: '7/10 pontos' },
    { emoji: '🎯', name: 'Metas', subtitle: '3/5 ativas' },
    { emoji: '🏠', name: 'Casa', subtitle: '5 tarefas' },
    { emoji: '💼', name: 'Clinai', subtitle: '12 tarefas' },
    { emoji: '📚', name: 'Coleções', subtitle: '42 itens' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {modules.map((module, idx) => (
        <div
          key={idx}
          className="bg-card rounded-2xl p-4 cursor-pointer hover:bg-card2 transition"
        >
          <div className="text-3xl mb-2">{module.emoji}</div>
          <p className="font-semibold text-t1 mb-1 text-sm">{module.name}</p>
          <p className="text-xs text-t3">{module.subtitle}</p>
        </div>
      ))}
    </div>
  )
}

const Pendencias = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Pagar conta de internet',
      dueDate: 'Hoje',
      color: 'orange',
      done: false,
      connection: 'Finanças',
    },
    {
      id: 2,
      title: 'Enviar documento ao cliente',
      dueDate: 'Urgente',
      color: 'red',
      done: false,
      connection: 'Clinai',
    },
    {
      id: 3,
      title: 'Comprar ingredientes para o jantar',
      dueDate: 'Amanhã',
      color: 'gray',
      done: false,
      connection: 'Casa',
    },
    {
      id: 4,
      title: 'Fazer exercício',
      dueDate: 'Hoje',
      color: 'orange',
      done: true,
      connection: 'Saúde',
    },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const getDueColor = (color: string) => {
    if (color === 'orange') return 'text-org'
    if (color === 'red') return 'text-red'
    return 'text-t3'
  }

  return (
    <div className="mb-6">
      <h3 className="font-semibold text-t1 mb-4">Pendências</h3>
      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="bg-card rounded-xl p-4 flex items-start gap-3">
            <button
              onClick={() => toggleTask(task.id)}
              className="flex-shrink-0 mt-0.5"
            >
              {task.done ? (
                <CheckCircle2 className="w-5 h-5 text-grn" />
              ) : (
                <Circle className="w-5 h-5 text-border" />
              )}
            </button>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  task.done ? 'line-through text-t3' : 'text-t1'
                }`}
              >
                {task.title}
              </p>
              <p className={`text-xs mt-1 ${getDueColor(task.color)}`}>
                {task.dueDate}
              </p>
            </div>
            <p className="text-xs text-blue-500 flex-shrink-0">{task.connection}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const ProximosDias = () => {
  const days = [
    {
      date: 'Seg, 30 mar',
      events: [
        { time: '09:00', title: 'Reunião com time', duration: '1h' },
        { time: '14:00', title: 'Almoço com cliente', duration: '1.5h' },
        { time: '16:30', title: 'Revisão de projeto', duration: '30 min' },
      ],
    },
    {
      date: 'Ter, 31 mar',
      events: [
        { time: '10:00', title: 'Consultoria', duration: '1h' },
        { time: '15:00', title: 'Exercício', duration: '1h' },
      ],
    },
    {
      date: 'Qua, 01 abr',
      events: [
        { time: '09:30', title: 'Planejamento semanal', duration: '1h' },
        { time: '18:00', title: 'Jantar com família', duration: '2h' },
      ],
    },
  ]

  return (
    <div>
      <h3 className="font-semibold text-t1 mb-4">Próximos dias</h3>
      <div className="space-y-4">
        {days.map((day, dayIdx) => (
          <div key={dayIdx} className="bg-card rounded-2xl p-4">
            <h4 className="text-sm font-semibold text-t1 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {day.date}
            </h4>
            <div className="space-y-2">
              {day.events.map((event, eventIdx) => (
                <div key={eventIdx} className="flex gap-3 text-sm">
                  <span className="text-t3 font-medium w-12 flex-shrink-0">
                    {event.time}
                  </span>
                  <div className="flex-1">
                    <p className="text-t1 font-medium">{event.title}</p>
                    <p className="text-xs text-t3">{event.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const VidaPage = () => {
  return (
    <div className="px-5 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-t1 mb-2">Minha Vida</h1>
        <p className="text-sm text-t3">Módulos · Tarefas · Agenda</p>
      </div>

      <ModuleGrid />
      <Pendencias />
      <ProximosDias />
    </div>
  )
}

export default VidaPage
