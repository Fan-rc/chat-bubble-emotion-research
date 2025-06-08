#!/bin/bash

echo "正在启动研究者仪表盘，将在端口3001上运行..."
cd "$(dirname "$0")"
npm install
npm start 