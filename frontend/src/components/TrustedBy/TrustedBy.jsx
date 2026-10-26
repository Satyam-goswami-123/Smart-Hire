import React from 'react'
import { Cpu, Globe, Terminal, Database } from 'lucide-react'
import './TrustedBy.css'

const COMPANIES = [
  { icon: Cpu,      name: 'TechCorp'  },
  { icon: Globe,    name: 'GlobalNet' },
  { icon: Terminal, name: 'DevSys'    },
  { icon: Database, name: 'DataStax'  },
]

export default function TrustedBy() {
  return (
    <section className="trusted" id="trusted" aria-label="Trusted companies">
      <div className="trusted__inner">
        <p className="trusted__label reveal">TRUSTED BY CANDIDATES HIRED AT</p>
        <div className="trusted__logos reveal" style={{ animationDelay: '0.1s' }}>
          {COMPANIES.map(({ icon: Icon, name }) => (
            <div key={name} className="trusted__logo" aria-label={name}>
              <Icon size={16} strokeWidth={1.5} />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
