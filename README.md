# Enspire

Enspire 是**C 社所属的开源项目**，旨在建设一个**活动技术支持平台**

C 社是服务类社团，其创始初心是为学校生活提供便利，如今我们发现，同学们 CAS 活动中遇到的管理、技术、宣传问题，是一个巨大的需求缺口

Enspire 的目标很简单，**make CAS life easier for every one**

如果你不了解**开源项目**是什么，可以参考这个[网站](https://opensource.guide/)

## 本地运行

请按顺序执行下列步骤：

打开系统命令行

如果你是 `macOS` 系统，打开**终端/Terminal**程序

如果你是 `Windows` 系统，**强烈建议**前往 Microsoft 应用商店下载最新的 Windows Terminal 程序，避免长期使用系统自带的 cmd 或 powershell 过时配色的视觉疲劳

```sh
git clone https://github.com/Computerization/Enspire
```

这行指令利用代码管理工具 `git` 将线上仓库复制到本地

如果你是 `macOS` 或 `linux` 系统，你的电脑应该已经预装有 `git` 程序

如果你是 `Windows` 系统，你很可能需要自行安装 `git`，请善用搜索引擎（推荐 `Bing` 或 `Google`）搜索**距离现在时间并不太远**的 `git` 安装教程

```sh
cd Enspire
```

这行指令将当前目录切换到 `Enspire` 文件夹

```sh
npm install
```

这行指令利用包管理工具 `npm` 安装网站所需依赖

**注意** `npm` 软件并非系统自带，请各位社员依据各自的具体系统，搜索合适的安装教程。

如果在过程中遇到报错，推荐先将错误信息完整复制后作为关键词搜索解决方案

仍无法解决的，请联系社长或 Web 部部长

```sh
npm run dev
```

这行指令在本地启动一个服务器运行网站
