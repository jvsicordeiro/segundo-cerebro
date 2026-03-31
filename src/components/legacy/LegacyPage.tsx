'use client';

import { Search, ChevronRight, ToggleRight } from 'lucide-react';
import { useState } from 'react';

interface Collection {
  id: string;
  emoji: string;
  name: string;
  description: string;
}

interface TimelineEvent {
  year: number;
  month: string;
  emoji: string;
  title: string;
  description: string;
  connections?: Array<{ text: string; color: string }>;
}

const collections: Collection[] = [
  {
    id: 'cars',
    emoji: '🚗',
    name: 'Meus Carros',
    description: '4 carros · desde 2016',
  },
  {
    id: 'spfc',
    emoji: '⚽',
    name: 'SPFC — Jogos',
    description: '32 jogos · 18V 8E 6D',
  },
  {
    id: 'movies',
    emoji: '🎬',
    name: 'Filmes & Séries',
    description: '156 assistidos · 12 favoritos',
  },
  {
    id: 'travels',
    emoji: '✈️',
    name: 'Viagens',
    description: '8 viagens · 3 países',
  },
  {
    id: 'relationships',
    emoji: '❤️',
    name: 'Relacionamentos',
    description: 'Marcos importantes',
  },
  {
    id: 'career',
    emoji: '💼',
    name: 'Carreira',
    description: 'Clinai · empregos anteriores',
  },
  {
    id: 'shows',
    emoji: '🎵',
    name: 'Shows & Eventos',
    description: '14 shows · 6 eventos',
  },
  {
    id: 'letters',
    emoji: '💌',
    name: 'Cartas pro Futuro',
    description: '2 cartas escritas',
  },
];

const timelineEvents: TimelineEvent[] = [
  {
    year: 2025,
    month: 'Março',
    emoji: '🧠',
    title: 'Segundo Cérebro lançado',
    description: 'Inicio do projeto para armazenar memórias e histórias',
    connections: [
      { text: 'Carreira', color: 'bg-blue-100' },
      { text: 'Tecnologia', color: 'bg-green-100' },
    ],
  },
  {
    year: 2024,
    month: 'Julho',
    emoji: '📸',
    title: 'Gramado com esposa',
    description: 'Férias em Gramado, fotos do Oppenheimer',
    connections: [{ text: 'Relacionamento', color: 'bg-pink-100' }],
  },
  {
    year: 2024,
    month: 'Maio',
    emoji: '⚽',
    title: 'SPFC Campeão',
    description: 'Torcida intensidade máxima',
    connections: [{ text: 'Futebol', color: 'bg-orange-100' }],
  },
  {
    year: 2023,
    month: 'Fevereiro',
    emoji: '💍',
    title: 'Casamento',
    description: 'Um dos melhores dias da vida',
    connections: [{ text: 'Relacionamento', color: 'bg-pink-100' }],
  },
];

export default function LegacyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [familyModeOn, setFamilyModeOn] = useState(false);

  return (
    <div className="px-5 pb-24">
      {/* Hero Section */}
      <div className="pt-12 mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--t1)' }}>
          Meu Legado
        </h2>
        <p className="text-sm" style={{ color: 'var(--t2)' }}>
          Tudo que faz você ser você.
        </p>
      </div>

      {/* Stats Row */}
      <div className="flex justify-center gap-6 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--acc)' }}>
            847
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--t2)' }}>
            Memórias
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--acc)' }}>
            28
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--t2)' }}>
            Anos
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--acc)' }}>
            14
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--t2)' }}>
            Coleções
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ backgroundColor: 'var(--card2)' }}
        >
          <Search size={18} style={{ color: 'var(--t2)' }} />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--t1)' }}
          />
        </div>
      </div>

      {/* Family Mode Toggle */}
      <div
        className="p-4 rounded-xl mb-8 flex items-center gap-4 cursor-pointer transition-opacity hover:opacity-80"
        style={{ backgroundColor: 'var(--card)' }}
      >
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg"
          style={{ backgroundColor: 'var(--card2)' }}
        >
          👨‍👩‍👧
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--t1)' }}>
            Modo Família
          </h3>
          <p className="text-xs mt-1" style={{ color: 'var(--t2)' }}>
            Mostra só memórias marcadas com ♾️ Legado
          </p>
        </div>
        <button
          onClick={() => setFamilyModeOn(!familyModeOn)}
          className={`flex-shrink-0 w-12 h-6 rounded-full transition-all ${
            familyModeOn ? 'bg-green-500' : 'bg-gray-300'
          } relative`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              familyModeOn ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Collections Section */}
      <div className="mb-10">
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--t2)' }}>
          Coleções
        </h3>
        <div className="space-y-3">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all hover:opacity-70"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: 'var(--card2)' }}
              >
                {collection.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm" style={{ color: 'var(--t1)' }}>
                  {collection.name}
                </h4>
                <p className="text-xs mt-1" style={{ color: 'var(--t3)' }}>
                  {collection.description}
                </p>
              </div>
              <ChevronRight size={18} style={{ color: 'var(--t2)' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Breathing Quote */}
      <div className="mb-10 text-center py-8">
        <p
          className="text-sm italic leading-relaxed"
          style={{ color: 'var(--t2)' }}
        >
          A vida não é medida pelo número de vezes que respiramos, mas pelos
          momentos que nos tiram o fôlego.
        </p>
      </div>

      {/* Breathing Image Placeholder */}
      <div
        className="rounded-xl overflow-hidden mb-10 aspect-video flex flex-col items-center justify-center"
        style={{ backgroundColor: 'var(--card2)' }}
      >
        <div className="text-4xl mb-2">🏔️</div>
        <p className="text-xs text-center" style={{ color: 'var(--t2)' }}>
          Gramado, jul 2024 — com a esposa
        </p>
      </div>

      {/* Timeline Section */}
      <div>
        <h3 className="text-sm font-semibold mb-6" style={{ color: 'var(--t2)' }}>
          Linha do tempo
        </h3>

        {[2025, 2024, 2023].map((year) => {
          const yearEvents = timelineEvents.filter((e) => e.year === year);
          if (yearEvents.length === 0) return null;

          return (
            <div key={year} className="mb-8">
              <h4
                className="text-lg font-bold mb-4"
                style={{ color: 'var(--t1)' }}
              >
                {year}
              </h4>

              <div className="space-y-4">
                {yearEvents.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    {/* Timeline dot and line */}
                    <div className="flex flex-col items-center flex-shrink-0 w-8">
                      <div
                        className="w-3 h-3 rounded-full mt-1.5"
                        style={{ backgroundColor: 'var(--acc)' }}
                      />
                      {idx < yearEvents.length - 1 && (
                        <div
                          className="w-0.5 flex-1 my-2"
                          style={{ backgroundColor: 'var(--border)' }}
                        />
                      )}
                    </div>

                    {/* Event content */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-lg flex-shrink-0">{event.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <h5
                            className="font-semibold text-sm"
                            style={{ color: 'var(--t1)' }}
                          >
                            {event.title}
                          </h5>
                          <p
                            className="text-xs mt-1"
                            style={{ color: 'var(--t2)' }}
                          >
                            {event.month}
                          </p>
                        </div>
                      </div>
                      <p
                        className="text-xs mb-3 ml-6"
                        style={{ color: 'var(--t3)' }}
                      >
                        {event.description}
                      </p>
                      {event.connections && (
                        <div className="flex flex-wrap gap-2 ml-6">
                          {event.connections.map((conn, i) => (
                            <span
                              key={i}
                              className={`text-xs px-2 py-1 rounded-full ${conn.color}`}
                            >
                              {conn.text}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
