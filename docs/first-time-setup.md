# 首次部署手册（Mac mini → 腾讯云轻量服务器）

这份手册**只在 Phase 1 第一次上线时用一次**。之后日常部署只需要 `npm run deploy`。

你的开发环境是 Mac mini（已跑 OpenClaw、有 Homebrew + Node + Git）。这份手册假设你本地环境已经成熟，重点在**服务器端的配置**和**本地与服务器之间的桥接**。

---

## 准备工作

**你本地需要的**：

- 终端 App（推荐 iTerm2 或 Warp，系统自带 Terminal 也行）
- 公网 IP（腾讯云轻量应用服务器控制台能看到）
- 服务器的 ubuntu 账户密码，或已配置的 SSH 密钥

**本地已有的（跳过）**：

- Node.js、Git、SSH 客户端 —— 你的 Mac mini 已经都有了

---

## 第一步：本地项目初始化

```bash
mkdir -p ~/Projects
cd ~/Projects

# 如果你已经解压了 zip
cd ~/Projects/ai-coding-for-beginners

# 确认 Node 版本 >= 20
node --version

# 安装依赖
npm install

# 本地跑起来
npm run dev
# 浏览器打开 http://localhost:4321 验证
```

**本地都跑不起来就部署，是新手最容易走偏的地方**。先确保本地 OK 再进入下一步。

---

## 第二步：SSH 登录服务器

```bash
ssh ubuntu@<公网IP>
# 第一次连接会提示 fingerprint，输入 yes，然后输入密码
```

登录成功后，提示符会变成类似 `ubuntu@VM-xxx-xxx:~$`。

**先看看服务器什么情况**：

```bash
lsb_release -a   # 确认 OS
free -h          # 内存
df -h            # 硬盘
nproc            # CPU 核心数
```

记录一下这些信息，后续部署卡住时可能是资源问题。

---

## 第三步：服务器安装 Node.js（通过 nvm）

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc

nvm install 20
nvm use 20
nvm alias default 20

node --version    # 应该输出 v20.x.x
npm --version
```

---

## 第四步：服务器安装 Nginx 和 Git

```bash
sudo apt update
sudo apt install -y nginx git

sudo systemctl status nginx
```

Mac 本地浏览器访问 `http://<公网IP>`，看到 Nginx 欢迎页就对了。

**看不到时**：腾讯云控制台 → 防火墙 → 检查 80 端口是否放行。

---

## 第五步：配置 SSH 密钥免密登录（强烈推荐）

**在 Mac 本地**新开一个终端标签（不要退出服务器的 SSH 会话）：

```bash
ls -la ~/.ssh

# 如果已有 id_ed25519.pub 或 id_rsa.pub，直接用
# 如果没有：
ssh-keygen -t ed25519 -C "your-email@example.com"

# Mac 特有的剪贴板命令
pbcopy < ~/.ssh/id_ed25519.pub
```

切回**服务器的 SSH 会话**：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "刚才复制的公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

验证：Mac 上新开终端 `ssh ubuntu@<公网IP>`，**不再要求输密码**就说明配好了。

---

## 第六步：让服务器有权访问你的 GitHub 私有仓库

在**服务器上**再生成一把 SSH key（专门用于 GitHub 授权，和你 Mac 上的分开管理）：

```bash
# 在服务器 SSH 会话里
ssh-keygen -t ed25519 -C "tencent-lighthouse-deploy"
# 一路回车用默认设置

# 显示公钥
cat ~/.ssh/id_ed25519.pub
```

复制输出的整段公钥。打开浏览器 → GitHub → 你的仓库 → **Settings → Deploy keys → Add deploy key**。

把公钥粘贴进去，给一个描述（比如 `Tencent Lighthouse`），**不用勾选** "Allow write access"（部署只需读权限）。

---

## 第七步：服务器 clone 项目并首次构建

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www

cd /var/www

# 用 git@ 协议 clone（这样走 SSH key，不需要输密码）
git clone git@github.com:<你的用户名>/ai-coding-for-beginners.git
cd ai-coding-for-beginners

npm ci
npm run build
```

---

## 第八步：配置 Nginx

```bash
sudo cp scripts/nginx-site.conf.example /etc/nginx/sites-available/ai-coding-for-beginners
sudo ln -s /etc/nginx/sites-available/ai-coding-for-beginners /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

sudo nginx -t                    # 测试配置
sudo systemctl reload nginx      # 生效
```

---

## 第九步：验证

Mac 浏览器打开 `http://<公网IP>`，看到教程网站首页就成了。

**排查清单（看不到时）**：

1. 腾讯云控制台防火墙 → 80 端口放行
2. `sudo systemctl status nginx` → 服务是否在跑
3. `ls -la /var/www/ai-coding-for-beginners/dist` → dist 目录是否存在
4. `sudo tail -f /var/log/nginx/ai-coding-beginners-error.log` → 实时错误日志

---

## 第十步：配置本地部署脚本

回到 **Mac 本地项目**：

```bash
cd ~/Projects/ai-coding-for-beginners
code scripts/deploy-remote.sh    # 或用你习惯的编辑器
```

修改顶部三个变量：

```bash
SERVER_IP="<你的公网IP>"
SERVER_USER="ubuntu"
PROJECT_PATH="/var/www/ai-coding-for-beginners"
```

保存后测试：

```bash
npm run deploy
```

这条命令会：本地 `git push` → ssh 到服务器 → `git pull` → `npm ci` → `npm run build`。几秒后公网就能看到新版本。

---

## 完成

从现在起你的日常工作流：

1. Mac mini 上写内容/改代码
2. `git add . && git commit -m "..."`
3. `npm run deploy`
4. 几秒后公网更新

恭喜，你已经完成了 80% "想学编程但还没开始" 的人一辈子都没做过的事 —— **拥有自己的服务器，并把代码部署到公网**。

---

## 给 Claude Code 的特别说明（如果用它执行上述步骤）

如果你让 Claude Code 帮你执行这份手册里的命令，在会话开始时告诉它：

> 这台 Mac mini 同时在运行 OpenClaw（我的本地 AI 服务器），请：
> 1. 不要停止任何我没明确提到的后台进程
> 2. 不要修改全局 Shell 配置（~/.zshrc）里原有的内容，追加配置时必须保留已有行
> 3. 本项目的环境变量放在项目本地的 .env.local，不要写入全局 export
> 4. 用到端口时先 `lsof -i:<port>` 确认不与已有服务冲突
