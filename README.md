<p align="center">
  <img width="64" align="center" src="./doc/logo.png">
</p>
<h1 align="center">
  Music You
</h1>
<p align="center">
    <a href="https://m3.material.io/" target="_blank"> Material Design 3 (Material You)</a> 风格的音乐播放器, 网易云音乐非官方API NeteaseCloudMusicApi 接口
</p>

## Introduction

开发基于 vue 全家桶 + vuetify + [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) + electron, 提供网易云音乐的基础功能。[🎵 网页版](https://v-player-git-dev-gumengyu.vercel.app/) (vercel 部署，可能有点慢 😁， 建议下载桌面客户端体验)

vue3 + ts 重构 2.0 版本

[桌面客户端下载](https://github.com/GuMengYu/v-player/releases)

🎨 已有功能

- 单纯的播放器，不能网抑云
- 支持手机号，手机扫码登录
- 资料库
- 日推，私人 fm, 心动模式
- darkmode
- 歌词
- 桌面客户端 ([下载](https://github.com/GuMengYu/v-player/releases))

...and more

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/230582624-4eeb06aa-61d5-4124-8450-f4a435714bd0.png">
  <img alt="home" src="https://user-images.githubusercontent.com/22021419/230582605-2eebe411-fac5-4a98-8121-872c205dff59.png">
</picture>

## 运行

### 安装依赖

```
npm install
or
pnpm install

// pnpm 由于pnpm 默认并不会将所有依赖平铺展开到node_modules下，所以build后的包可能会报错，某些依赖找不到，建议加上 --shamefully-hoist 参数 `pnpm i --shamefully-hoist ` 来安装

```

### 启动服务

需要本地部署 [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

需要解锁网易云灰色歌曲可以 clone 部署 fork NeteaseCloudMusicApi 的仓库 [NeteaseCloudMusicApi](https://github.com/GuMengYu/NeteaseCloudMusicApi), 解锁接口来自 [UnblockNeteaseMusic](https://github.com/UnblockNeteaseMusic/server)

```
npm run dev
```

### 打包客户端

```
npm run electron:build
```

## 部分截图

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/230582633-f0ba064e-a4b6-4ee8-a538-15e86a298617.png">
  <img alt="artist" src="https://user-images.githubusercontent.com/22021419/230582617-265dbb83-2d98-4430-a3d7-3881b03a078d.png">
</picture>

<hr></hr>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/230582643-2abb7850-850c-433b-8e49-ab9b61623bfd.png">
  <img alt="center" src="https://user-images.githubusercontent.com/22021419/230582656-b181dd59-3793-4127-9b9f-f56958613587.png">
</picture>

<hr></hr>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/230582630-80f7c80a-250c-4324-a74e-c333028f3449.png">
  <img alt="center" src="https://user-images.githubusercontent.com/22021419/230582611-faa13763-1eb4-45bd-98db-fb63d5581297.png">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/230708070-42ddfb55-66ce-4436-9be4-13ccca3a1fb8.png">
  <img alt="center" src="https://user-images.githubusercontent.com/22021419/230708070-42ddfb55-66ce-4436-9be4-13ccca3a1fb8.png">
</picture>

https://user-images.githubusercontent.com/22021419/186813168-48a2d0ae-0388-4b70-9844-a540305a1096.mov

## [License](./LICENSE)

## 声明

仅供学习交流使用，禁止个人用于非法商业用途。
