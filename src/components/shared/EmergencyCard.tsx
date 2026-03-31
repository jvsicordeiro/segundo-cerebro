'use client'

import { Share2 } from 'lucide-react'

interface EmergencyCardProps {
  bloodType?: string
  allergies?: string[]
  medications?: string[]
  emergencyContacts?: Array<{ name: string; phone: string }>
  insurance?: { name: string; number: string }
  doctor?: { name: string; phone: string }
}

export default function EmergencyCard({
  bloodType = 'O+',
  allergies = ['Penicilina', 'Amendoim'],
  medications = ['Atorvastatina 10mg', 'Omeprazol 20mg'],
  emergencyContacts = [
    { name: 'Esposa', phone: '11999999999' },
    { name: 'Pai', phone: '11988888888' },
  ],
  insurance = { name: 'Bradesco Saúde', number: '123456789' },
  doctor = { name: 'Dr. João Silva', phone: '1133333333' },
}: EmergencyCardProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cartão de Emergência',
          text: `Tipo sanguíneo: ${bloodType}\nAlergias: ${allergies.join(', ')}\nMedicamentos: ${medications.join(', ')}`,
        })
      } catch (err) {
        console.log('Compartilhamento cancelado')
      }
    }
  }

  return (
    <div className="w-full bg-red-50 rounded-2xl p-6 border-2 border-red-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-red-600">🚨 EMERGÊNCIA</h2>
        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition"
        >
          <Share2 size={16} />
        </button>
      </div>

      {/* Blood Type - Large */}
      <div className="bg-white rounded-xl p-4 mb-4 text-center border border-red-200">
        <p className="text-xs text-gray-500 mb-1">Tipo Sanguíneo</p>
        <p className="text-4xl font-bold text-red-600">{bloodType}</p>
      </div>

      {/* Allergies */}
      <div className="bg-white rounded-xl p-4 mb-4 border border-red-200">
        <p className="text-xs font-semibold text-gray-600 mb-2">ALERGIAS</p>
        {allergies.length > 0 ? (
          <ul className="space-y-1">
            {allergies.map((allergy, idx) => (
              <li key={idx} className="text-sm text-gray-800 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-red-500"></span>
                {allergy}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">Nenhuma alergia documentada</p>
        )}
      </div>

      {/* Medications */}
      <div className="bg-white rounded-xl p-4 mb-4 border border-red-200">
        <p className="text-xs font-semibold text-gray-600 mb-2">MEDICAMENTOS</p>
        {medications.length > 0 ? (
          <ul className="space-y-1">
            {medications.map((med, idx) => (
              <li key={idx} className="text-sm text-gray-800 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-red-500"></span>
                {med}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">Nenhum medicamento documentado</p>
        )}
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-xl p-4 mb-4 border border-red-200">
        <p className="text-xs font-semibold text-gray-600 mb-3">CONTATOS DE EMERGÊNCIA</p>
        <div className="space-y-2">
          {emergencyContacts.map((contact, idx) => (
            <a
              key={idx}
              href={`tel:${contact.phone}`}
              className="flex items-center justify-between p-2 rounded-lg bg-red-50 hover:bg-red-100 transition"
            >
              <span className="text-sm font-semibold text-gray-800">{contact.name}</span>
              <span className="text-xs text-red-600 font-mono">{contact.phone}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Insurance */}
      <div className="bg-white rounded-xl p-4 mb-4 border border-red-200">
        <p className="text-xs font-semibold text-gray-600 mb-1">SEGURO SAÚDE</p>
        <p className="text-sm text-gray-800 font-semibold">{insurance.name}</p>
        <p className="text-xs text-gray-600 font-mono mt-1">{insurance.number}</p>
      </div>

      {/* Doctor */}
      <div className="bg-white rounded-xl p-4 border border-red-200">
        <p className="text-xs font-semibold text-gray-600 mb-2">MÉDICO</p>
        <p className="text-sm text-gray-800 font-semibold mb-2">{doctor.name}</p>
        <a
          href={`tel:${doctor.phone}`}
          className="inline-flex items-center gap-2 px-3 py-2 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition"
        >
          📞 {doctor.phone}
        </a>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-500 text-center mt-4 italic">
        Acessível sem login em caso de emergência
      </p>
    </div>
  )
}
