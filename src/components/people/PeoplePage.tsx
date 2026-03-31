'use client';

import { Search, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Person {
  id: string;
  name: string;
  role: string;
  emoji: string;
  bgColor: string;
  memory: string;
  category: 'Família' | 'Trabalho' | 'Profissionais' | 'Amigos';
  since?: string;
  extra?: string;
}

const people: Person[] = [
  {
    id: 'pai',
    name: 'Pai',
    role: '',
    emoji: '👨',
    bgColor: 'bg-blue-500',
    memory: '12 jogos SPFC · Gol G4 · 48 memórias',
    category: 'Família',
  },
  {
    id: 'mae',
    name: 'Mãe',
    role: 'Aniversário em 12 dias 🎂',
    emoji: '👩',
    bgColor: 'bg-pink-500',
    memory: '32 memórias',
    category: 'Família',
  },
  {
    id: 'esposa',
    name: 'Esposa',
    role: 'Desde fev/2023',
    emoji: '💕',
    bgColor: 'bg-pink-500',
    memory: 'Gramado · Oppenheimer · 87 memórias',
    category: 'Família',
    since: 'fev/2023',
  },
  {
    id: 'gilberto',
    name: 'Gilberto Marcomini Jr',
    role: 'Sócio Clinai 45%',
    emoji: '🤝',
    bgColor: 'bg-green-500',
    memory: 'Co-fundador · 5 jogos SPFC · 63 memórias',
    category: 'Trabalho',
  },
  {
    id: 'dr-roberto',
    name: 'Dr. Roberto',
    role: 'Dentista',
    emoji: '🦷',
    bgColor: 'bg-orange-500',
    memory: 'Próxima: qua 14h · 4 consultas',
    category: 'Profissionais',
  },
  {
    id: 'turma-futebol',
    name: 'Turma do Futebol',
    role: '8 pessoas · Domingos 16h',
    emoji: '⚽',
    bgColor: 'bg-purple-500',
    memory: '24 memórias juntos',
    category: 'Amigos',
  },
];

const categories = ['Família', 'Trabalho', 'Profissionais', 'Amigos'] as const;

export default function PeoplePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedByCategory = categories.reduce(
    (acc, category) => {
      acc[category] = filteredPeople.filter((p) => p.category === category);
      return acc;
    },
    {} as Record<string, Person[]>
  );

  return (
    <div className="px-5 pb-24">
      {/* Header */}
      <div className="pt-6 mb-6">
        <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--t1)' }}>
          Pessoas
        </h1>
        <p className="text-sm" style={{ color: 'var(--t2)' }}>
          Quem faz parte da sua história
        </p>
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
            placeholder="Buscar pessoa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--t1)' }}
          />
        </div>
      </div>

      {/* Categories */}
      {categories.map((category) => {
        const categoryPeople = groupedByCategory[category];
        if (categoryPeople.length === 0) return null;

        return (
          <div key={category} className="mb-8">
            <h2
              className="text-sm font-semibold mb-4"
              style={{ color: 'var(--t2)' }}
            >
              {category}
            </h2>

            <div className="space-y-3">
              {categoryPeople.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all hover:opacity-70"
                  style={{ backgroundColor: 'var(--card)' }}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg ${person.bgColor}`}
                  >
                    {person.emoji}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--t1)' }}>
                      {person.name}
                    </h3>
                    {person.role && (
                      <p className="text-xs mb-1" style={{ color: 'var(--t2)' }}>
                        {person.role}
                      </p>
                    )}
                    <p className="text-xs truncate" style={{ color: 'var(--t3)' }}>
                      {person.memory}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    size={18}
                    className="flex-shrink-0"
                    style={{ color: 'var(--t2)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
