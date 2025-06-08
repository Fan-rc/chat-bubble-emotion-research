import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './IntroductionPage.css';

function IntroductionPage() {
  const navigate = useNavigate();
  const [participantNumber, setParticipantNumber] = useState('');
  const [error, setError] = useState('');
  
  // 背景图片样式设置
  const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/intro_bg.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: '100%'
  };

  const handleStart = async () => {
    if (!participantNumber.trim()) {
      setError('Please enter your participant number');
      return;
    }
    
    try {
      // 创建新的会话
      await axios.post('http://localhost:5001/api/sessions', {
        participantId: participantNumber
      });
      
      // 保存参与者ID到本地存储
      localStorage.setItem('participantId', participantNumber);
      localStorage.setItem('answers', JSON.stringify([]));
      
      // 导航到第一个测试页面
      navigate('/test/1');
    } catch (err) {
      console.error(err);
      setError('Failed to create session, please try again');
    }
  };

  return (
    <div className="intro-container" style={backgroundStyle}>
      {/* Left Content Area */}
      <div className="intro-content">
        <div className="intro-header">
          <h1 className="intro-title">Visual Elements for Emotional Expression in Social Application</h1>
        </div>
        
        <div className="intro-description">
          <p>
            This study investigates how visual elements can assist users in conveying emotions 
            within text-based chat applications, using chat bubbles of varying shapes and colors 
            as experimental stimuli. Misunderstandings frequently arise in text-only conversations 
            due to the absence of visual expressions and social cues. Participants access a 
            customized web interface presenting a simulated conversation between two friends 
            planning an event. The final message, sent by "Alex" reads, "I'll leave it with you" and 
            appears with a modified chat bubble. Participants then judge the emotional tone of 
            this message by selecting one of the following options:
          </p>
          
          <p>
            Positive, Somewhat Positive, Neutral, Somewhat Negative, or Positive.
          </p>
          
          <p>
            We measure the influence of particular emotional representations across different 
            bubble shapes to see what combination of visual variables best conveys perception. 
            Don't think too much - just go with your first impulse.
          </p>
          
          <p>
            The goal of this research is to quantify the effectiveness of specific visual elements - 
            shape and color - in enhancing emotional expression in text-based chat. The 
            findings will inform the design of more intuitive chat interfaces that enable 
            users unfamiliar with emojis to leverage built-in "tone tags" and thereby reduce 
            miscommunication and improve conversation efficiency.
          </p>
          
          <p>
            Note: This information is anonymous and will not be shared with anyone other than 
            the researcher and mentor. The experiment will take approximately 30 minutes of your 
            time and will be planned to be conducted at TU Eindhoven campus. You will be able 
            to choose a time slot based on your availability. You will receive an email that details 
            more information about the experiment once you fill your details in this form.
          </p>
          
          <p>
            If you have any questions, please contact: f.yst@student.tue.nl
          </p>
        </div>
        
        <div className="user-input-section">
          <div className="input-container">
            {error && <p className="error-message">{error}</p>}
            <div className="input-group">
              <label htmlFor="participant-number">Participant Number</label>
              <input
                id="participant-number"
                className="participant-input"
                type="text"
                placeholder="Enter your assigned number"
                value={participantNumber}
                onChange={(e) => setParticipantNumber(e.target.value)}
              />
            </div>
            <button className="start-experiment-btn" onClick={handleStart}>
              Start Experiment
              <span className="arrow-icon">→</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Right Storyboard Image */}
      <div className="storyboard-container">
        <img 
          src={process.env.PUBLIC_URL + "/images/storyboard.png"} 
          alt="Experiment Storyboard" 
          className="storyboard-image" 
        />
      </div>
    </div>
  );
}

export default IntroductionPage; 