'use client'

import { useState } from 'react'
import { Shuffle, ChevronRight } from 'lucide-react'

interface Memory {
  id: string
  year: number
  month: string
  emoji: string
  title: string
  description: string
}

interface TimelineEvent {
  year: number
  month: string
  emoji: string
  title: string
  description: string
}

interface SealedLetter {
  id: string
  title: string
  writtenDate: string
  openDate: string
  emoji: string
}

interface Collection {
  id: string
  emoji: string
  name: string
  itemCount: number
}

const timelineEvents: Memory[] = [
  {
    id: '1',
    year: 2025,
    month: 'Março',
    emoji: '🧠',
    title: 'Segundo Cérebro lançado',
    description: 'Inicio do projeto para armazenar memórias e histórias',
  },
  {
    id: '2',
    year: 2024,
    month: 'Julho',
    emoji: '📸',
    title: 'Gramado com esposa',
    description: 'Férias em Gramado, fotos do Oppenheimer',
  },
  {
    id: '3',
    year: 2024,
    month: 'Maio',
    emoji: '⚽',
    title: 'SPFC Campeão',
    description: 'Torcida com intensidade máxima',
  },
  {
    id: '4',
    year: 2023,
    month: 'Fevereiro',
    emoji: '💍',
    title: 'Casamento',
    description: 'Um dos melhores dias da vida',
  },
  {
    id: '5',
    year: 2023,
    month: 'Janeiro',
    emoji: '🚀',
    title: 'Novo projeto iniciado',
    description: 'Começou a trabalhar em algo especial',
  },
]

const sealedLetters: SealedLetter[] = [
  {
    id: '1',
    title: 'Carta pro futuro aos 35 anos',
    writtenDate: 'dez 2022',
    openDate: 'dez 2027',
    emoji: '💌',
  },
  {
    id: '2',
    title: 'Mensagem para meu eu de 5 anos',
    writtenDate: 'mar 2025',
    openDate: 'mar 2030',
    emoji: '💌',
  },
]

const collections: Collection[] = [
  { id: '1', emoji: '⚽', name: 'Jogos SPFC', itemCount: 32 },
  { id: '2', emoji: '✈️', name: 'Viagens', itemCount: 8 },
  { id: '3', emoji: '🎵', name: 'Shows', itemCount: 14 },
  { id: '4', emoji: '🎬', name: 'Filmes', itemCount: 156 },
]

const memoryFlashback = {
  date: '29 mar 2024',
  yearsAgo: 1,
  emoji: '🧠',
  title: 'Dia memorável',
  description: 'Lembrei daquele dia que você estava tão entusiasmado com o novo projeto. A conversa com o time durou horas e vocês traçaram um plano incrível para os próximos meses.',
}

export default function MemoriasPage() {
  const [familyModeOn, setFamilyModeOn] = useState(false)

  return (
    <div className="px-5 pb-24">
      {/* Header */}
      <div className="pt-6 mb-6">
        <h1 className="text-3xl font-bold text-t1 mb-1">Memórias</h1>
        <p className="text-sm text-t2">Redescubra momentos que definiram sua história</p>
      </div>

      {/* Há X anos flashback */}
      <section className="mb-8">
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{memoryFlashback.emoji}</span>
            <div>
              <p className="text-xs text-t3">Há {memoryFlashback.yearsAgo} ano</p>
              <p className="text-xs font-semibold text-t1">{memoryFlashback.date}</p>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-t1 mb-2">{memoryFlashback.title}</h3>
          <p className="text-sm text-t2 leading-relaxed">{memoryFlashback.description}</p>
        </div>
      </section>

      {/* Redescubra */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-t1">🔀 Redescubra</h2>
          <button className="w-8 h-8 rounded-full bg-card flex items-center justify-center hover:bg-card2 transition">
            <Shuffle size={16} className="text-t2" />
          </button>
        </div>
        <div className="bg-card rounded-2xl p-5">
          <p className="text-xs text-t3 mb-3">Memória Aleatória</p>
          <p className="text-sm font-semibold text-t1 mb-2">📸 Viagem com Família</p>
          <p className="text-sm text-t2 leading-relaxed mb-4">
            Você anotou: "Dia incrívelvist em Gramado com todos. Fotos no meu lugar favorito."
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-border text-xs text-t2 rounded-full">Viagem</span>
            <span className="px-3 py-1 bg-border text-xs text-t2 rounded-full">Família</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-8">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-acc mb-1">847</div>
            <p className="text-xs text-t3">Memórias</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-acc mb-1">28</div>
            <p className="text-xs text-t3">Anos</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-acc mb-1">14</div>
            <p className="text-xs text-t3">Coleções</p>
          </div>
        </div>
      </section>

      {/* Coleções Rápidas */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-t1 mb-4">Coleções</h2>
        <div className="space-y-3">
          {collections.map(collection => (
            <div
              key={collection.id}
              className="bg-card rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:opacity-80 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{collection.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-t1">{collection.name}</p>
                  <p className="text-xs text-t3">{collection.itemCount} registros</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-t3" />
            </div>
          ))}
        </div>
      </section>

      {/* Cartas pro Futuro */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-t1 mb-4">💌 Cartas pro Futuro</h2>
        {sealedLetters.map(letter => (
          <div key={letter.id} className="bg-card rounded-2xl p-5 mb-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{letter.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-t1 mb-2">{letter.title}</p>
                <p className="text-xs text-t3 mb-3">Escrita em {letter.writtenDate}</p>
                <div className="bg-border rounded-lg px-3 py-2">
                  <p className="text-xs text-t2">Será aberta em {letter.openDate}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Modo Família */}
      <section className="mb-8">
        <div
          className="p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-opacity hover:opacity-80 bg-card"
        >
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg bg-card2"
          >
            👨‍👩‍👧
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-t1">Modo Família</h3>
            <p className="text-xs mt-1 text-t2">Mostra só memórias marcadas com ♾️ Legado</p>
          </div>
          <button
            onClick={() => setFamilyModeOn(!familyModeOn)}
            className={`flex-shrink-0 w-12 h-6 rounded-full transition-all ${
              familyModeOn ? 'bg-green-500' : 'bg-border'
            } relative`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                familyModeOn ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="text-sm font-semibold text-t1 mb-6">Linha do tempo</h2>

        {[2025, 2024, 2023].map((year) => {
          const yearEvents = timelineEvents.filter(e => e.year === year)
          if (yearEvents.length === 0) return null

          return (
            <div key={year} className="mb-8">
              <h3 className="text-lg font-bold text-t1 mb-4">{year}</h3>

              <div className="space-y-4">
                {yearEvents.map((event, idx) => (
                  <div key={event.id} className="flex gap-4">
                    {/* Timeline dot and line */}
                    <div className="flex flex-col items-center flex-shrink-0 w-8">
                      <div className="w-3 h-3 rounded-full bg-acc mt-1.5"></div>
                      {idx < yearEvents.length - 1 && (
                        <div className="w-0.5 flex-1 my-2 bg-border"></div>
                      )}
                    </div>

                    {/* Event content */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-lg flex-shrink-0">{event.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-t1">{event.title}</h4>
                          <p className="text-xs mt-1 text-t2">{event.month}</p>
                        </div>
                      </div>
                      <p className="text-xs mb-3 ml-6 text-t3">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* Inspirational Quote */}
      <section className="mb-8 text-center py-8">
        <p className="text-sm italic leading-relaxed text-t2">
          A vida não é medida pelo número de vezes que respiramos, mas pelos momentos que nos tiram o fôlego.
        </p>
      </section>
    </div>
  )
}
