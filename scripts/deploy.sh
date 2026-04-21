#!/bin/bash
# deploy.sh — 在腾讯云轻量应用服务器上运行的部署脚本。
#
# 用法（SSH 到服务器后执行）：
#   cd /var/www/ai-coding-for-beginners
#   bash scripts/deploy.sh
#
# 或者从本地触发：
#   ssh ubuntu@<IP> "cd /var/www/ai-coding-for-beginners && bash scripts/deploy.sh"

set -euo pipefail

PROJECT_DIR="/var/www/ai-coding-for-beginners"

echo "[deploy] 切换到项目目录: $PROJECT_DIR"
cd "$PROJECT_DIR"

echo "[deploy] 拉取最新代码..."
git pull origin main

echo "[deploy] 安装依赖（npm ci）..."
npm ci

echo "[deploy] 构建生产产物..."
npm run build

echo "[deploy] 完成。Nginx 直接服务 dist/ 目录，无需 reload。"
echo "[deploy] 访问: http://$(curl -s ifconfig.me)"
