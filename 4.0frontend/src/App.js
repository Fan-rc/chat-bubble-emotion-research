import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import IntroductionPage from './pages/IntroductionPage';
import TestPage from './pages/TestPage';
import ResultPage from './pages/ResultPage';

function App() {
  // 检查用户是否已经通过介绍页面（通过检查参与者ID）
  const hasParticipantId = () => {
    return localStorage.getItem('participantId') !== null;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/introduction" element={<IntroductionPage />} />
        
        {/* 测试页面路由保护，确保用户已通过介绍页面 */}
        <Route 
          path="/test/:pageNumber" 
          element={hasParticipantId() ? <TestPage /> : <Navigate to="/introduction" />} 
        />
        
        {/* 结果页面路由保护 */}
        <Route 
          path="/result" 
          element={hasParticipantId() ? <ResultPage /> : <Navigate to="/introduction" />} 
        />
        
        {/* 处理未匹配的路径 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App; 