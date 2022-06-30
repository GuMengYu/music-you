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

## 部分截图

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/176639379-1bbdd3e2-64df-4e7e-9339-568e3d18efcc.png">
  <img alt="artist" src="https://user-images.githubusercontent.com/22021419/176639384-c5683714-2c14-410f-8d52-60be2a4469dd.png">
</picture>

<hr></hr>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/176639359-147c17f3-a410-43c6-8ea2-0633989ad125.png">
  <img alt="artist" src="https://user-images.githubusercontent.com/22021419/176639349-f702e141-44e2-433b-bcdc-97fbf2eaa104.png">
</picture>

<hr></hr>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/176639363-9688d9ae-6df0-412e-aff0-ed2a0087dd14.png">
  <img alt="center" src="https://user-images.githubusercontent.com/22021419/176639366-80d19049-dd9c-4781-880e-ac2794db4d03.png">
</picture>
<hr></hr>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/176639369-a336d1ae-0e0e-45ed-9a77-25843ea6f9e8.png">
  <img alt="ground" src="https://user-images.githubusercontent.com/22021419/176639379-1bbdd3e2-64df-4e7e-9339-568e3d18efcc.png">
</picture>
<hr></hr>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/176639393-42b950f3-1639-4402-a06b-f1a9eb035859.png">
  <img alt="lyric" src="https://user-images.githubusercontent.com/22021419/176639393-42b950f3-1639-4402-a06b-f1a9eb035859.png">
</picture>
<hr></hr>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/176647513-708a6b43-b22b-4ae5-be29-39a84bc217af.png">
  <img alt="setting" src="https://user-images.githubusercontent.com/22021419/176647421-e95c257d-c1d7-48a6-bcc0-644f64b07886.png">
</picture>

## License

[MIT](/LICENSE)

## 最后

仅供学习交流使用，禁止个人用于非法商业用途。
