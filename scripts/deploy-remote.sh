#!/bin/bash
# deploy-remote.sh — 从本地 Mac 触发远程部署。
#
# 前提：
# 1. 你已经把服务器 IP 和 SSH 用户名填到下面的变量里
# 2. 你的 SSH key 已经添加到服务器的 authorized_keys
#
# 用法：
#   npm run deploy
# 或直接：
#   bash scripts/deploy-remote.sh

set -euo pipefail

# ========== 在首次部署前填写这些变量 ==========
SERVER_IP="124.222.23.162"
SERVER_USER="ubuntu"
PROJECT_PATH="/var/www/ai-coding-for-beginners"
# ============================================

if [ "$SERVER_IP" = "YOUR_TENCENT_LIGHTHOUSE_IP" ]; then
  echo "错误：请先编辑 scripts/deploy-remote.sh，填入你的服务器 IP。"
  exit 1
fi

echo "[local] 本地 git push..."
git push origin main

echo "[local] 触发远程部署: $SERVER_USER@$SERVER_IP"
ssh "$SERVER_USER@$SERVER_IP" "cd $PROJECT_PATH && bash scripts/deploy.sh"

echo "[local] 部署完成。"
