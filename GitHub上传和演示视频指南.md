# GitHub 上传和演示视频制作指南

## 一、GitHub 上传步骤

### 步骤1：创建 GitHub 仓库

1. **登录 GitHub**
   - 访问 https://github.com
   - 登录你的账号

2. **创建新仓库**
   - 点击右上角的 "+" 号
   - 选择 "New repository"
   - 填写仓库信息：
     - Repository name: `coco-poker`（或你喜欢的名称）
     - Description: `Cocos Creator 纸牌消除游戏`
     - 选择 Public（公开）或 Private（私有）
     - **不要**勾选 "Initialize this repository with a README"（因为本地已有代码）
   - 点击 "Create repository"

### 步骤2：初始化本地 Git 仓库

1. **打开终端/命令行**
   - Windows: 打开 PowerShell 或 CMD
   - Mac/Linux: 打开 Terminal

2. **进入项目目录**
   ```bash
   cd D:\coco_poker
   ```

3. **初始化 Git 仓库**
   ```bash
   git init
   ```

4. **添加远程仓库**
   ```bash
   git remote add origin https://github.com/你的用户名/coco-poker.git
   ```
   > 注意：将 `你的用户名` 替换为你的 GitHub 用户名

### 步骤3：配置 Git（如果还没配置）

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

### 步骤4：添加文件并提交

1. **查看文件状态**
   ```bash
   git status
   ```

2. **添加所有文件**
   ```bash
   git add .
   ```

3. **提交代码**
   ```bash
   git commit -m "初始提交：Cocos Creator 纸牌消除游戏"
   ```

### 步骤5：推送到 GitHub

1. **推送到主分支**
   ```bash
   git branch -M main
   git push -u origin main
   ```

2. **输入认证信息**
   - 如果提示输入用户名和密码，使用你的 GitHub 用户名和 Personal Access Token
   - 如果使用 SSH，需要先配置 SSH 密钥

### 步骤6：验证上传

1. **刷新 GitHub 页面**
   - 访问你的仓库页面
   - 应该能看到所有文件

2. **检查文件完整性**
   - 确认所有代码文件都已上传
   - 确认 README.md 等文档文件已上传

## 二、GitHub 仓库优化

### 添加 .gitignore

项目已包含 `.gitignore` 文件，确保以下内容被忽略：

```
library/
local/
temp/
settings/
build/
node_modules/
```

### 完善 README.md

1. **添加项目截图**
   - 在 README.md 中添加游戏截图
   - 使用 Markdown 语法：
     ```markdown
     ![游戏截图](screenshots/gameplay.png)
     ```

2. **添加功能列表**
   - 列出主要功能
   - 添加技术栈说明

3. **添加使用说明**
   - 如何运行项目
   - 如何配置环境

### 添加 LICENSE

1. **选择许可证**
   - MIT License（推荐，简单宽松）
   - 或其他适合的许可证

2. **创建 LICENSE 文件**
   - 在 GitHub 仓库页面点击 "Add file" -> "Create new file"
   - 文件名输入 `LICENSE`
   - GitHub 会自动提示选择许可证模板

## 三、演示视频制作步骤

### 方法1：使用 Windows 内置工具（推荐）

#### 步骤1：打开 Xbox Game Bar

1. **启动录制**
   - 按 `Win + G` 打开 Xbox Game Bar
   - 如果没有，可以在 Microsoft Store 搜索 "Xbox Game Bar" 安装

2. **开始录制**
   - 点击录制按钮（或按 `Win + Alt + R`）
   - 开始操作游戏

3. **停止录制**
   - 再次按 `Win + Alt + R` 停止录制
   - 视频会自动保存到 `C:\Users\你的用户名\Videos\Captures\`

#### 步骤2：编辑视频（可选）

1. **使用 Windows 视频编辑器**
   - 打开 "视频编辑器" 应用
   - 导入录制的视频
   - 可以添加标题、音乐、转场效果等

2. **或使用其他工具**
   - OBS Studio（免费，功能强大）
   - 剪映（简单易用）
   - Adobe Premiere（专业）

### 方法2：使用 OBS Studio（专业推荐）

#### 步骤1：下载安装 OBS

1. **下载 OBS Studio**
   - 访问 https://obsproject.com/
   - 下载 Windows 版本
   - 安装软件

#### 步骤2：配置 OBS

1. **添加显示器捕获**
   - 打开 OBS
   - 点击 "来源" 区域的 "+"
   - 选择 "显示器采集"
   - 选择要录制的显示器

2. **设置录制参数**
   - 点击 "设置" -> "输出"
   - 选择输出模式：简单
   - 设置视频比特率：2500 Kbps（可根据需要调整）
   - 设置音频比特率：160

3. **设置视频参数**
   - 点击 "设置" -> "视频"
   - 设置基础分辨率：1920x1080（或你的屏幕分辨率）
   - 设置输出分辨率：1920x1080
   - 设置帧率：60 FPS

#### 步骤3：开始录制

1. **启动游戏**
   - 在 Cocos Creator 中运行游戏
   - 或构建后运行

2. **开始录制**
   - 在 OBS 中点击 "开始录制"
   - 或按快捷键（默认 Ctrl+R）

3. **演示游戏功能**
   - 展示游戏界面
   - 演示卡牌匹配功能
   - 演示翻牌功能
   - 演示回退功能
   - 展示游戏胜利场景

4. **停止录制**
   - 点击 "停止录制"
   - 视频保存在设置的输出路径（默认在视频文件夹）

### 方法3：使用手机录制（简单快速）

1. **使用手机拍摄**
   - 将手机固定在支架上
   - 对准电脑屏幕
   - 开始录制

2. **注意事项**
   - 确保光线充足
   - 避免反光
   - 保持稳定

## 四、视频内容建议

### 视频时长
- 建议 2-5 分钟
- 不要太长，保持简洁

### 视频结构

1. **开场（10秒）**
   - 显示游戏标题
   - 或直接进入游戏界面

2. **游戏介绍（20秒）**
   - 简要说明游戏规则
   - 展示游戏界面布局

3. **功能演示（2-3分钟）**
   - **卡牌匹配**（30秒）
     - 点击主牌区的牌
     - 展示匹配动画
     - 说明匹配规则
   
   - **翻牌功能**（30秒）
     - 展示无牌可匹配的情况
     - 点击备用牌堆翻牌
     - 展示翻牌动画
   
   - **回退功能**（30秒）
     - 执行几个操作
     - 点击回退按钮
     - 展示回退动画
     - 连续回退多次
   
   - **游戏胜利**（20秒）
     - 快速演示完整游戏流程
     - 展示胜利界面

4. **结尾（10秒）**
   - 显示项目信息
   - GitHub 链接
   - 或简单的结束语

### 视频优化建议

1. **添加字幕**
   - 说明关键操作
   - 解释游戏规则

2. **添加背景音乐**
   - 选择轻松的背景音乐
   - 注意音量不要太大

3. **添加标注**
   - 在关键位置添加箭头或高亮
   - 标注按钮和操作区域

## 五、上传视频到 GitHub

### 方法1：使用 GitHub Releases

1. **创建 Release**
   - 在 GitHub 仓库页面
   - 点击 "Releases" -> "Create a new release"
   - 填写版本号：v1.0.0
   - 填写标题和描述

2. **上传视频**
   - 将视频文件拖拽到 "Attach binaries" 区域
   - 或点击 "Choose your files"
   - 选择视频文件（建议使用 MP4 格式）

3. **发布 Release**
   - 点击 "Publish release"
   - 视频会作为 Release 附件

### 方法2：使用 GitHub Pages

1. **启用 GitHub Pages**
   - 在仓库设置中
   - 找到 "Pages" 选项
   - 选择分支和文件夹
   - 保存

2. **创建演示页面**
   - 创建 `docs/index.html`
   - 嵌入视频：
     ```html
     <video controls width="800">
       <source src="../demo.mp4" type="video/mp4">
     </video>
     ```

3. **访问页面**
   - 访问 `https://你的用户名.github.io/coco-poker/`

### 方法3：使用 README.md 嵌入

1. **上传视频到其他平台**
   - YouTube（推荐，支持嵌入）
   - Bilibili（国内推荐）
   - 或其他视频平台

2. **在 README.md 中添加链接**
   ```markdown
   ## 演示视频
   
   [点击观看演示视频](https://www.youtube.com/watch?v=视频ID)
   ```

3. **或使用 HTML 嵌入**
   ```html
   <video width="800" controls>
     <source src="demo.mp4" type="video/mp4">
     您的浏览器不支持视频标签。
   </video>
   ```

## 六、视频文件优化

### 压缩视频

1. **使用 HandBrake（免费）**
   - 下载安装 HandBrake
   - 导入视频
   - 选择预设：Fast 1080p30
   - 开始编码

2. **使用在线工具**
   - CloudConvert
   - FreeConvert
   - 或其他在线压缩工具

### 视频格式建议

- **格式**：MP4（H.264 编码）
- **分辨率**：1920x1080 或 1280x720
- **帧率**：30 FPS（足够演示）
- **比特率**：2-5 Mbps
- **文件大小**：尽量控制在 50MB 以内

## 七、完整操作流程总结

### GitHub 上传流程

```
1. 创建 GitHub 仓库
2. git init
3. git remote add origin <仓库地址>
4. git add .
5. git commit -m "初始提交"
6. git push -u origin main
```

### 视频制作流程

```
1. 打开录制工具（Xbox Game Bar 或 OBS）
2. 启动游戏
3. 开始录制
4. 演示游戏功能
5. 停止录制
6. 编辑视频（可选）
7. 压缩视频
8. 上传到 GitHub 或其他平台
```

## 八、常见问题

### Q1: Git push 失败怎么办？

**A**: 
- 检查网络连接
- 确认远程仓库地址正确
- 检查认证信息（用户名和 Token）

### Q2: 视频文件太大怎么办？

**A**:
- 使用视频压缩工具
- 降低分辨率和比特率
- 或上传到视频平台后嵌入链接

### Q3: 如何让视频更专业？

**A**:
- 添加开场和结尾
- 添加字幕说明
- 使用稳定的录制工具
- 保持画面清晰

### Q4: GitHub 不支持直接播放视频吗？

**A**:
- GitHub 的 README.md 不支持直接嵌入视频
- 可以使用 HTML 标签，但效果有限
- 建议上传到视频平台后嵌入链接
- 或使用 GitHub Pages 创建演示页面

