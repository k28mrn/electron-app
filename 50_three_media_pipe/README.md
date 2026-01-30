# Three.js + MediaPipe Hand Tracking

大阪芸術大学短期大学部
2024年度 アートサイエンスコース
プログラミング演習授業用 Electron開発環境

## 概要

Three.jsとMediaPipe Hand Landmarkerを使用したハンドトラッキングのサンプルプロジェクト。
Webカメラで手を認識し、3D空間にランドマーク（関節点）とボーン（骨格）を表示します。

## 機能

- リアルタイムハンドトラッキング（2手まで対応）
- 21個のランドマーク検出
- 指先に大きめのスフィア表示
- ボーン（骨格線）の可視化
- 左手（シアン）/ 右手（マゼンタ）の色分け

## プロジェクト設定

### 開発環境

node : 20.11.0

### インストール

```bash
$ npm install
```

### 開発実行

```bash
$ npm run dev
```

### アプリビルド

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## ファイル構成

```
src/renderer/scripts/
├── main.ts              # エントリーポイント
├── sketch-mediapipe.ts  # MediaPipe ハンドトラッキング（有効）
└── sketch-three.ts      # Three.js 基本サンプル（コメントアウト中）
```

切り替えは `main.ts` のimport文を変更してください。

---

## 使用パッケージ

[Three.js](https://threejs.org/)
3D描画ライブラリ

[MediaPipe Tasks Vision](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
Google製の手・顔・体トラッキングライブラリ

[electron-store](https://github.com/sindresorhus/electron-store)
アプリの設定情報等をローカル上に保存

[Tweakpane](https://cocopon.github.io/tweakpane/)
アプリを設定するためのGUI

## MediaPipe 対応タスク

このプロジェクトで使用している `@mediapipe/tasks-vision` は以下のトラッキングにも対応:

| タスク | 説明 |
|--------|------|
| Hand Landmarker | 手の追跡（21点/手） |
| Face Landmarker | 顔の追跡（478点） |
| Pose Landmarker | 体の追跡（33点） |
