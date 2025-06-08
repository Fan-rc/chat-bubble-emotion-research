import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResultPage.css';

function ResultPage() {
  const [results, setResults] = useState([]);
  const [groupedResults, setGroupedResults] = useState({
    positive: [],
    leaningPositive: [],
    indifferent: [],
    leaningNegative: [],
    negative: []
  });
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // 获取用户名
    const participantId = localStorage.getItem('participantId');
    if (participantId) {
      setUserName(participantId);
    }
    
    // 从本地存储获取数据
    const storedAnswers = JSON.parse(localStorage.getItem('answers') || '[]');
    if (storedAnswers.length > 0) {
      setResults(storedAnswers);
      
      // 按情感类型分组结果
      const grouped = {
        positive: [],
        leaningPositive: [],
        indifferent: [],
        leaningNegative: [],
        negative: []
      };
      
      storedAnswers.forEach(result => {
        if (grouped[result.answer]) {
          grouped[result.answer].push(result.page);
        }
      });
      
      setGroupedResults(grouped);
    }
  }, []);
  
  // 获取情感标签
  const getEmotionLabel = (value) => {
    const emotions = {
      positive: 'Positive',
      leaningPositive: 'Leaning Positive',
      indifferent: 'Neutral',
      leaningNegative: 'Leaning Negative',
      negative: 'Negative'
    };
    return emotions[value] || value;
  };
  
  // 获取情感图片路径
  const getEmotionImagePath = (emotion) => {
    const emotionImages = {
      positive: '/images/Positive0.png',
      leaningPositive: '/images/Leaning Positive0.png',
      indifferent: '/images/Indifferent.png',
      leaningNegative: '/images/Leaning Negative0.png',
      negative: '/images/Negative0.png'
    };
    return process.env.PUBLIC_URL + (emotionImages[emotion] || '');
  };
  
  // 获取气泡图片路径
  const getBubbleImagePath = (pageNumber) => {
    return process.env.PUBLIC_URL + `/images/bubble${pageNumber}.png`;
  };
  
  // 处理气泡点击事件，跳转到对应测试页面
  const handleBubbleClick = (pageNumber) => {
    navigate(`/test/${pageNumber}`);
  };
  
  // 完成测试并提交结果
  const handleFinish = async () => {
    try {
      // 可以在这里添加最终的数据提交逻辑
      // 例如向后端发送一个完成信号
      const participantId = localStorage.getItem('participantId');
      if (participantId) {
        await axios.post('http://localhost:5001/api/complete', {
          participantId
        }).catch(err => {
          console.error('无法连接到服务器，但将继续执行', err);
        });
      }
      
      // 清除本地存储的测试数据
      localStorage.removeItem('answers');
      localStorage.removeItem('participantId');
      
      // 导航回首页
      navigate('/');
    } catch (error) {
      console.error('提交结果时出错:', error);
      // 即使出错也返回首页
      navigate('/');
    }
  };

  // 创建情感类型数组
  const emotionTypes = ['positive', 'leaningPositive', 'indifferent', 'leaningNegative', 'negative'];

  return (
    <div className="result-container">
      {/* 背景图片层 */}
      <div className="background-image" style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/1.1%20TEST1.png)`,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2
      }}></div>
      {/* 灰色矩形背景层 */}
      <div className="gray-background"></div>
      
      {/* 用户名显示 */}
      <div className="user-name">Welcome, {userName}</div>
      
      <h1 className="title">Overview</h1>
      
      <div className="emotion-bubbles-container">
        {emotionTypes.map((emotion) => (
          <div key={emotion} className="emotion-row">
            <div className="emotion-cell">
              <img 
                src={getEmotionImagePath(emotion)} 
                alt={getEmotionLabel(emotion)} 
                className="emotion-image"
              />
            </div>
            <div className="bubbles-cell">
              {groupedResults[emotion].length > 0 ? (
                <div className="bubbles-group">
                  {groupedResults[emotion].map((pageNum) => (
                    <div 
                      key={pageNum} 
                      className="bubble-wrapper"
                      onClick={() => handleBubbleClick(pageNum)}
                    >
                      <img 
                        src={getBubbleImagePath(pageNum)} 
                        alt={`Chat Bubble ${pageNum}`} 
                        className="bubble-image"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-bubbles">No selection</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* 将文字说明和Finish按钮放在同一行 */}
      <div className="instruction-finish-container">
        <p className="click-instruction">
          You can click on the chat bubble to go to the specific page and modify your selection. or
        </p>
        <div className="finish-button-container" onClick={handleFinish}>
          <img 
            src={process.env.PUBLIC_URL + '/images/Finish.png'} 
            alt="Finish" 
            className="finish-button-image"
          />
        </div>
      </div>
    </div>
  );
}

export default ResultPage; 