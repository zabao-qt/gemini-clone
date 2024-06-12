import React, { useContext } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'

const Main = () => {
    const {onSent, recentPrompt, showResult, loading, resultData, setInput, input, randomizedPrompts} = useContext(Context);
    const handleCardClick = (text) => {
        setInput(text);
    };

    

  return (
    <div className='main'>
        <div className="nav">
            <p>Gemini</p>
            <img src={assets.user_triet} alt="" />
        </div>

        <div className="main-container">
            {!showResult ?
            <>
            <div className="greet">
                <p><span>Hello, Triet</span></p>
                <p>How can I help you today?</p>
            </div>

            <div className="cards">
                <div className="card" onClick={() => handleCardClick(randomizedPrompts.compass)}>
                    <p>{randomizedPrompts.compass}</p>
                    <img src={assets.compass_icon} alt="Compass Icon" />
                </div>
                <div className="card" onClick={() => handleCardClick(randomizedPrompts.bulb)}>
                    <p>{randomizedPrompts.bulb}</p>
                    <img src={assets.bulb_icon} alt="Bulb Icon" />
                </div>
                <div className="card" onClick={() => handleCardClick(randomizedPrompts.message)}>
                    <p>{randomizedPrompts.message}</p>
                    <img src={assets.message_icon} alt="Message Icon" />
                </div>
                <div className="card" onClick={() => handleCardClick(randomizedPrompts.code)}>
                    <p>{randomizedPrompts.code}</p>
                    <img src={assets.code_icon} alt="Code Icon" />
                </div>
            </div>
            </> :
            <div className="result">
                <div className="result-title">
                    <img src={assets.user_triet} alt="" />
                    <p>{recentPrompt}</p>
                </div>
                <div className="result-data">
                    {loading ? 
                        <img src={assets.gemini_icon_spin} alt="Loading..." className="spin" />
                        :
                        <img src={assets.gemini_icon} alt="Gemini Icon" />
                    }
                    {loading ? 
                    <div className='loader'>
                        <hr />
                        <hr />
                        <hr />
                    </div> 
                    : <p dangerouslySetInnerHTML={{__html:resultData}}></p>}
                </div>
            </div>
            }

            <div className="main-bottom">
                <div className="search-box">
                    <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder="Enter a prompt here" />
                    <div>
                        <img src={assets.gallery_icon} alt="" />
                        <img src={assets.mic_icon} alt="" />
                        {input ? <img onClick={()=>onSent()} src={assets.send_icon} alt="" /> : null}
                    </div>
                </div>
                <p className="bottom-info">
                    Gemini may display inaccurate info, including about people, so double-check its responses.
                    {' '}
                    <a href="https://support.google.com/gemini/answer/13594961?visit_id=01718200090328-8732818570713066315&p=privacy_notice&rd=1#privacy_notice" target="_blank" rel="noopener noreferrer">
                        Your privacy & Gemini Apps
                    </a>
                </p>
            </div>
        </div>
    </div>
  )
}

export default Main
