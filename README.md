# GitHub 中文化插件（优化版）

> 让 GitHub 界面全面中文化 | 基于社区词库优化，支持静态匹配与云端翻译

[![许可证：GPT v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![版本](https://img.shields.io/badge/version-3.1-brightgreen)]()
[![篡改猴子](https://img.shields.io/badge/Tampermonkey-guard-red)]()
[![暴力猴子](https://img.shields.io/badge/Violentmonkey-guard-orange)]()

## 🌟 功能特性

- **全面中文化**：覆盖菜单栏、标题、按钮、标签、提示等界面元素
- **智能正则匹配**：自动翻译相对时间（如 "3 minutes ago" → "3分钟前"）、计数统计等动态内容
- **可以选择的快讯翻译 API**：对词典未覆盖的文本调用腾讯云机器翻译，实现几乎 100% 的界面中文化
- **完善的并发控制**：内置请求队列与最小间隔限制，安全使用 API 而不触发频率限制
- **SPA 导航支持**：监听 GitHub 单页应用路由变化，新页面自动翻译
- **安全可配置**：API 密钥由用户自行填入，不硬编码，且支持油猴菜单可视化设置

## 📸 效果预览


| 原版 | 汉化后 |
|------|--------|
| ![原版](preview/before.png) | ![汉化](preview/after.png) |

## 🛠️ 安装指南

### 1. 安装用户脚本管理器
- **篡改猴子**（推荐）：[Chrome 版本](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) | [Firefox 版本](https://addons.mozilla.org/firefox/addon/tampermonkey/)
- **暴力猴子**：[Chrome](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag) | [Firefox](https://addons.mozilla.org/firefox/addon/violentmonkey/)

### 2. 安装脚本
- **从 GreasyFork 安装（稳定版）**：  
 [点击前往](https://update.greasyfork.org/scripts/577150/GitHub%20%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6%20%28%E4%BC%98%E5%8C%96%E7%89%88%29.user.js)

### 3.配置快速通讯翻译 API（可以选择，但推荐）
1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/cam/capi)，创建 API 密钥（SecretId + SecretKey）
2. 在已安装的脚本管理器菜单中，点击 **⚙️ 设置翻译密钥**
3. 填入你的 SecretId 和 SecretKey，保存即可

> 即使不配置 API，脚本仍能通过内置词库和正则翻译绝大多数界面元素。

## 💡 使用说明

- 安装后刷新 GitHub 页面即可自动启用
- 可通过油猴菜单 **开关正则翻译**（部分动态文本可能受正则影响）
- 在设置面板可随时修改 API 密钥、查看已翻译字符统计

