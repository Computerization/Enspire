![logo-bg-white](https://github.com/Computerization/Enspire/assets/46770502/27133de7-efd7-4860-8f83-e160a25ab042)

![GitHub deployments](https://img.shields.io/github/deployments/computerization/enspire/production?logo=netlify&label=Netlify)
 ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/computerization/enspire/quality.yml) ![GitHub License](https://img.shields.io/github/license/computerization/enspire) ![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/computerization/enspire/next)

---

C 社是服务类社团，其创始初心是为学校生活提供便利，如今我们发现，同学们 CAS 活动中遇到的管理、技术、宣传问题，是一个巨大的需求缺口

Enspire 的目标很简单，**Make CAS life easier for everyone**

如果你不了解**开源项目**是什么，可以参考这个[网站](https://opensource.guide/)

## 本地运行

### (可选) For Visual Studio Code
<details>
 <summary>设置 Devcontainer</summary>

1. F1 调出 Command Palette，选择 `Dev Containers: Clone Repository in Container Volume...`
2. 输入 `https://github.com/computerization/enspire`

> 不建议 `Reopen in Container`，Bind Mounted Volume 会导致严重的IO性能问题。
</details>

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

```bash
cp .env.example .env
```
并编辑其中内容。

### 初始化数据库

```bash
prisma generate
```

### 导入社团信息

```bash
pnpm run update-club-info
```

### 运行开发服务器

```bash
pnpm run dev
```
浏览器访问 `http://localhost:3000` 即可。

### Troubleshooting
<details>
 <summary>pnpm & Prisma 兼容性错误</summary>

[WebStorm](https://www.jetbrains.com/zh-cn/webstorm/) + [pnpm](https://pnpm.io/zh/) + [Prisma](https://www.prisma.io/) 目前存在兼容性问题，目前解决方式如下:

- 每次更新 Prisma 后于左侧文件目录中查找 node_modules/.pnpm/@prisma+client@x.x.x
- 右键 > Mark Directory as > Not Excluded
</details>

<details>
 <summary>ESLint 错误</summary>
如果您遇到 WebStorm 于代码窗口上提示 `ESLint: Error: invalid Options`，请尝试将 WebStorm IDE 更新至最新版本。

</details>

## 技术细节

该项目主要依赖的库及平台如下：
- [Nuxt](https://nuxt.com) (前端&后端)
- [Prisma](https://prisma.io) (数据库)
- [Tailwind](https://tailwindcss.com/) (CSS)
- [Shadcn-vue](https://shadcn-vue.com) (前端组件库)
- [Clerk](https://clerk.com) (用户管理)

---
欢迎其它社团及学校联系合作。
