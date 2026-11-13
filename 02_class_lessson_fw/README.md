# electron-app (クラス学習：花火)
大阪芸術大学短期大学部
2024年度 アートサイエンスコース
プログラミング演習授業用 Electron開発環境

## このサンプルについて

クラスを使って花火を打ち上げるサンプルです。

- クリック：クリックした位置で開く花火を打ち上げる
- スペースキー：まとめて打ち上げる
- 画面左下に、今あるインスタンスの数が表示されます

### クラスの構成

| クラス | ファイル | 役割 |
|---|---|---|
| `Firework` | `src/renderer/scripts/fireworks/firework.ts` | 花火 1 発分。開いたあとは `Particle` をたくさん持つ |
| `Particle` | `src/renderer/scripts/fireworks/particle.ts` | 火花 1 粒分。重力で落ちながら、寿命が尽きると消える |

`src/renderer/scripts/sketch.ts` が `Firework` を `new` して配列に入れ、毎フレーム `update()` と `draw()` を呼んでいます。

### 改造してみよう

- 各ファイルの先頭にある定数（`GRAVITY` や `AUTO_LAUNCH_RATE` など）の数字を変える
- `Firework` の constructor にある `particleCount` や `power` の範囲を変える
- `Firework` の `explode()` を書き換えて、輪っかやハートの形に開く花火を作る

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
---

### 使用パッケージ
[p5.js](https://p5js.org/)
描画ライブラリ

[electron-store](https://github.com/sindresorhus/electron-store)
アプリの設定情報等をローカル上に保存

[Tweakpane](https://cocopon.github.io/tweakpane/)
アプリを設定するためのGUI

[serialport](https://www.npmjs.com/package/serialport)
シリアル接続制御ライブラリ

[osc-js](https://www.npmjs.com/package/osc-js)
OSC通信ライブラリ
