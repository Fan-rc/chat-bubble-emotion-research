import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
// 引入背景图片
import introBackground from '../images/0.1 INTRODUCTION.png';

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 背景样式
  const backgroundStyle = {
    backgroundImage: `url(${introBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -2
  };
  
  // 获取统计数据
  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:5001/api/statistics');
      setStatistics(response.data);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
      setError('Unable to load statistics. Please check if the backend server is running');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
    
    // 每30秒自动刷新一次数据
    const intervalId = setInterval(fetchStatistics, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // 将图像统计数据转换为统计结果数组
  const processBubbleStats = (imageStats) => {
    if (!imageStats) return [];
    const bubbleResults = [];
    for (let i = 1; i <= 9; i++) {
      const chatbubbleName = `chatbubble${i}.png`;
      const bubbleName = `bubble${i}.png`;
      if (imageStats[chatbubbleName]) {
        const stats = imageStats[chatbubbleName];
        bubbleResults.push({
          bubbleNumber: i,
          bubbleImage: bubbleName,
          emotionCounts: {
            positive: stats.positive || 0,
            leaningPositive: stats.leaningPositive || 0,
            indifferent: stats.indifferent || 0,
            leaningNegative: stats.leaningNegative || 0,
            negative: stats.negative || 0,
          },
          totalResponses: stats.total || 0
        });
      }
    }
    return bubbleResults;
  };

  // 刷新按钮点击处理函数
  const handleRefresh = () => {
    fetchStatistics();
  };

  // 重置数据处理函数
  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all statistics? This cannot be undone.')) return;
    try {
      await axios.post('http://localhost:5001/api/reset');
      fetchStatistics();
      alert('All statistics have been reset.');
    } catch (err) {
      alert('Failed to reset data.');
    }
  };

  // 加载中显示
  if (loading) {
    return (
      <>
        <div style={backgroundStyle}></div>
        <div className="loading">Loading statistics...</div>
      </>
    );
  }

  // 错误显示
  if (error) {
    return (
      <>
        <div style={backgroundStyle}></div>
        <div className="error">{error}</div>
      </>
    );
  }

  const bubbleStats = processBubbleStats(statistics?.imageStatistics);

  return (
    <>
      <div style={backgroundStyle}></div>
      
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Researcher Dashboard - Chat Bubble Emotion Matching Statistics</h1>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <button className="refresh-btn" onClick={handleRefresh}>
              <span>Refresh Data</span>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
              </svg>
            </button>
            <button className="reset-btn" onClick={handleReset}>
              <span>Reset Data</span>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2 2v12h12V2H2zm11 11H3V3h10v10z"/>
                <path d="M8 5v6M5 8h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        {statistics && (
          <div className="summary-section">
            <div className="summary-card">
              <h2 className="summary-title">Participant Data Overview</h2>
              <div className="summary-stats">
                <div className="stat-item">
                  <div className="stat-value">{statistics.totalParticipants}</div>
                  <div className="stat-label">Total Participants</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{statistics.completedParticipants}</div>
                  <div className="stat-label">Completed Tests</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {bubbleStats.reduce((total, bubble) => total + bubble.totalResponses, 0)}
                  </div>
                  <div className="stat-label">Total Responses</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="stats-section">
          <h2 className="stats-header">Chat Bubble Emotion Matching Results</h2>
          
          <div className="bubble-stats-grid">
            {bubbleStats.map((bubble) => (
              <div key={bubble.bubbleNumber} className="bubble-result-card">
                <div className="bubble-image-container">
                  <img 
                    src={`${process.env.PUBLIC_URL}/images/${bubble.bubbleImage}`} 
                    alt={`Bubble ${bubble.bubbleNumber}`} 
                    className="bubble-image"
                  />
                </div>
                <div className="positive-result">
                  {Object.entries(bubble.emotionCounts).map(([emotion, count]) => (
                    <div key={emotion} className="emotion-stat">
                      <span className="emotion-label">{emotion}</span>: <span className="emotion-count">{count}</span>
                    </div>
                  ))}
                  <div className="positive-text" style={{marginTop: 6, fontSize: '0.9em', color: '#888'}}>
                    Total: {bubble.totalResponses}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard; 