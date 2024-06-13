import React, { useContext, useState } from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'

const Sidebar = () => {

  const [extended, setExtended] = useState(false)
  const [showSettings, setShowSettings] = useState(false);
  const {onSent, prevPrompts, setRecentPrompt, newChat} = useContext(Context)

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt)
    await onSent(prompt)
  }

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  return (
    <div className='sidebar'>
      <div className="top">
        <img onClick={() => setExtended(prev => !prev)} className='menu' src={assets.menu_icon} alt="" />
        <div onClick={()=>newChat()} className="new-chat">
            <img src={assets.plus_icon} alt="" />
            {extended ? <p>New chat</p> : null}
        </div>
        {extended ?
        <div className="recent">
            <p className="recent-title">Recent</p>
            {prevPrompts.map((item, index)=>{
              return (
                <div onClick={()=>loadPrompt(item)}className="recent-entry">
                  <img src={assets.message_icon} alt="" />
                  <p>{item.slice(0, 18)}...</p>
                </div>
              )
            })}
        </div> : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
            <img src={assets.question_icon} alt="" />
            {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
            <img src={assets.history_icon} alt="" />
            {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry" onClick={toggleSettings}>
            <img src={assets.setting_icon} alt="" />
            {extended ? <p>Settings</p> : null}
        </div>
        {showSettings && extended ? (
          <div className="settings-popup">
            <div className="setting-option">
              <img src={assets.moon_icon} alt="Moon Icon" className="moon-icon" />
              <p>Dark Theme</p>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Sidebar
