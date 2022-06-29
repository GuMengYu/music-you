<p align="center">
  <img width="64" align="center" src="./doc/logo.png">
</p>
<h1 align="center">
  VPlayer
</h1>
<p align="center">
    <a href="https://m3.material.io/" target="_blank"> Material Design 3 (Material You)</a> 风格的音乐播放器,采用网易云音乐非官方API NeteaseCloudMusicApi 接口
</p>

## Introduction

开发基于 vue 全家桶 + vuetify + [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) + electron, 提供网易云音乐的基础功能。[🎵 网页版](https://v-player-git-dev-gumengyu.vercel.app/) (vercel 部署，可能有点慢 😁， 建议下载桌面客户端体验)

vue3 + ts 重构 2.0 版本

🎨 已有功能

- 单纯的播放器，不能网抑云
- 支持手机号，手机扫码登录
- 资料库
- 日推，私人 fm, mv 播放
- 适配黑暗模式
- 歌词
- 桌面客户端

🏗 Work In Progress

- 下载歌曲/mv/封面

...and more

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/176350540-463dd27b-14a8-4b4a-bcb4-0ef9174c580e.png">
  <img width="1920" alt="home" src="https://user-images.githubusercontent.com/22021419/176350547-7f1b6d6d-0af9-4a6f-8a7f-f406d26f9d5f.png">
</picture>

## 运行

### 安装依赖

```
npm install
or
yarn install
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

## 预览

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/171577554-b327e276-7fb2-43a3-a2ef-71486b8fad4e.png">
  <img alt="artist" src="https://user-images.githubusercontent.com/22021419/171577562-d01b073e-036d-4030-b266-8835cf20211b.png">
</picture>

<hr>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/171577531-2becfb40-a4f5-40fa-8aa4-1f4bbdebf457.png">
  <img alt="album" src="https://user-images.githubusercontent.com/22021419/171577547-1ae54a78-3267-4723-8e31-fceeffa5d7fd.png">
</picture>
<hr>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/171577643-24cd2c38-f3dd-45b9-9c08-abd5c4b0e10e.png">
  <img alt="playlist" src="https://user-images.githubusercontent.com/22021419/171577650-ac978f49-8df3-4e75-80ca-5707a2106ab8.png">
</picture>
<hr>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/171577571-11444997-775e-4750-b6ae-bcf73aa0402b.png">
  <img alt="center" src="https://user-images.githubusercontent.com/22021419/171577576-00f045b5-d35b-4597-9288-50887bdb3699.png">
</picture>
<hr>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/171577603-39d2efba-327b-4054-92f6-4c3eb08d47ca.png">
  <img alt="ground" src="https://user-images.githubusercontent.com/22021419/171577611-3ed58e5b-9bbc-4f40-a183-1565502a4d25.png">
</picture>
<hr>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/171577631-6c1d71eb-95a7-484c-be69-e09cbd8dff06.png">
  <img alt="lyric" src="https://user-images.githubusercontent.com/22021419/171577639-ca54b4e9-d451-4f6a-b2ec-7626478da430.png">
</picture>
<hr>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/171577655-3bb75577-af8c-4eaa-88f5-79858783a15b.png">
  <img alt="setting" src="https://user-images.githubusercontent.com/22021419/171577657-af2e01d6-00f5-4f26-9c57-ce684c90205d.png">
</picture>

## License

[MIT](/LICENSE)

## 最后

仅供学习交流使用，禁止个人用于非法商业用途。
