#!/bin/bash

# 颜值PK项目启动脚本

echo "🚀 欢迎使用颜值PK项目！"
echo "正在进行项目初始化..."

# 检查Node.js版本
echo "📋 检查环境..."
node_version=$(node -v 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ 未检测到Node.js，请先安装Node.js 16+"
    echo "💡 下载地址: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js版本: $node_version"

# 检查包管理器
if command -v yarn >/dev/null 2>&1; then
    PKG_MANAGER="yarn"
    echo "✅ 使用 Yarn 包管理器"
elif command -v npm >/dev/null 2>&1; then
    PKG_MANAGER="npm"
    echo "✅ 使用 npm 包管理器"
else
    echo "❌ 未找到包管理器"
    exit 1
fi

# 安装依赖
echo "📦 安装项目依赖..."
if [ "$PKG_MANAGER" = "yarn" ]; then
    yarn install
else
    npm install
fi

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"

# 检查端口占用
echo "🔍 检查端口占用..."
if lsof -i :5173 >/dev/null 2>&1; then
    echo "⚠️  端口 5173 已被占用，将使用其他端口"
fi

# 启动开发服务器
echo "🎉 项目初始化完成！"
echo "🌐 启动开发服务器..."

if [ "$PKG_MANAGER" = "yarn" ]; then
    yarn dev
else
    npm run dev
fi
