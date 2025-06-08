import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  
  // 使用完整路径引用背景图片
  const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/homepage_bg.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: '100%'
  };

  const handleStart = () => {
    navigate('/introduction');
  };

  return (
    <div className="home-container" style={backgroundStyle}>
      <div className="content-container">
        <button className="get-started-button" onClick={handleStart}>
          Let's get started →
        </button>
        
        <h1 className="main-title">Visual Elements for Emotional Expression</h1>
        <h2 className="subtitle">in Social Application</h2>
      </div>
      
      <img className="logo" src={process.env.PUBLIC_URL + '/images/LOGO.png'} alt="Logo" />
    </div>
  );
}

export default HomePage; 