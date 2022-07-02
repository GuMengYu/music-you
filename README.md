<p align="center">
  <img width="64" align="center" src="./doc/logo.png">
</p>
<h1 align="center">
  VPlayer
</h1>
<p align="center">
    <a href="https://m3.material.io/" target="_blank"> Material Design 3 (Material You)</a> 风格的音乐播放器, 网易云音乐非官方API NeteaseCloudMusicApi 接口
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
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/176804703-7655ee81-a42c-44d5-947a-b9b91d8e3d05.png">
  <img alt="home" src="https://user-images.githubusercontent.com/22021419/176804705-c2c8cb3d-2435-4b16-a4ae-1e4f1bf388c2.png">
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
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/176804689-c8d6e317-a4c2-4673-8508-0f8979fc7327.png">
  <img alt="artist" src="https://user-images.githubusercontent.com/22021419/176804698-85fd9bd0-6c7a-4f03-8b8e-f6bef737e526.png">
</picture>

<hr></hr>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/176804674-9b20b7e2-7de9-4349-b638-ecd727425b4a.png">
  <img alt="artist" src="https://user-images.githubusercontent.com/22021419/176804699-c1499b10-63f3-4b9f-919d-33fe8b9f8287.png>
</picture>

<hr></hr>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/176804691-ff4a663e-8906-4192-af76-ba195cd5e4bb.png">
  <img alt="center" src="https://user-images.githubusercontent.com/22021419/176804694-fa497594-ba2a-45be-8581-dd266214f7e1.png">
</picture>

<hr></hr>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/176804706-5525c3d8-9ea9-46d3-b9d0-64cbc056a6fe.png">
  <img alt="center" src="https://user-images.githubusercontent.com/22021419/176804696-1d4674fb-aae5-464f-91cd-835b660b28bb.png">
</picture>

<hr></hr>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/176804692-3a3a0902-6e3c-4a37-a596-f59494d88020.png">
  <img alt="center" src="https://user-images.githubusercontent.com/22021419/176804702-ea40c49c-aa4a-46fe-8e28-eadfc0519eb6.png">
</picture>

## License

```
MIT License

Copyright (c) 2021 hyu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


```

## 声明

仅供学习交流使用，禁止个人用于非法商业用途。
