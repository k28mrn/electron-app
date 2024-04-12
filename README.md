# electron-app
大阪芸術大学短期大学部
2024年度 アートサイエンスコース
プログラミング演習授業用 Electron開発環境

## プロジェクト設定

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
