'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Globe, Users, Clock, Brain, Search, Bell, Plus } from 'lucide-react'
import TodayPage from '@/components/today/TodayPage'
import MeuMundoPage from '@/components/world/MeuMundoPage'
import PeoplePage from '@/components/people/PeoplePage'
import MemoriasPage from '@/components/memories/MemoriasPage'
import BrainPage from '@/components/brain/BrainPage'
import CaptureSheet from '@/components/shared/CaptureSheet'

const TABS = [
  { id: 'hoje', label: 'Hoje', icon: Sparkles },
  { id: 'mundo', label: 'Meu Mundo', icon: Globe },
  { id: 'pessoas', label: 'Pessoas', icon: Users },
  { id: 'memorias', label: 'Memórias', icon: Clock },
  { id: 'cerebro', label: 'Cérebro', icon: Brain },
] as const

type TabId = typeof TABS[number]['id']

export default function HomePage() {
  const [tab, setTab] = useState<TabId>('hoje')
  const [showCapture, setShowCapture] = useState(false)
  const [nickname, setNickname] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Você'
        setNickname(name.split(' ')[0])
      }
    })
  }, [supabase.auth])

  const dateStr = new Date().toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  return (
    <div className="max-w-[430px] mx-auto h-dvh flex flex-col relative overflow-hidden bg-bg">
      {/* Header */}
      <header className="px-5 pt-[max(12px,env(safe-area-inset-top))] pb-3 flex items-center justify-between z-10 bg-bg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-acc to-acc2 flex items-center justify-center font-bold text-[13px] text-white">
            {nickname.slice(0, 2).toUpperCase() || 'JV'}
          </div>
          <div>
            <div className="text-[15px] font-semibold tracking-tight">{nickname || 'João'}</div>
            <div className="text-t3 text-xs mt-0.5">{dateStr}</div>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="w-[34px] h-[34px] rounded-full bg-card2 flex items-center justify-center text-t2 transition active:scale-90">
            <Search size={15} />
          </button>
          <button className="w-[34px] h-[34px] rounded-full bg-card2 flex items-center justify-center text-t2 relative transition active:scale-90">
            <Bell size={15} />
            <span className="absolute top-[5px] right-[5px] w-[7px] h-[7px] rounded-full bg-red border-[1.5px] border-bg" />
          </button>
          <button
            onClick={() => setShowCapture(true)}
            className="w-[34px] h-[34px] rounded-full bg-card2 flex items-center justify-center text-t2 transition active:scale-90"
          >
            <Plus size={16} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide scroll-smooth">
        <div className={tab === 'hoje' ? 'animate-page-in' : 'hidden'}><TodayPage /></div>
        <div className={tab === 'mundo' ? 'animate-page-in' : 'hidden'}><MeuMundoPage /></div>
        <div className={tab === 'pessoas' ? 'animate-page-in' : 'hidden'}><PeoplePage /></div>
        <div className={tab === 'memorias' ? 'animate-page-in' : 'hidden'}><MemoriasPage /></div>
        <div className={tab === 'cerebro' ? 'animate-page-in' : 'hidden'}><BrainPage /></div>
      </main>

      {/* Bottom Nav */}
      <nav className="absolute bottom-0 left-0 right-0 bg-bg/88 backdrop-blur-xl border-t border-border flex justify-around py-1.5 pb-[max(6px,env(safe-area-inset-bottom))] z-50">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-col items-center gap-[3px] px-3.5 py-1 rounded-xl transition ${
              tab === id ? 'text-acc' : 'text-t3'
            }`}
          >
            <Icon size={22} className="transition active:scale-85" />
            <span className="text-[10px] font-semibold tracking-wider">{label}</span>
          </button>
        ))}
      </nav>

      {/* Capture Sheet */}
      {showCapture && <CaptureSheet onClose={() => setShowCapture(false)} />}
    </div>
  )
}
