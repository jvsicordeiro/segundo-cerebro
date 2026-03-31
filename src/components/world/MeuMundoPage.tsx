'use client'

import { ChevronRight, Clock } from 'lucide-react'

interface Product {
  id: string
  name: string
  brand: string
  category: string
  daysRemaining: number
  emoji: string
}

interface Routine {
  id: string
  name: string
  type: 'morning' | 'evening'
  steps: string[]
  emoji: string
}

interface Subscription {
  id: string
  name: string
  cost: number
  nextDue: string
  frequency: string
  emoji: string
}

interface Collection {
  id: string
  name: string
  itemCount: number
  emoji: string
}

interface Place {
  id: string
  name: string
  category: string
  lastVisit: string
  emoji: string
}

interface WishlistItem {
  id: string
  name: string
  estimatedCost: number
  emoji: string
}

interface Document {
  id: string
  name: string
  type: string
  expiryDate: string
  emoji: string
}

interface MaintenanceItem {
  id: string
  name: string
  nextDate: string
  frequency: string
  emoji: string
}

const products: Product[] = [
  { id: '1', name: 'iPhone 15', brand: 'Apple', category: 'Eletrônico', daysRemaining: 450, emoji: '📱' },
  { id: '2', name: 'Nike Air Max', brand: 'Nike', category: 'Calçado', daysRemaining: 180, emoji: '👟' },
  { id: '3', name: 'MacBook Pro', brand: 'Apple', category: 'Computador', daysRemaining: 800, emoji: '💻' },
  { id: '4', name: 'AirPods Pro', brand: 'Apple', category: 'Áudio', daysRemaining: 220, emoji: '🎧' },
]

const routines: Routine[] = [
  {
    id: '1',
    name: 'Rotina Matinal',
    type: 'morning',
    steps: ['Acordar às 6h', 'Meditação 10min', 'Exercício 30min', 'Banho', 'Café'],
    emoji: '🌅',
  },
  {
    id: '2',
    name: 'Rotina Noturna',
    type: 'evening',
    steps: ['Desligar trabalho às 18h', 'Leitura 30min', 'Meditação 10min', 'Sem telas 1h', 'Dormir cedo'],
    emoji: '🌙',
  },
]

const subscriptions: Subscription[] = [
  { id: '1', name: 'Netflix', cost: 49.9, nextDue: '05 abr', frequency: 'mensal', emoji: '🎬' },
  { id: '2', name: 'Spotify', cost: 14.9, nextDue: '10 abr', frequency: 'mensal', emoji: '🎵' },
  { id: '3', name: 'Gym', cost: 150, nextDue: '01 abr', frequency: 'mensal', emoji: '💪' },
  { id: '4', name: 'Cloud Storage', cost: 9.99, nextDue: '15 abr', frequency: 'mensal', emoji: '☁️' },
]

const collections: Collection[] = [
  { id: '1', name: 'Jogos SPFC', itemCount: 32, emoji: '⚽' },
  { id: '2', name: 'Viagens', itemCount: 8, emoji: '✈️' },
  { id: '3', name: 'Shows', itemCount: 14, emoji: '🎵' },
  { id: '4', name: 'Filmes', itemCount: 156, emoji: '🎬' },
]

const places: Place[] = [
  { id: '1', name: 'Gramado', category: 'Montanha', lastVisit: 'jul 2024', emoji: '🏔️' },
  { id: '2', name: 'Praia da Enseada', category: 'Praia', lastVisit: 'fev 2024', emoji: '🏖️' },
  { id: '3', name: 'Padaria da Esquina', category: 'Comida', lastVisit: 'hoje', emoji: '🥐' },
  { id: '4', name: 'Parque Ibirapuera', category: 'Parque', lastVisit: 'mar 2024', emoji: '🌳' },
]

const wishlist: WishlistItem[] = [
  { id: '1', name: 'Câmera Fujifilm', estimatedCost: 5000, emoji: '📷' },
  { id: '2', name: 'Bike Gravel', estimatedCost: 3000, emoji: '🚲' },
  { id: '3', name: 'PlayStation 5', estimatedCost: 4500, emoji: '🎮' },
]

const documents: Document[] = [
  { id: '1', name: 'Passaporte', type: 'Identidade', expiryDate: 'dez 2028', emoji: '🛂' },
  { id: '2', name: 'CNH', type: 'Dirigir', expiryDate: 'ago 2026', emoji: '🚗' },
  { id: '3', name: 'Seguro do Carro', type: 'Seguro', expiryDate: 'mai 2025', emoji: '📋' },
]

const maintenance: MaintenanceItem[] = [
  { id: '1', name: 'Revisão do Carro', nextDate: '15 abr', frequency: '6 meses', emoji: '🔧' },
  { id: '2', name: 'Limpeza dos Dentes', nextDate: '20 abr', frequency: '6 meses', emoji: '🦷' },
  { id: '3', name: 'Check-up Anual', nextDate: '05 mai', frequency: '1 ano', emoji: '⚕️' },
]

const SectionHeader = ({ title, emoji }: { title: string; emoji: string }) => (
  <div className="mb-4">
    <h3 className="text-sm font-semibold text-t1 flex items-center gap-2">
      <span className="text-lg">{emoji}</span>
      {title}
    </h3>
  </div>
)

const ProductCard = ({ product }: { product: Product }) => (
  <div className="bg-card rounded-2xl p-4 mb-3">
    <div className="flex items-start justify-between mb-2">
      <div>
        <p className="text-sm font-semibold text-t1">{product.emoji} {product.name}</p>
        <p className="text-xs text-t3 mt-1">{product.brand} · {product.category}</p>
      </div>
      <span className="text-xs bg-border px-2 py-1 rounded-full text-t2">{product.daysRemaining}d</span>
    </div>
  </div>
)

const RoutineCard = ({ routine }: { routine: Routine }) => (
  <div className="bg-card rounded-2xl p-4 mb-3">
    <p className="text-sm font-semibold text-t1 mb-3">{routine.emoji} {routine.name}</p>
    <ul className="space-y-1">
      {routine.steps.map((step, idx) => (
        <li key={idx} className="text-xs text-t2 flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-border"></span>
          {step}
        </li>
      ))}
    </ul>
  </div>
)

const SubscriptionCard = ({ subscription }: { subscription: Subscription }) => (
  <div className="bg-card rounded-2xl p-4 mb-3 flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold text-t1">{subscription.emoji} {subscription.name}</p>
      <p className="text-xs text-t3 mt-1">R$ {subscription.cost.toFixed(2)} · {subscription.frequency}</p>
    </div>
    <div className="text-right">
      <p className="text-xs font-semibold text-t1">{subscription.nextDue}</p>
    </div>
  </div>
)

const CollectionCard = ({ collection }: { collection: Collection }) => (
  <div className="bg-card rounded-2xl p-4 flex flex-col items-center justify-center text-center mb-3">
    <p className="text-2xl mb-2">{collection.emoji}</p>
    <p className="text-xs font-semibold text-t1">{collection.name}</p>
    <p className="text-xs text-t3 mt-1">{collection.itemCount} items</p>
  </div>
)

const PlaceCard = ({ place }: { place: Place }) => (
  <div className="bg-card rounded-2xl p-4 mb-3">
    <div className="flex items-start gap-3">
      <p className="text-2xl">{place.emoji}</p>
      <div className="flex-1">
        <p className="text-sm font-semibold text-t1">{place.name}</p>
        <p className="text-xs text-t2">{place.category}</p>
        <p className="text-xs text-t3 mt-1">Última vez: {place.lastVisit}</p>
      </div>
    </div>
  </div>
)

const WishlistCard = ({ item }: { item: WishlistItem }) => (
  <div className="bg-card rounded-2xl p-4 mb-3 flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold text-t1">{item.emoji} {item.name}</p>
    </div>
    <p className="text-xs font-semibold text-acc">R$ {item.estimatedCost}</p>
  </div>
)

const DocumentCard = ({ doc }: { doc: Document }) => (
  <div className="bg-card rounded-2xl p-4 mb-3 flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold text-t1">{doc.emoji} {doc.name}</p>
      <p className="text-xs text-t3 mt-1">{doc.type}</p>
    </div>
    <p className="text-xs font-semibold text-t2">{doc.expiryDate}</p>
  </div>
)

const MaintenanceCard = ({ item }: { item: MaintenanceItem }) => (
  <div className="bg-card rounded-2xl p-4 mb-3 flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold text-t1">{item.emoji} {item.name}</p>
      <p className="text-xs text-t3 mt-1">A cada {item.frequency}</p>
    </div>
    <p className="text-xs font-semibold text-t2">{item.nextDate}</p>
  </div>
)

export default function MeuMundoPage() {
  return (
    <div className="px-5 pb-24">
      {/* Header */}
      <div className="pt-6 mb-6">
        <h1 className="text-3xl font-bold text-t1 mb-1">Meu Mundo</h1>
        <p className="text-sm text-t2">Tudo sobre as coisas que usam seu tempo e dinheiro</p>
      </div>

      {/* Produtos em Uso */}
      <section className="mb-8">
        <SectionHeader title="Produtos em Uso" emoji="🛍️" />
        <div className="grid grid-cols-2 gap-3 mb-6">
          {products.map(product => (
            <div key={product.id} className="bg-card rounded-2xl p-3 text-center">
              <p className="text-2xl mb-2">{product.emoji}</p>
              <p className="text-xs font-semibold text-t1 mb-1">{product.name}</p>
              <p className="text-xs text-t3">{product.daysRemaining}d</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rotinas */}
      <section className="mb-8">
        <SectionHeader title="Rotinas" emoji="⏰" />
        {routines.map(routine => (
          <RoutineCard key={routine.id} routine={routine} />
        ))}
      </section>

      {/* Assinaturas */}
      <section className="mb-8">
        <SectionHeader title="Assinaturas" emoji="💳" />
        {subscriptions.map(sub => (
          <SubscriptionCard key={sub.id} subscription={sub} />
        ))}
        <div className="bg-card rounded-2xl p-4 text-center">
          <p className="text-sm font-semibold text-acc">Total mensal: R$ {subscriptions.reduce((sum, s) => sum + s.cost, 0).toFixed(2)}</p>
        </div>
      </section>

      {/* Coleções */}
      <section className="mb-8">
        <SectionHeader title="Coleções" emoji="📚" />
        <div className="grid grid-cols-2 gap-3">
          {collections.map(collection => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      {/* Lugares Favoritos */}
      <section className="mb-8">
        <SectionHeader title="Lugares Favoritos" emoji="📍" />
        {places.map(place => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </section>

      {/* Lista de Desejos */}
      <section className="mb-8">
        <SectionHeader title="Lista de Desejos" emoji="🎁" />
        {wishlist.map(item => (
          <WishlistCard key={item.id} item={item} />
        ))}
      </section>

      {/* Cofre de Documentos */}
      <section className="mb-8">
        <SectionHeader title="Cofre de Documentos" emoji="🔒" />
        {documents.map(doc => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </section>

      {/* Manutenção */}
      <section className="mb-8">
        <SectionHeader title="Manutenção" emoji="🔧" />
        {maintenance.map(item => (
          <MaintenanceCard key={item.id} item={item} />
        ))}
      </section>
    </div>
  )
}
