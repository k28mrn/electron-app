# electron-basic-develop-env
大阪芸術大学短期大学部 
2023年度 アートサイエンスコース
プログラミング演習授業用 Electron開発環境

## 開発環境
node : v18.16.0  

---

## GUI使い方
- キーボード「1」を押すことで表示非表示切り替えれます。

---

## 開発実行
```sh
$ npm run dev
```
---

## アプリビルド
### ビルド前確認
1. `./package.json` の中身
```json
{
	"version": "1.0.0",
	"productName": "ElectronBasicDevelopEnv",
}
```
2. `version` 再インストールする場合はバージョンを更新する。
1. `productName` アプリ名を任意で変更できます。

### ビルドコマンド
```sh
$ npm run dist
```

- プロジェクトフォルダ内にdistファイルが作成されそこにインストーラーとアプリがビルドされます。
- `./dist/`

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