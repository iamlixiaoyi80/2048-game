# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases  
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

### Browser
- **clawd** → `profile=clawd`, 默认浏览器配置，用于日常浏览和自动化任务
- **默认搜索引擎：** 百度 (www.baidu.cn) — 所有浏览器搜索任务都使用百度

- **启动流程：**
  1. 先执行 `moltbot gateway start` 确保 gateway 服务运行
  2. 使用 `browser action=start profile=clawd` 启动浏览器

### 联网搜索策略
- **搜索策略：**
  - ⚠️ **重要约定：以后所有网络搜索任务都必须使用 web-search-zai（智谱API）**
  - **默认使用智谱 Web Search API** 进行网页检索（web-search-zai skill）
  - API Key 位置：`/home/wuying/.clawdbot/moltbot.json` → `models.providers.any.apiKey`
  - ### Web Search (web-search-zai)

    **位置：** `/home/wuying/clawd/skills/web-search-zai/search.sh`

    **调用方式：**
    ```bash
    # 基本搜索（默认 10 条结果）
    cd /home/wuying/clawd/skills/web-search-zai && bash search.sh "查询词"

    # 指定结果数量
    bash search.sh "查询词" 5

    # 完整参数（查询词 数量 内容大小 时间过滤）
    bash search.sh "查询词" 10 "medium" "week"
    ```
---


Add whatever helps you do your job. This is your cheat sheet.
