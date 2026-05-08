// ==UserScript==
// @name         GitHub 中文化插件 (优化版)
// @namespace    https://github.com/godzilla818/-GitHub-
// @description  中文化 GitHub 界面的菜单、按钮及常见文本
// @copyright    godzilla818
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @version      1.2
// @author       godzilla818
// @license      GPL-3.0
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @match        https://skills.github.com/*
// @match        https://www.githubstatus.com/*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        window.onurlchange
// @grant        GM_xmlhttpRequest
// @connect      tmt.tencentcloudapi.com
// ==/UserScript==

(function () {
    'use strict';

    // ========== 内置翻译词库 ==========
    const dict = {
        // 通用导航与操作
        "Sign in": "登录",
        "Sign up": "注册",
        "Dashboard": "仪表板",
        "Repositories": "仓库",
        "Stars": "星标",
        "Explore": "探索",
        "Issues": "问题",
        "Pull requests": "拉取请求",
        "Projects": "项目",
        "Wiki": "维基",
        "Insights": "洞察",
        "Settings": "设置",
        "Notifications": "通知",
        "New repository": "新建仓库",
        "Import repository": "导入仓库",
        "New gist": "新建代码片段",
        "New organization": "新建组织",
        "Your profile": "你的个人资料",
        "Your repositories": "你的仓库",
        "Your stars": "你的星标",
        "Your gists": "你的代码片段",
        "Your organizations": "你的组织",
        "Your projects": "你的项目",
        "Your codespaces": "你的代码空间",
        "Create new...": "新建...",
        "Create a new repository": "创建新仓库",
        "Create organization": "创建组织",
        "Signed in as": "已登录为",
        "Sign out": "退出登录",
        "Log out": "退出登录",
        "Search or jump to...": "搜索或跳转...",
        "Type / to search": "输入 / 搜索",
        "Search": "搜索",
        "Filter": "筛选",
        "Sort": "排序",
        "Copy": "复制",
        "Download": "下载",
        "Report": "举报",
        "Close": "关闭",
        "Open": "打开",
        "Merged": "已合并",
        "Closed": "已关闭",
        "Reopened": "已重新打开",
        "Labels": "标签",
        "Milestones": "里程碑",
        "Teams": "团队",
        "Security": "安全",
        "Branches": "分支",
        "Releases": "发布",
        "Contributors": "贡献者",
        "Community": "社区",
        "Pricing": "定价",
        "Documentation": "文档",
        "API": "API",
        "Contact GitHub": "联系GitHub",
        "Status": "状态",
        "Blog": "博客",
        "About": "关于",
        "Terms": "条款",
        "Privacy": "隐私",
        "Site map": "网站地图",
        "Help": "帮助",
        "Edit": "编辑",
        "Delete": "删除",
        "View": "查看",
        "Create": "创建",
        "Fork": "复刻",
        "Star": "星标",
        "Unstar": "取消星标",
        "Watch": "关注",
        "Unwatch": "取消关注",
        "Save": "保存",
        "Cancel": "取消",
        "OK": "确定",
        "Loading...": "加载中...",
        "Something went wrong": "出错了",
        // 仓库页常用
        "Code": "代码",
        "main": "主分支",
        "Updated on":"更新于",
        "master": "主分支",
        "Go to file": "转到文件",
        "Add file": "添加文件",
        "Repositories": "仓库",
        "Issues": "议题",
        "Pull requests": "拉取请求",
        "Discussions": "讨论",
        "Users": "用户",
        "Commits": "提交",
        "Packages": "包",
        "Wikis": "维基",
        "Topics": "主题",
        "Advanced": "高级",
        "Owner": "所有者",
        "Size": "大小",
        "Number of followers": "关注者数量",
        "Number of forks": "复刻数量",
        "Number of stars": "星标数量",
        "Date created": "创建日期",
        "Date pushed": "推送日期",
        "Topic": "主题",
        "License": "许可证",
        "Archived": "已归档",
        "Public": "公开",
        "Private": "私有",
        "Updated": "更新于",
        "Advanced search": "高级搜索",
        "Marketplace": "市场",
        "Clone": "克隆",
        "HTTPS": "HTTPS",
        "SSH": "SSH",
        "GitHub CLI": "GitHub CLI",
        "Download ZIP": "下载 ZIP",
        "Open with GitHub Desktop": "用 GitHub Desktop 打开",
        "About": "关于",
        "No description, website, or topics provided.": "未提供描述、网站或主题。",
        "Readme": "自述文件",
        "License": "许可证",
    };

    // 正则替换规则（用于处理动态文本，如时间）
    const regexRules = [
        // 相对时间
        [/(\d+)\s+seconds?\s+ago/, "$1秒前"],
        [/(\d+)\s+minutes?\s+ago/, "$1分钟前"],
        [/(\d+)\s+hours?\s+ago/, "$1小时前"],
        [/(\d+)\s+days?\s+ago/, "$1天前"],
        [/(\d+)\s+weeks?\s+ago/, "$1周前"],
        [/(\d+)\s+months?\s+ago/, "$1个月前"],
        [/(\d+)\s+years?\s+ago/, "$1年前"],
        [/(\d+)\s+seconds?/, "$1秒"],
        [/(\d+)\s+minutes?/, "$1分钟"],
        [/(\d+)\s+hours?/, "$1小时"],
        [/(\d+)\s+days?/, "$1天"],
        [/(\d+)\s+weeks?/, "$1周"],
        [/(\d+)\s+months?/, "$1个月"],
        [/(\d+)\s+years?/, "$1年"],
        // 计数文本
        [/(\d+)\s+commits?/, "$1 次提交"],
        [/(\d+)\s+branches?/, "$1 个分支"],
        [/(\d+)\s+tags?/, "$1 个标签"],
        [/(\d+)\s+releases?/, "$1 个发布"],
        [/(\d+)\s+contributors?/, "$1 位贡献者"],
    ];

    // 是否启用正则替换（默认开启）
    let enableRegex = GM_getValue('enableRegex', true);

    // ========== 腾讯云翻译API配置 ==========
    const TENCENT_CONFIG = {
        secretId: GM_getValue('tencentSecretId', ''),
        secretKey: GM_getValue('tencentSecretKey', ''),
        region: 'ap-beijing',
        projectId: 0,
        enable: GM_getValue('tencentEnable', true)       // 是否启用API翻译
    };

    // 翻译缓存
    const translationCache = new Map();
    const CACHE_MAX_SIZE = 500;

    // 字符统计
    const CHAR_LIMIT = 50000;
    let totalCharCount = GM_getValue('totalCharCount', 0);  // 历史总累计（持久化）
    let sessionCharCount = 0;  // 本次会话累计（刷新后重置）

    // API调用频率限制（每秒最多5次）
    const RATE_LIMIT = {
        maxRequests: 5,        // 每秒最大请求数
        windowMs: 1000,        // 时间窗口（毫秒）
        timestamps: []         // 请求时间戳队列
    };

    // 批量翻译队列配置
    const BATCH_CONFIG = {
        maxBatchSize: 20,      // 每批最多翻译20个文本
        maxBatchDelay: 100,    // 批次最大延迟（毫秒）
        queue: [],             // 待翻译队列
        timer: null            // 批处理定时器
    };

    /**
     * 延迟执行函数
     */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 清理过期的请求时间戳
     */
    function cleanExpiredTimestamps() {
        const now = Date.now();
        const cutoff = now - RATE_LIMIT.windowMs;
        RATE_LIMIT.timestamps = RATE_LIMIT.timestamps.filter(ts => ts > cutoff);
    }

    /**
     * 等待API调用频率限制
     */
    async function waitForRateLimit() {
        cleanExpiredTimestamps();
        
        // 如果当前窗口内请求数已达上限，需要等待
        if (RATE_LIMIT.timestamps.length >= RATE_LIMIT.maxRequests) {
            // 计算需要等待的时间（等待最早的请求过期）
            const oldestTimestamp = RATE_LIMIT.timestamps[0];
            const waitTime = oldestTimestamp + RATE_LIMIT.windowMs - Date.now();
            
            if (waitTime > 0) {
                await delay(waitTime);
            }
            
            // 重新清理过期时间戳
            cleanExpiredTimestamps();
        }
        
        // 记录本次请求时间
        RATE_LIMIT.timestamps.push(Date.now());
    }

    /**
     * 检查字符限制并提示用户
     */
    function checkCharLimit(newCharCount) {
        if (totalCharCount + newCharCount >= CHAR_LIMIT && totalCharCount < CHAR_LIMIT) {
            const continueTrans = confirm(
                `历史总累计: ${totalCharCount.toLocaleString()} 字符\n` +
                `本次会话: ${sessionCharCount.toLocaleString()} 字符\n` +
                `即将达到限制: ${CHAR_LIMIT.toLocaleString()} 字符\n\n` +
                `是否继续使用腾讯云翻译？\n\n` +
                `点击"确定"继续翻译\n` +
                `点击"取消"停止翻译`
            );
            
            if (!continueTrans) {
                TENCENT_CONFIG.enable = false;
                return false;
            }
        }
        return true;
    }

    /**
     * 生成腾讯云API签名
     */
    async function generateSignature(secretKey, payload, timestamp) {
        const action = 'TextTranslate';
        const version = '2018-03-21';
        const algorithm = 'TC3-HMAC-SHA256';
        
        const date = new Date(timestamp * 1000).toISOString().split('T')[0];
        
        const httpRequestMethod = 'POST';
        const canonicalUri = '/';
        const canonicalQueryString = '';
        const canonicalHeaders = `content-type:application/json\nhost:tmt.tencentcloudapi.com\n`;
        const signedHeaders = 'content-type;host';
        
        const hashedRequestPayload = await sha256(JSON.stringify(payload));
        const canonicalRequest = `${httpRequestMethod}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${hashedRequestPayload}`;
        
        const credentialScope = `${date}/tmt/tc3_request`;
        const hashedCanonicalRequest = await sha256(canonicalRequest);
        const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${hashedCanonicalRequest}`;
        
        const secretDate = await hmacSha256(`TC3${secretKey}`, date);
        const secretService = await hmacSha256(secretDate, 'tmt');
        const secretSigning = await hmacSha256(secretService, 'tc3_request');
        const signature = await hmacSha256Hex(secretSigning, stringToSign);
        
        const authorization = `${algorithm} Credential=${TENCENT_CONFIG.secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
        
        return authorization;
    }

    /**
     * SHA256哈希 (Web Crypto API)
     */
    async function sha256(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * HMAC-SHA256 (Web Crypto API)
     */
    async function hmacSha256(key, str) {
        const encoder = new TextEncoder();
        const keyData = typeof key === 'string' ? encoder.encode(key) : key;
        const msgData = encoder.encode(str);
        
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
        return new Uint8Array(signature);
    }

    async function hmacSha256Hex(key, str) {
        const result = await hmacSha256(key, str);
        return Array.from(result).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * 调用腾讯云批量翻译API
     */
    async function translateBatchByAPI(textArray) {
        if (!TENCENT_CONFIG.enable || !TENCENT_CONFIG.secretId || !TENCENT_CONFIG.secretKey) {
            return textArray.map(() => false);
        }

        // 检查缓存,过滤已缓存的文本
        const results = new Array(textArray.length);
        const uncachedIndices = [];
        const uncachedTexts = [];
        
        textArray.forEach((text, index) => {
            if (translationCache.has(text)) {
                results[index] = translationCache.get(text);
            } else {
                uncachedIndices.push(index);
                uncachedTexts.push(text);
            }
        });

        // 如果所有文本都已缓存,直接返回
        if (uncachedTexts.length === 0) {
            return results;
        }

        // 检查字符限制
        const batchCharCount = uncachedTexts.reduce((sum, text) => sum + text.length, 0);
        if (!checkCharLimit(batchCharCount)) {
            return textArray.map(() => false);
        }

        // 等待API调用频率限制
        await waitForRateLimit();

        const payload = {
            SourceText: uncachedTexts.join('\n'),
            Source: 'en',
            Target: 'zh',
            ProjectId: TENCENT_CONFIG.projectId
        };

        const timestamp = Math.floor(Date.now() / 1000);
        const authorization = await generateSignature(TENCENT_CONFIG.secretKey, payload, timestamp);

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://tmt.tencentcloudapi.com',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authorization,
                    'X-TC-Action': 'TextTranslate',
                    'X-TC-Version': '2018-03-21',
                    'X-TC-Timestamp': timestamp.toString(),
                    'X-TC-Region': TENCENT_CONFIG.region
                },
                data: JSON.stringify(payload),
                onload: (response) => {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.Response && result.Response.TargetText) {
                            const translatedTexts = result.Response.TargetText.split('\n');
                            
                            // 累计字符数（总累计和本次会话）
                            totalCharCount += batchCharCount;
                            sessionCharCount += batchCharCount;
                            GM_setValue('totalCharCount', totalCharCount);
                            
                            // 添加到缓存并填充结果
                            uncachedIndices.forEach((originalIndex, i) => {
                                const translated = translatedTexts[i] || false;
                                if (translated) {
                                    if (translationCache.size >= CACHE_MAX_SIZE) {
                                        const firstKey = translationCache.keys().next().value;
                                        translationCache.delete(firstKey);
                                    }
                                    translationCache.set(uncachedTexts[i], translated);
                                }
                                results[originalIndex] = translated;
                            });
                            
                            resolve(results);
                        } else {
                            console.error('翻译API错误:', result);
                            resolve(textArray.map(() => false));
                        }
                    } catch (e) {
                        console.error('解析翻译结果失败:', e);
                        resolve(textArray.map(() => false));
                    }
                },
                onerror: (error) => {
                    console.error('翻译API请求失败:', error);
                    resolve(textArray.map(() => false));
                }
            });
        });
    }

    /**
     * 将翻译任务加入队列
     */
    function enqueueTranslateTask(text) {
        return new Promise((resolve) => {
            BATCH_CONFIG.queue.push({ text, resolve });
            
            // 如果队列达到批次大小,立即处理
            if (BATCH_CONFIG.queue.length >= BATCH_CONFIG.maxBatchSize) {
                processBatchQueue();
            } else if (!BATCH_CONFIG.timer) {
                // 否则设置定时器延迟处理
                BATCH_CONFIG.timer = setTimeout(processBatchQueue, BATCH_CONFIG.maxBatchDelay);
            }
        });
    }

    /**
     * 处理批量翻译队列
     */
    async function processBatchQueue() {
        if (BATCH_CONFIG.timer) {
            clearTimeout(BATCH_CONFIG.timer);
            BATCH_CONFIG.timer = null;
        }

        if (BATCH_CONFIG.queue.length === 0) {
            return;
        }

        const batch = BATCH_CONFIG.queue.splice(0, BATCH_CONFIG.maxBatchSize);
        const texts = batch.map(item => item.text);
        
        try {
            const results = await translateBatchByAPI(texts);
            batch.forEach((item, index) => {
                item.resolve(results[index]);
            });
        } catch (error) {
            console.error('批量翻译失败:', error);
            batch.forEach(item => item.resolve(false));
        }
    }

    /**
     * 调用腾讯云翻译API（单个文本,使用队列）
     */
    async function translateByAPI(text) {
        return await enqueueTranslateTask(text);
    }

    /**
     * 翻译文本内容
     * @param {string} text 原始文本
     * @returns {string|false|Promise<string|false>} 翻译后的文本或false
     */
    async function translateText(text) {
        if (!text || !/[a-zA-Z]/.test(text)) return false;
        let key = text.trim();
        if (!key) return false;

        // 1. 查静态词典
        if (dict.hasOwnProperty(key)) {
            return text.replace(key, dict[key]);
        }

        // 2. 尝试去除多余空格后匹配
        const normalized = key.replace(/\s+/g, ' ');
        if (dict.hasOwnProperty(normalized)) {
            return text.replace(key, dict[normalized]);
        }

        // 3. 正则替换（需开启）
        if (enableRegex) {
            for (const [pattern, replacement] of regexRules) {
                const result = key.replace(pattern, replacement);
                if (result !== key) {
                    return text.replace(key, result);
                }
            }
        }

        // 4. 调用腾讯云API翻译
        const translated = await translateByAPI(key);
        if (translated) {
            return text.replace(key, translated);
        }

        return false;
    }

    /**
     * 翻译元素中的文本节点（处理<span>Hello</span>这类）
     * @param {Element} element 
     */
    async function translateElementTextNodes(element) {
        // 跳过脚本、样式、代码块、已处理的标记
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE' || element.tagName === 'CODE' || element.tagName === 'PRE') return;
        if (element.hasAttribute && element.hasAttribute('data-i18n-done')) return;

        // 处理元素本身的文本内容（如果只有文本子节点）
        if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
            const textNode = element.childNodes[0];
            const translated = await translateText(textNode.textContent);
            if (translated) {
                textNode.textContent = translated;
                element.setAttribute('data-i18n-done', 'true');
            }
        } else {
            // 递归处理子节点
            for (const child of element.childNodes) {
                if (child.nodeType === Node.TEXT_NODE) {
                    const translated = await translateText(child.textContent);
                    if (translated) {
                        child.textContent = translated;
                    }
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    await translateElementTextNodes(child);
                }
            }
        }
        element.setAttribute('data-i18n-done', 'true');
    }

    /**
     * 翻译属性值（placeholder, title, aria-label等）
     * @param {Element} element 
     */
    async function translateAttributes(element) {
        const attrs = ['placeholder', 'title', 'aria-label', 'data-confirm'];
        for (const attr of attrs) {
            if (element.hasAttribute(attr)) {
                const value = element.getAttribute(attr);
                const translated = await translateText(value);
                if (translated) {
                    element.setAttribute(attr, translated);
                }
            }
        }
    }

    /**
     * 翻译整个文档中可见的元素
     */
    async function translateDocument(root = document) {
        // 处理标题
        const titleTranslated = await translateText(document.title);
        if (titleTranslated) document.title = titleTranslated;

        // 选择所有可能包含文本的元素（排除已处理的）
        const elements = root.querySelectorAll(
            'a, button, span, label, th, td, h1, h2, h3, h4, h5, h6, p, summary, .btn, .Header-link, .dropdown-item, [role="menuitem"], .ActionList-item-label, .Truncate-text'
        );
        
        // 并行处理所有元素
        const elementPromises = Array.from(elements).map(async (el) => {
            await translateAttributes(el);
            await translateElementTextNodes(el);
        });
        await Promise.all(elementPromises);

        // 处理输入框和文本域的占位符
        const inputs = root.querySelectorAll('input[placeholder], textarea[placeholder]');
        const inputPromises = Array.from(inputs).map(async (input) => {
            await translateAttributes(input);
        });
        await Promise.all(inputPromises);
    }

    // 页面变化观察器（处理GitHub的SPA导航）
    let observer = null;
    function startObserver() {
        if (observer) observer.disconnect();
        observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === 'childList' && m.addedNodes.length > 0) {
                    for (const node of m.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 新加入的元素需要递归翻译
                            translateDocument(node);
                        }
                    }
                }
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 注册菜单命令（开启/关闭正则翻译）
    function registerMenu() {
        // 正则翻译开关
        const toggleRegex = () => {
            enableRegex = !enableRegex;
            GM_setValue('enableRegex', enableRegex);
            GM_notification({
                text: `正则翻译已${enableRegex ? '开启' : '关闭'}`,
                timeout: 2000
            });
            location.reload();
        };
        GM_registerMenuCommand(`${enableRegex ? '关闭' : '开启'}正则翻译`, toggleRegex);

        // 设置密钥
        const showSettingsPanel = () => {
            // 创建设置面板
            const panel = document.createElement('div');
            panel.id = 'github-i18n-settings';
            panel.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #fff;
                border: 1px solid #d1d5da;
                border-radius: 6px;
                box-shadow: 0 8px 24px rgba(149, 157, 165, 0.2);
                padding: 24px;
                z-index: 10000;
                width: 400px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            `;

            panel.innerHTML = `
                <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">腾讯云翻译设置</h3>
                <div style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
                    <label style="font-size: 14px; font-weight: 600;">启用腾讯云翻译</label>
                    <div style="position: relative; display: inline-block; width: 50px; height: 26px; cursor: pointer;">
                        <input type="checkbox" id="tencent-enable" ${TENCENT_CONFIG.enable ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                        <span id="toggle-bg" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: ${TENCENT_CONFIG.enable ? '#2ea44f' : '#ccc'}; transition: .4s; border-radius: 26px; pointer-events: auto;"></span>
                        <span id="toggle-slider" style="position: absolute; height: 20px; width: 20px; left: ${TENCENT_CONFIG.enable ? '26px' : '4px'}; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; pointer-events: auto;"></span>
                    </div>
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 600;">SecretId</label>
                    <input type="text" id="tencent-secret-id" placeholder="请输入 SecretId" 
                           value="${TENCENT_CONFIG.secretId}"
                           style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5da; border-radius: 4px; font-size: 14px; box-sizing: border-box;">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 600;">SecretKey</label>
                    <input type="password" id="tencent-secret-key" placeholder="请输入 SecretKey" 
                           value="${TENCENT_CONFIG.secretKey}"
                           style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5da; border-radius: 4px; font-size: 14px; box-sizing: border-box;">
                </div>
                <div style="margin-bottom: 16px; padding: 12px; background: #f6f8fa; border-radius: 4px; font-size: 12px; color: #586069;">
                    <div style="margin-bottom: 4px;">📊 历史总累计: <span id="total-count-display">${totalCharCount.toLocaleString()}</span> 字符</div>
                    <div style="margin-bottom: 4px;">📝 本次会话: <span id="session-count-display">${sessionCharCount.toLocaleString()}</span> / ${CHAR_LIMIT.toLocaleString()} 字符</div>
                    <div style="margin-bottom: 4px;">⚡ API频率限制: ${RATE_LIMIT.maxRequests}次/秒</div>
                    <div style="margin-bottom: 8px;">📦 批量翻译: 每批最多${BATCH_CONFIG.maxBatchSize}个文本</div>
                    <button id="reset-stats-btn" style="width: 100%; padding: 6px 12px; border: 1px solid #d73a49; border-radius: 4px; background: #fff; color: #d73a49; cursor: pointer; font-size: 12px; margin-top: 4px;">🔄 重置历史统计</button>
                </div>
                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button id="cancel-btn" style="padding: 8px 16px; border: 1px solid #d1d5da; border-radius: 4px; background: #f6f8fa; cursor: pointer; font-size: 14px;">取消</button>
                    <button id="save-btn" style="padding: 8px 16px; border: none; border-radius: 4px; background: #2ea44f; color: #fff; cursor: pointer; font-size: 14px;">保存</button>
                </div>
            `;

            // 遮罩层
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9999;
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(panel);

            // 开关交互
            const enableCheckbox = document.getElementById('tencent-enable');
            const toggleBg = document.getElementById('toggle-bg');
            const toggleSlider = document.getElementById('toggle-slider');
            
            const toggleSwitch = () => {
                enableCheckbox.checked = !enableCheckbox.checked;
                toggleBg.style.backgroundColor = enableCheckbox.checked ? '#2ea44f' : '#ccc';
                toggleSlider.style.left = enableCheckbox.checked ? '26px' : '4px';
            };
            
            toggleBg.addEventListener('click', toggleSwitch);
            toggleSlider.addEventListener('click', toggleSwitch);

            // 取消按钮
            document.getElementById('cancel-btn').addEventListener('click', () => {
                document.body.removeChild(panel);
                document.body.removeChild(overlay);
            });

            // 保存按钮
            document.getElementById('save-btn').addEventListener('click', () => {
                const enable = document.getElementById('tencent-enable').checked;
                const secretId = document.getElementById('tencent-secret-id').value.trim();
                const secretKey = document.getElementById('tencent-secret-key').value.trim();

                GM_setValue('tencentEnable', enable);
                GM_setValue('tencentSecretId', secretId);
                GM_setValue('tencentSecretKey', secretKey);

                TENCENT_CONFIG.enable = enable;
                TENCENT_CONFIG.secretId = secretId;
                TENCENT_CONFIG.secretKey = secretKey;

                document.body.removeChild(panel);
                document.body.removeChild(overlay);

                GM_notification({
                    text: '设置已保存',
                    timeout: 2000
                });
                
                location.reload();
            });

            // 重置统计按钮
            document.getElementById('reset-stats-btn').addEventListener('click', () => {
                const confirmReset = confirm('确定要重置历史统计吗？\n\n这将清空所有历史累计数据，但不会影响本次会话数据。');
                
                if (confirmReset) {
                    totalCharCount = 0;
                    GM_setValue('totalCharCount', 0);
                    
                    // 更新显示
                    document.getElementById('total-count-display').textContent = '0';
                    
                    GM_notification({
                        text: '历史统计已重置',
                        timeout: 2000
                    });
                }
            });

            // 点击遮罩关闭
            overlay.addEventListener('click', () => {
                document.body.removeChild(panel);
                document.body.removeChild(overlay);
            });
        };
        GM_registerMenuCommand('⚙️ 设置翻译密钥', showSettingsPanel);
    }

    // 初始化
    function init() {
        translateDocument();
        startObserver();
        if (typeof GM_registerMenuCommand !== 'undefined') {
            registerMenu();
        }
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听 URL 变化（Tampermonkey 唯一支持的特性）
    if (typeof window.onurlchange === 'function') {
        window.addEventListener('urlchange', () => {
            // 等待新页面渲染
            setTimeout(init, 500);
        });
    }
})();
