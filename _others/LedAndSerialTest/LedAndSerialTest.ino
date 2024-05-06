int btnPin = 2;
int ledPin = 13;

int btnStatus = HIGH;

void setup() {
  // シリアルのセットアップ
  Serial.begin(9600);
  // 各ピンのセットアップ
  pinMode(btnPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
}

void loop() {

  // ボタンの状態確認
  int b = digitalRead(btnPin);
  if (b != btnStatus) {
    btnStatus = b;
    if (btnStatus == HIGH) {
      Serial.println(LOW);
      digitalWrite(ledPin, LOW);
    } else {
      Serial.println(HIGH);
      digitalWrite(ledPin, HIGH);
    }
  }

  // シリアルを読み込んでLEDのON/OFF制御
  if (Serial.available() > 0) {
    int input = Serial.read();
    if (input == 'd') {
        digitalWrite(ledPin, HIGH);
    } else if (input == 'u') {
        digitalWrite(ledPin, LOW);
    }

//    // 送信テスト
//    if (input == '1') {
//      Serial.print('1');
//    } else if (input == '2') {
//      Serial.print('2');
//    }
  }

//  Serial.println("test");
//  delay(2000);
  //
  delay(10);
}
