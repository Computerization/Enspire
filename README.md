# Enspire

C 社是服务类社团，其创始初心是为学校生活提供便利，如今我们发现，同学们 CAS 活动中遇到的管理、技术、宣传问题，是一个巨大的需求缺口

Enspire 的目标很简单，**make CAS life easier for every one**

如果你不了解**开源项目**是什么，可以参考这个[网站](https://opensource.guide/)

## 本地运行

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
prisma migrate
```

### 导入社团信息
```bash
pnpm run update-club-info
```

### 运行开发服务器
```bash
pnpm run dev
```
浏览器登陆`http://localhost:3000`即可。

## 技术细节
该项目主要依赖的库及平台如下：
- [Nuxt](https://nuxt.com) (前端&后端)
- [Prisma](https://prisma.io) (数据库)
- [Tailwind](https://tailwindcss.com/) (CSS)
- [Shadcn-vue](https://shadcn-vue.com) (前端组件库)
- [Clerk](https://clerk.com) (用户管理)

---
欢迎其它社团及学校联系合作。
