# -----------------------------
# LiveScores 全栈部署镜像
# -----------------------------

# 基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 拷贝 package.json 并安装依赖
COPY package*.json ./
RUN npm install

# 拷贝所有项目文件
COPY . .

# 构建前端（Vite）
RUN npm run deploy:build

# 暴露端口（Render 自动传入 PORT 环境变量）
EXPOSE 9000

# 启动 Express 服务器
CMD ["npm", "start"]
