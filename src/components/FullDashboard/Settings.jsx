import React, { useState } from 'react'
import { User, Bell, CreditCard, Shield } from 'lucide-react'
import './Settings.css'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="settings">
      <div className="settings__header">
        <h1 className="settings__title">Settings</h1>
        <p className="settings__subtitle">Manage your account settings and preferences.</p>
      </div>

      <div className="settings__layout">
        
        {/* Settings Sidebar */}
        <div className="settings__sidebar">
          <button 
            className={`settings__tab ${activeTab === 'profile' ? 'settings__tab--active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} />
            Profile
          </button>
          <button 
            className={`settings__tab ${activeTab === 'preferences' ? 'settings__tab--active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <Bell size={16} />
            Preferences
          </button>
          <button 
            className={`settings__tab ${activeTab === 'billing' ? 'settings__tab--active' : ''}`}
            onClick={() => setActiveTab('billing')}
          >
            <CreditCard size={16} />
            Billing
          </button>
          <button 
            className={`settings__tab ${activeTab === 'security' ? 'settings__tab--active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={16} />
            Security
          </button>
        </div>

        {/* Settings Content */}
        <div className="settings__content">
          
          {activeTab === 'profile' && (
            <div className="settings__panel">
              <h3>Profile Information</h3>
              <p>Update your account's profile information and email address.</p>
              
              <div className="settings__form">
                <div className="settings__form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue="Alex Johnson" />
                </div>
                
                <div className="settings__form-group">
                  <label>Email Address</label>
                  <input type="email" defaultValue="alex.johnson@example.com" />
                </div>
                
                <div className="settings__form-group">
                  <label>Job Title</label>
                  <input type="text" defaultValue="Senior Cloud Engineer" />
                </div>

                <div className="settings__form-actions">
                  <button className="settings__btn-primary">Save Changes</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="settings__panel">
              <h3>Notification Preferences</h3>
              <p>Choose what notifications you want to receive.</p>

              <div className="settings__form">
                <div className="settings__toggle-group">
                  <div>
                    <h4>Email Notifications</h4>
                    <span>Receive emails about your analysis results.</span>
                  </div>
                  <label className="settings__toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="settings__slider"></span>
                  </label>
                </div>
                
                <div className="settings__toggle-group">
                  <div>
                    <h4>Weekly Digest</h4>
                    <span>Get a weekly summary of your job matches.</span>
                  </div>
                  <label className="settings__toggle">
                    <input type="checkbox" />
                    <span className="settings__slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="settings__panel">
              <h3>Billing & Plan</h3>
              <p>Manage your subscription and payment methods.</p>
              
              <div className="settings__plan-card">
                <div className="settings__plan-info">
                  <h4>Pro Plan</h4>
                  <span>$19.99/month</span>
                </div>
                <button className="settings__btn-outline">Manage Subscription</button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings__panel">
              <h3>Security Settings</h3>
              <p>Ensure your account is secure.</p>
              
              <div className="settings__form">
                <div className="settings__form-group">
                  <label>Current Password</label>
                  <input type="password" />
                </div>
                
                <div className="settings__form-group">
                  <label>New Password</label>
                  <input type="password" />
                </div>

                <div className="settings__form-actions">
                  <button className="settings__btn-primary">Update Password</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
