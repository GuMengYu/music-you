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
- 日推，私人 fm, mv 播放
- 适配黑暗模式
- 歌词
- 桌面客户端 ([下载](https://github.com/GuMengYu/v-player/releases))

🏗 Work In Progress

- 下载歌曲/mv/封面

...and more

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/229052215-5e20b766-1589-4726-8d15-8ca284fbbaed.png">
  <img alt="home" src="https://user-images.githubusercontent.com/22021419/229052219-ab85b0fb-0e93-4fd8-abb8-0bf39fb5f763.png">
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
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/229052169-e100d904-29ef-490c-bb63-0f2007006a65.png">
  <img alt="artist" src="https://user-images.githubusercontent.com/22021419/229052198-fff0063a-5623-4dd3-b995-a06614184a28.png">
</picture>

<hr></hr>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/229052194-09c49566-f50b-4ba2-ad74-7203c5e8a390.png">
  <img alt="center" src="https://user-images.githubusercontent.com/22021419/229052213-54f2d1cd-8a20-432c-bf88-5b3558bca03d.png">
</picture>

<hr></hr>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/229052184-bc145385-f542-40d9-8e1e-86491e3274d0.png">
  <img alt="center" src="https://user-images.githubusercontent.com/22021419/229052206-86ed7a63-e5e3-426a-b5d7-1c4960a0edb3.png">
</picture>

<hr></hr>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/22021419/229052187-90c38e4e-08ea-451a-b472-909be4fbc340.png">
  <img alt="center" src="https://user-images.githubusercontent.com/22021419/229052210-edf3d006-9769-4db7-8c2a-9a65894c73f5.png">
</picture>

https://user-images.githubusercontent.com/22021419/186813168-48a2d0ae-0388-4b70-9844-a540305a1096.mov

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
