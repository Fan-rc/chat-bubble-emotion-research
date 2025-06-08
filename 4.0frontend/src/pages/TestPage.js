import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TestPage.css';

const TestPage = () => {
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentPageNum, setCurrentPageNum] = useState(parseInt(pageNumber, 10));
  const [userName, setUserName] = useState('');
  
  // 情感选项
  const emotionOptions = [
    { value: 'positive', label: 'Positive', image: '/images/Positive0.png' },
    { value: 'leaningPositive', label: 'Leaning Positive', image: '/images/Leaning Positive0.png' },
    { value: 'indifferent', label: 'Neutral', image: '/images/Indifferent.png' },
    { value: 'leaningNegative', label: 'Leaning Negative', image: '/images/Leaning Negative0.png' },
    { value: 'negative', label: 'Negative', image: '/images/Negative0.png' }
  ];
  
  useEffect(() => {
    // 获取用户名
    const participantId = localStorage.getItem('participantId');
    if (participantId) {
      setUserName(participantId);
    }
    
    // 检查是否已经存储了此页面的答案
    const storedAnswers = JSON.parse(localStorage.getItem('answers') || '[]');
    const thisPageAnswer = storedAnswers.find(a => a.page === currentPageNum);
    if (thisPageAnswer) {
      setSelectedOption(thisPageAnswer.answer);
    } else {
      setSelectedOption(null);
    }
  }, [currentPageNum]);
  
  // 添加退出处理函数
  const handleQuit = () => {
    // 清除所有保存的答案
    localStorage.removeItem('answers');
    
    // 跳转回首页
    navigate('/');
  };
  
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handlePrevious = () => {
    if (currentPageNum > 1) {
      navigate(`/test/${currentPageNum - 1}`);
      setCurrentPageNum(prevNum => prevNum - 1);
    }
  };

  const handleNext = async () => {
    if (!selectedOption) {
      alert('Please select an option before continuing');
      return;
    }
    
    // 保存当前页面的答案
    const participantId = localStorage.getItem('participantId');
    const storedAnswers = JSON.parse(localStorage.getItem('answers') || '[]');
    const imageName = `chatbubble${currentPageNum}.png`; 
    
    // 更新本地存储
    const newAnswer = { page: currentPageNum, image: imageName, answer: selectedOption };
    
    // 检查是否已存在此页面的答案
    const existingAnswerIndex = storedAnswers.findIndex(a => a.page === currentPageNum);
    if (existingAnswerIndex >= 0) {
      storedAnswers[existingAnswerIndex] = newAnswer;
    } else {
      storedAnswers.push(newAnswer);
    }
    
    localStorage.setItem('answers', JSON.stringify(storedAnswers));
    
    // 发送数据到后端
    try {
      await axios.post('http://localhost:5001/api/responses', {
        participantId,
        page: currentPageNum,
        image: imageName,
        response: selectedOption
      });
    } catch (error) {
      console.error('保存响应失败:', error);
    }
    
    // 导航到下一页
    if (currentPageNum < 9) {
      navigate(`/test/${currentPageNum + 1}`);
      setCurrentPageNum(prevNum => prevNum + 1);
    } else {
      // 所有测试已完成，导航到结果页面
      navigate('/result');
    }
  };

  return (
    <div className="test-container">
      {/* 添加背景图片作为独立元素 */}
      <div className="background-image" style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/1.1%20TEST1.png)`,
        backgroundSize: '100% 100%',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}></div>
      
      {/* 添加用户名显示 */}
      <div className="user-name">Welcome, {userName}</div>
      
      {/* 添加标题文字 */}
      <div className="page-title">What do you think Isa is expressing?</div>
      
      <div className="content-wrapper">
        <div className="image-container">
          <img 
            src={process.env.PUBLIC_URL + `/images/chatbubble${currentPageNum}.png`}
            alt={`Chat Bubble ${currentPageNum}`} 
          />
        </div>
        
        <div className="options-container">
          {emotionOptions.map((option) => (
            <button
              key={option.value}
              className={`emotion-option ${selectedOption === option.value ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(option.value)}
            >
              <img src={process.env.PUBLIC_URL + option.image} alt={option.label} />
            </button>
          ))}
        </div>
      </div>
      
      <div className="navigation-buttons">
        <button onClick={handlePrevious} className="previous-button">
          <img src={process.env.PUBLIC_URL + "/images/Previous.png"} alt="Previous" />
        </button>
        
        {/* 替换为动态进度条 */}
        <div className="process-bar-container">
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${(currentPageNum / 9) * 100}%` }}
            ></div>
          </div>
          <span className="progress-bar-text">{currentPageNum} / 9</span>
        </div>
        
        <button onClick={handleNext} className="next-button">
          <img src={process.env.PUBLIC_URL + "/images/Next.png"} alt="Next" />
        </button>
      </div>
    </div>
  );
};

export default TestPage; 