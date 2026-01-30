# MediaPipe ハンドトラッキング入門

このドキュメントでは、MediaPipeを使ったハンドトラッキングの仕組みと、Three.jsでの3D可視化について学びます。

---

## 目次

1. [はじめに](#1-はじめに)
2. [MediaPipeとは](#2-mediapipeとは)
3. [ハンドトラッキングの仕組み](#3-ハンドトラッキングの仕組み)
4. [サンプルコードの解説](#4-サンプルコードの解説)
5. [Three.jsとの連携](#5-threejsとの連携)
6. [コードの詳細解説](#6-コードの詳細解説)
7. [応用例・発展](#7-応用例発展)
8. [参考リンク](#8-参考リンク)

---

## 1. はじめに

### このドキュメントで学べること

- MediaPipeとは何か、どのような技術か
- 手のトラッキングがどのように行われるか
- カメラ映像からリアルタイムで手を認識する方法
- 認識した手の位置を3D空間に表示する方法

### 前提知識

- JavaScript/TypeScriptの基本的な文法
- Three.jsの基本（シーン、カメラ、メッシュ）

---

## 2. MediaPipeとは

### 概要

**MediaPipe**は、Googleが開発した**機械学習フレームワーク**です。
カメラに映った人間の「手」「顔」「体」などをリアルタイムで認識できます。

```
┌─────────────────────────────────────────────────────────┐
│                      MediaPipe                          │
│                                                         │
│   カメラ映像 → 機械学習モデル → 認識結果（座標データ）  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 特徴

| 特徴 | 説明 |
|------|------|
| **リアルタイム処理** | 30fps以上の速度で処理可能 |
| **ブラウザで動作** | WebAssembly（Wasm）を使用してブラウザ上で実行 |
| **ローカル処理** | インターネット接続不要、プライバシーに配慮 |
| **無料** | オープンソースで商用利用も可能 |

### 対応タスク

MediaPipeは様々な認識タスクに対応しています：

| タスク名 | 検出対象 | ランドマーク数 |
|----------|----------|----------------|
| **Hand Landmarker** | 手 | 21点/手 |
| **Face Landmarker** | 顔 | 478点 |
| **Pose Landmarker** | 体（全身） | 33点 |

### ブラウザで動く仕組み

通常、機械学習はPythonなどで実行しますが、MediaPipeは**WebAssembly（Wasm）**という技術を使って、JavaScriptからでも高速に実行できます。

```
┌─────────────────────────────────────────────────────────┐
│                    ブラウザ                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │ JavaScript  │ → │ WebAssembly │ → │ GPU処理     │ │
│  │ (私たちの   │    │ (高速実行)  │    │ (さらに高速)│ │
│  │  コード)    │    │             │    │             │ │
│  └─────────────┘    └─────────────┘    └─────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 3. ハンドトラッキングの仕組み

### ランドマーク（関節点）とは

MediaPipeのハンドトラッキングは、手の**21個のポイント（ランドマーク）**を検出します。
これらのポイントは、手の関節や指先に対応しています。

### 手のランドマーク図

```
                    中指(12)
                      │
            人差し指  │  薬指
              (8)    │   (16)
               │     │     │        小指
               │     │     │        (20)
               │     │     │         │
      親指     │     │     │         │
       (4)     │     │     │         │
        │      │     │     │         │
        ●──────●─────●─────●─────────●
       (3)    (7)   (11)  (15)      (19)
        │      │     │     │         │
        ●      ●     ●     ●         ●
       (2)    (6)   (10)  (14)      (18)
        │      │     │     │         │
        ●      ●─────●─────●─────────●
       (1)    (5)   (9)   (13)      (17)
         \     │     │     │        /
          \    │     │     │       /
           ────●─────────────●────
              手首(0)
```

### 各ランドマークの番号と名前

| インデックス | 名前 | 説明 |
|--------------|------|------|
| 0 | WRIST | 手首 |
| 1-4 | THUMB | 親指（根元→先端） |
| 5-8 | INDEX_FINGER | 人差し指（根元→先端） |
| 9-12 | MIDDLE_FINGER | 中指（根元→先端） |
| 13-16 | RING_FINGER | 薬指（根元→先端） |
| 17-20 | PINKY | 小指（根元→先端） |

### 指先のインデックス

指先は特に重要なので、覚えておくと便利です：

| 指 | インデックス |
|----|--------------|
| 親指の先 | 4 |
| 人差し指の先 | 8 |
| 中指の先 | 12 |
| 薬指の先 | 16 |
| 小指の先 | 20 |

### 座標系

MediaPipeから返される座標は、**0から1の範囲に正規化**されています。

```
       (0,0)─────────────────(1,0)
         │                     │
         │    カメラ映像の     │
         │      範囲           │
         │                     │
       (0,1)─────────────────(1,1)
```

| 軸 | 範囲 | 意味 |
|----|------|------|
| x | 0.0 〜 1.0 | 左端が0、右端が1 |
| y | 0.0 〜 1.0 | 上端が0、下端が1 |
| z | 負の値 〜 正の値 | カメラに近いほど負、遠いほど正 |

---

## 4. サンプルコードの解説

### ファイル構成

```
src/renderer/scripts/
├── main.ts              # エントリーポイント（アプリ起動）
├── sketch-mediapipe.ts  # ハンドトラッキングのメイン処理
└── sketch-three.ts      # Three.js基本サンプル（参考用）
```

### 処理の流れ

```
┌─────────────────────────────────────────────────────────────┐
│                       起動時（setup）                       │
├─────────────────────────────────────────────────────────────┤
│  1. Three.jsのシーン・カメラ・レンダラーを作成              │
│  2. 手を表示するための3Dオブジェクト（スフィア・ライン）を作成│
│  3. MediaPipe HandLandmarkerを初期化                        │
│  4. Webカメラを起動                                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    毎フレーム（draw）                        │
├─────────────────────────────────────────────────────────────┤
│  1. カメラ映像から手を検出（detectForVideo）                │
│  2. 検出結果から座標を取得                                  │
│  3. 座標をThree.jsの座標系に変換                            │
│  4. 3Dオブジェクトの位置を更新                              │
│  5. シーンを描画                                            │
└─────────────────────────────────────────────────────────────┘
```

### インポート部分

```typescript
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
    FilesetResolver,      // MediaPipeの初期化に必要
    HandLandmarker,       // 手の検出を行うクラス
    HandLandmarkerResult, // 検出結果の型
} from "@mediapipe/tasks-vision";
```

### 初期化処理

#### 1. FilesetResolver

MediaPipeのWebAssemblyファイルを読み込むためのヘルパーです。

```typescript
const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
);
```

#### 2. HandLandmarker

手の検出を行うメインのクラスです。

```typescript
handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
        // 学習済みモデルのURL
        modelAssetPath: "https://storage.googleapis.com/.../hand_landmarker.task",
        delegate: "GPU"  // GPUを使用して高速化
    },
    runningMode: "VIDEO",  // 動画モード（連続フレーム処理）
    numHands: 2            // 最大2つの手を検出
});
```

#### 3. Webカメラ初期化

```typescript
const stream = await navigator.mediaDevices.getUserMedia({
    video: {
        width: 1280,
        height: 720,
        facingMode: "user"  // フロントカメラを使用
    }
});
video.srcObject = stream;
await video.play();
```

### 毎フレームの処理

#### 手の検出

```typescript
// ビデオの現在時刻が変わったら検出を実行
if (currentTime !== lastVideoTime) {
    lastVideoTime = currentTime;
    handResults = handLandmarker.detectForVideo(video, performance.now());
}
```

#### 検出結果の構造

```typescript
handResults = {
    landmarks: [           // 検出された手の配列
        [                  // 1つ目の手（21個のランドマーク）
            { x: 0.5, y: 0.3, z: -0.1 },  // ランドマーク0（手首）
            { x: 0.4, y: 0.2, z: -0.2 },  // ランドマーク1（親指の根元）
            // ... 21個のランドマーク
        ],
        [                  // 2つ目の手（もし検出されていれば）
            // ...
        ]
    ],
    handedness: [          // 左手か右手かの情報
        [{ categoryName: "Left", score: 0.95 }],
        // ...
    ]
}
```

---

## 5. Three.jsとの連携

### 座標系の違い

MediaPipeとThree.jsでは座標系が異なります。

```
MediaPipe座標                   Three.js座標

  (0,0)───→ x (1,0)              ↑ y (+1)
    │                            │
    ↓                            │
  y (0,1)                 (-1) ←─┼─→ x (+1)
                                 │
                                 ↓ y (-1)
```

### 座標変換の計算

MediaPipeの座標（0〜1）をThree.jsの座標（-1〜+1）に変換します。

```typescript
// MediaPipeの座標
const lm = landmarks[i];  // { x: 0.3, y: 0.7, z: -0.05 }

// Three.jsの座標に変換
const x = -(lm.x - 0.5) * 2;  // 左右反転（鏡像表示）
const y = -(lm.y - 0.5) * 2;  // 上下反転
const z = -lm.z * 2;          // 奥行き
```

#### 変換の詳細

| 処理 | 計算式 | 説明 |
|------|--------|------|
| 中心を原点に | `lm.x - 0.5` | 0〜1 → -0.5〜0.5 |
| 範囲を拡大 | `* 2` | -0.5〜0.5 → -1〜1 |
| X軸反転 | `-` | 鏡像表示にするため |
| Y軸反転 | `-` | MediaPipeは下が正、Three.jsは上が正 |

### スフィアとラインの配置

#### スフィア（関節点）

各ランドマークの位置にスフィア（球体）を配置します。

```typescript
// 指先は大きめのスフィア
const isFingertip = FINGERTIP_INDICES.includes(i);
const radius = isFingertip ? 0.025 : 0.015;

const geometry = new THREE.SphereGeometry(radius, 16, 16);
const sphere = new THREE.Mesh(geometry, material);
```

#### ライン（ボーン）

関節間をラインで接続して骨格を表現します。

```typescript
// HAND_CONNECTIONS配列で接続関係を定義
const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],  // 親指
    // ...
];

// 2点間にラインを引く
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(6);  // 始点(x,y,z) + 終点(x,y,z)
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
```

---

## 6. コードの詳細解説

### HAND_CONNECTIONS配列

手の骨格を描画するための接続情報です。各要素は `[始点インデックス, 終点インデックス]` の形式です。

```typescript
const HAND_CONNECTIONS = [
    // 親指（手首→親指の先へ）
    [0, 1], [1, 2], [2, 3], [3, 4],

    // 人差し指
    [0, 5], [5, 6], [6, 7], [7, 8],

    // 中指
    [0, 9], [9, 10], [10, 11], [11, 12],

    // 薬指
    [0, 13], [13, 14], [14, 15], [15, 16],

    // 小指
    [0, 17], [17, 18], [18, 19], [19, 20],

    // 手のひら（指の根元同士を接続）
    [5, 9], [9, 13], [13, 17]
];
```

### createHandObjects関数

起動時に、手を表示するための3Dオブジェクトを事前に作成します。

```typescript
const createHandObjects = (): void => {
    const colors = [0x00ffff, 0xff00ff];  // 左:シアン、右:マゼンタ

    for (let hand = 0; hand < 2; hand++) {
        // 21個のスフィアを作成
        for (let i = 0; i < 21; i++) {
            const sphere = new THREE.Mesh(geometry, material);
            sphere.visible = false;  // 最初は非表示
            landmarkSpheres[hand].push(sphere);
        }

        // 24本のライン（ボーン）を作成
        for (let i = 0; i < HAND_CONNECTIONS.length; i++) {
            const line = new THREE.Line(geometry, material);
            line.visible = false;
            boneLines[hand].push(line);
        }
    }
};
```

### updateHandVisualization関数

毎フレーム呼ばれ、検出結果に基づいて3Dオブジェクトを更新します。

```typescript
const updateHandVisualization = (): void => {
    // 1. まず全てのオブジェクトを非表示に
    for (let hand = 0; hand < 2; hand++) {
        for (const sphere of landmarkSpheres[hand]) {
            sphere.visible = false;
        }
    }

    // 2. 検出された手があれば表示
    if (!handResults || !handResults.landmarks) return;

    // 3. 各手のランドマークを処理
    for (let handIndex = 0; handIndex < handResults.landmarks.length; handIndex++) {
        const landmarks = handResults.landmarks[handIndex];

        // スフィアの位置を更新
        for (let i = 0; i < landmarks.length; i++) {
            const lm = landmarks[i];
            const x = -(lm.x - 0.5) * 2;
            const y = -(lm.y - 0.5) * 2;
            const z = -lm.z * 2;

            landmarkSpheres[handIndex][i].position.set(x, y, z);
            landmarkSpheres[handIndex][i].visible = true;
        }

        // ラインの位置を更新
        for (let i = 0; i < HAND_CONNECTIONS.length; i++) {
            const [start, end] = HAND_CONNECTIONS[i];
            // 始点と終点の位置を設定...
        }
    }
};
```

---

## 7. 応用例・発展

### ジェスチャー認識の実装

ランドマークの位置関係から、ジェスチャーを判定できます。

#### グー・チョキ・パーの判定例

```typescript
const detectGesture = (landmarks) => {
    // 指先と根元の距離を計算
    const fingerTips = [8, 12, 16, 20];  // 人差し指〜小指の先
    const fingerBases = [5, 9, 13, 17];  // それぞれの根元

    let extendedFingers = 0;

    for (let i = 0; i < 4; i++) {
        const tip = landmarks[fingerTips[i]];
        const base = landmarks[fingerBases[i]];

        // Y座標を比較（指先が根元より上なら伸びている）
        if (tip.y < base.y) {
            extendedFingers++;
        }
    }

    if (extendedFingers === 0) return "グー";
    if (extendedFingers === 2) return "チョキ";
    if (extendedFingers === 4) return "パー";
    return "不明";
};
```

#### ピンチ（つまむ動作）の検出

```typescript
const detectPinch = (landmarks) => {
    const thumbTip = landmarks[4];   // 親指の先
    const indexTip = landmarks[8];   // 人差し指の先

    // 2点間の距離を計算
    const distance = Math.sqrt(
        Math.pow(thumbTip.x - indexTip.x, 2) +
        Math.pow(thumbTip.y - indexTip.y, 2) +
        Math.pow(thumbTip.z - indexTip.z, 2)
    );

    return distance < 0.05;  // 閾値以下ならピンチ
};
```

### Face Landmarkerへの拡張

顔のトラッキングも同様の方法で実装できます。

```typescript
import { FaceLandmarker } from "@mediapipe/tasks-vision";

const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
    },
    runningMode: "VIDEO",
    numFaces: 1
});

// 使い方はHandLandmarkerとほぼ同じ
const faceResults = faceLandmarker.detectForVideo(video, performance.now());
// faceResults.faceLandmarks に478個の顔のランドマーク
```

### Pose Landmarkerへの拡張

全身のトラッキングも可能です。

```typescript
import { PoseLandmarker } from "@mediapipe/tasks-vision";

const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
    },
    runningMode: "VIDEO",
    numPoses: 1
});

// 33個の体のランドマーク（頭、肩、肘、手首、腰、膝、足首など）
const poseResults = poseLandmarker.detectForVideo(video, performance.now());
```

### インタラクティブ作品のアイデア

1. **エアお絵かき** - 指先の軌跡を描画して空中にお絵かき
2. **バーチャル楽器** - 手の位置で音を鳴らす
3. **ジェスチャーUI** - 手の形でアプリを操作
4. **ARエフェクト** - 手に炎や光のエフェクトを追加
5. **パペット操作** - 手の動きで3Dキャラクターを動かす

---

## 8. 参考リンク

### 公式ドキュメント

- [MediaPipe Hand Landmarker Guide](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
- [MediaPipe Hand Landmarker for Web](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker/web_js)
- [@mediapipe/tasks-vision npm](https://www.npmjs.com/package/@mediapipe/tasks-vision)

### Three.js

- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)

### 学習リソース

- [MediaPipe GitHub](https://github.com/google-ai-edge/mediapipe)
- [Google AI Edge](https://ai.google.dev/edge/mediapipe)

---

## まとめ

このドキュメントでは以下のことを学びました：

1. **MediaPipe**はGoogleの機械学習フレームワークで、手・顔・体をリアルタイムで認識できる
2. **ハンドトラッキング**は手の21個のランドマーク（関節点）を検出する
3. **座標変換**が必要：MediaPipe（0〜1）→ Three.js（-1〜+1）
4. **応用**としてジェスチャー認識やインタラクティブ作品が作れる

ぜひコードを改造して、オリジナルの作品を作ってみてください！
