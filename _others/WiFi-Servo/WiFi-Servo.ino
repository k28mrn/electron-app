#include <M5StickCPlus.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>
#include <ArduinoOSCWiFi.h>

#define BTN_A_PIN 37
#define BTN_ON  LOW
#define BTN_OFF HIGH

const char* ssid     = "STARRYWORKS-02";
const char* password = "guest0707";

const IPAddress gateway(10, 0, 0, 1);
const IPAddress subnet(255, 255, 255, 0);
const IPAddress ip(10, 0, 0, 70);
Servo servo1; // create four servo objects 


int pos = 0;      // position in degrees
int  target = 0;
float current = 0;

//送受信ポート
const int port = 10000;
//送信先IP
const char* host = "10.0.0.255";

uint8_t btn_a = BTN_OFF;
uint8_t prev_btn_a = BTN_OFF;

void setup() {
  Serial.begin(115200);
  // setup m5
  M5.begin();
  pinMode(BTN_A_PIN, INPUT_PULLUP);
  
  M5.Lcd.setTextSize(2);
  WiFi.begin(ssid, password);
  WiFi.config(ip, gateway, subnet);
  
  M5.Lcd.println("Connecting WiFi.. .");
  // connect WiFi
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
  }
  M5.Lcd.println("Connected!");
  M5.Lcd.println(WiFi.localIP());
  
  servo1.setPeriodHertz(50);    // 周波数設定（一般的なRCサーボは50Hz）
  servo1.attach(26, 500, 2400); // サーボ設定（端子番号, 最小角度Dutyパルス幅μs, 最大角度Dutyパルス幅μs）

  OscWiFi.subscribe(port, "/m5/servo", onOscReceivedStatus);
  M5.Lcd.println("Setup End");
}

/**
 * 受信 : デバイスステータス
 */
void onOscReceivedStatus(OscMessage& m) {
  float val = m.arg<float>(0);
  if (val <= 0) val = 0;
  else if (val >= 1) val = 1;
  target = ceil(val * 180);
//  Serial.print("onOscReceivedStatus : ");
//  Serial.print(val);
//  Serial.print("/ target = ");  
//  Serial.println(target);  
}
void loop() {
  OscWiFi.update();
  btn_a = digitalRead(BTN_A_PIN);

  if(prev_btn_a == BTN_OFF && btn_a == BTN_ON){
    Serial.println(host);
    Serial.println("On");
    OscWiFi.send(host, port, "/m5/button", 1);
  }

  if(prev_btn_a == BTN_ON && btn_a == BTN_OFF){
    Serial.println("Off");
    OscWiFi.send(host, port, "/m5/button", 0);
  }
    
  if (target != current) {
    if (target < current) current--;
    else current++;
    Serial.print("current = ");
    Serial.print(current);
    Serial.print("/ target = ");
    Serial.println(target);
    servo1.write(current);
    delay(2);
  }

  prev_btn_a = btn_a;
}
