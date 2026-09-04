import React from 'react'
import { Search, Bell, CircleHelp, Grip } from 'lucide-react'
import './Topbar.css'

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar__search">
        <Search size={16} color="#9CA3AF" />
        <input 
          type="text" 
          placeholder="Search analyses, resumes..." 
          className="topbar__search-input"
        />
      </div>

      <div className="topbar__actions">
        <button className="topbar__action-btn">
          <Bell size={18} strokeWidth={2} />
        </button>
        <button className="topbar__action-btn">
          <CircleHelp size={18} strokeWidth={2} />
        </button>
        <button className="topbar__action-btn">
          <Grip size={18} strokeWidth={2} />
        </button>
        <div className="topbar__avatar">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=32&h=32" alt="User Avatar" />
        </div>
      </div>
    </header>
  )
}
