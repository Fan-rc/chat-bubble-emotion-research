const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 5001;

// 创建数据目录（如果不存在）
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// 创建会话文件（如果不存在）
const sessionsFile = path.join(dataDir, 'sessions.json');
if (!fs.existsSync(sessionsFile)) {
  fs.writeFileSync(sessionsFile, JSON.stringify([]));
}

// 创建响应文件（如果不存在）
const responsesFile = path.join(dataDir, 'responses.json');
if (!fs.existsSync(responsesFile)) {
  fs.writeFileSync(responsesFile, JSON.stringify([]));
}

// 中间件
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 辅助函数：读取JSON文件
const readJsonFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
};

// 辅助函数：写入JSON文件
const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// API路由
// 1. 创建新会话
app.post('/api/sessions', (req, res) => {
  try {
    const { participantId } = req.body;
    
    if (!participantId) {
      return res.status(400).json({ message: '参与者ID是必需的' });
    }
    
    const sessions = readJsonFile(sessionsFile);
    
    // 检查该ID是否已存在
    const existingSession = sessions.find(s => s.participantId === participantId);
    if (existingSession) {
      return res.status(200).json({ message: '会话已存在', session: existingSession });
    }
    
    // 创建新会话
    const newSession = {
      participantId,
      startTime: new Date().toISOString(),
      completed: false
    };
    
    sessions.push(newSession);
    writeJsonFile(sessionsFile, sessions);
    
    res.status(201).json({ message: '会话创建成功', session: newSession });
  } catch (error) {
    console.error('创建会话出错:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 2. 提交用户响应
app.post('/api/responses', (req, res) => {
  try {
    const { participantId, page, image, response } = req.body;
    
    if (!participantId || !page || !image || !response) {
      return res.status(400).json({ message: '缺少必要的参数' });
    }
    
    const responses = readJsonFile(responsesFile);
    
    // 检查是否已有这个参与者在此页面的响应
    const existingResponseIndex = responses.findIndex(
      r => r.participantId === participantId && r.page === page
    );
    
    const responseData = {
      participantId,
      page,
      image,
      response,
      timestamp: new Date().toISOString()
    };
    
    if (existingResponseIndex >= 0) {
      // 更新现有响应
      responses[existingResponseIndex] = responseData;
    } else {
      // 添加新响应
      responses.push(responseData);
    }
    
    writeJsonFile(responsesFile, responses);
    
    // 如果是最后一页，标记会话为已完成
    if (page === 9) {
      const sessions = readJsonFile(sessionsFile);
      const sessionIndex = sessions.findIndex(s => s.participantId === participantId);
      
      if (sessionIndex >= 0) {
        sessions[sessionIndex].completed = true;
        sessions[sessionIndex].endTime = new Date().toISOString();
        writeJsonFile(sessionsFile, sessions);
      }
    }
    
    res.status(200).json({ message: '响应保存成功' });
  } catch (error) {
    console.error('保存响应出错:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 3. 获取参与者的所有响应
app.get('/api/responses/:participantId', (req, res) => {
  try {
    const { participantId } = req.params;
    const responses = readJsonFile(responsesFile);
    
    const participantResponses = responses.filter(r => r.participantId === participantId);
    
    res.status(200).json(participantResponses);
  } catch (error) {
    console.error('获取响应出错:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 4. 获取统计数据（用于研究者网站）
app.get('/api/statistics', (req, res) => {
  try {
    const responses = readJsonFile(responsesFile);
    const sessions = readJsonFile(sessionsFile);
    
    // 计算每个图像的响应分布
    const imageStats = {};
    
    responses.forEach(r => {
      if (!imageStats[r.image]) {
        imageStats[r.image] = {
          positive: 0,
          leaningPositive: 0,
          indifferent: 0,
          leaningNegative: 0,
          negative: 0,
          total: 0
        };
      }
      
      imageStats[r.image][r.response]++;
      imageStats[r.image].total++;
    });
    
    // 按照图片名称进行排序
    const sortedImageStats = {};
    Object.keys(imageStats).sort().forEach(key => {
      sortedImageStats[key] = imageStats[key];
    });
    
    // 计算完成测试的参与者数量
    const completedSessions = sessions.filter(s => s.completed).length;
    
    res.status(200).json({
      totalParticipants: sessions.length,
      completedParticipants: completedSessions,
      imageStatistics: sortedImageStats
    });
  } catch (error) {
    console.error('获取统计数据出错:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 5. 标记会话为已完成
app.post('/api/complete', (req, res) => {
  try {
    const { participantId } = req.body;
    
    if (!participantId) {
      return res.status(400).json({ message: '参与者ID是必需的' });
    }
    
    const sessions = readJsonFile(sessionsFile);
    const sessionIndex = sessions.findIndex(s => s.participantId === participantId);
    
    if (sessionIndex >= 0) {
      sessions[sessionIndex].completed = true;
      sessions[sessionIndex].endTime = new Date().toISOString();
      writeJsonFile(sessionsFile, sessions);
      
      res.status(200).json({ message: '会话已标记为完成' });
    } else {
      res.status(404).json({ message: '找不到指定的会话' });
    }
  } catch (error) {
    console.error('完成会话出错:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 6. 重置所有统计数据
app.post('/api/reset', (req, res) => {
  try {
    writeJsonFile(responsesFile, []);
    writeJsonFile(sessionsFile, []);
    res.status(200).json({ message: 'All statistics have been reset.' });
  } catch (error) {
    console.error('重置数据出错:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口: ${PORT}`);
}); 