#include <Arduino.h>
#include <WiFi.h>
#include <esp_wifi.h>
#include <WiFiManager.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <GlobalVar.h>
#include <WebSocketsClient.h>
#include <LiquidCrystal_I2C.h>

#define USE_SERIAL Serial
WebSocketsClient webSocket;
LiquidCrystal_I2C lcd(0x27, 12, 2);

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length)
{
  DynamicJsonDocument doc(1024);
  switch (type)
  {
  case WStype_DISCONNECTED:
    USE_SERIAL.printf("[WSc] Disconnected!\n");
    break;
  case WStype_CONNECTED:
    USE_SERIAL.printf("[WSc] Connected to url: %s\n", payload);
    break;

  case WStype_TEXT:
    USE_SERIAL.printf("[WSc] get text: %s\n", payload);

    deserializeJson(doc, payload);

    if (strcmp(doc["type"], "likes") == 0)
    {
      Serial.println("[Comm] Init frame received");
      auto likes = doc["likes"].as<int>();
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Likes: ");
      lcd.setCursor(0, 1);
      lcd.print(likes);
    }

    break;
  case WStype_BIN:
  case WStype_ERROR:
  case WStype_FRAGMENT_TEXT_START:
  case WStype_FRAGMENT_BIN_START:
  case WStype_FRAGMENT:
  case WStype_FRAGMENT_FIN:
    break;
  }
}

void WebSocketInit()
{
  Serial.println("[Comm] Connecting to ws backend server...");

#if WSS == true
  webSocket.beginSSL(BACKEND_IP, 443, "/ws");
#else
  webSocket.begin(BACKEND_IP, 80, "/ws");
#endif

  webSocket.onEvent(webSocketEvent);
  webSocket.setAuthorization(AUTH_TOKEN);
  webSocket.loop();

  while (!webSocket.isConnected())
  {
    webSocket.loop();
    delay(10);
  }
}

bool initBackend()
{
  bool success = false;
  HTTPClient http;

  http.begin("https://iot.fkor.us/api/gateway/init"); // Specify the URL
  http.addHeader("Content-Type", "application/json"); // Set content type
  http.addHeader("Authorization", AUTH_TOKEN);

  DynamicJsonDocument jsonBuffer(1024);
  jsonBuffer["uid"] = UID;
  String jsonOutput;
  serializeJson(jsonBuffer, jsonOutput);
  int httpCode = http.POST(jsonOutput); // Make the request

  if (httpCode > 0)
  { // Check for a successful response
    String payload = http.getString();
    Serial.println("HTTP POST request successful");
    Serial.println(payload);

    // Allocate a JSON document for parsing.
    const size_t capacity = JSON_OBJECT_SIZE(10) + 256;
    DynamicJsonDocument doc(capacity);

    // Parse the JSON object.
    DeserializationError error = deserializeJson(doc, payload);
    if (error)
    {
      Serial.print("deserializeJson() failed: ");
      Serial.println(error.c_str());
      return success;
    }

    // Access values from the JSON object, for example:
    success = doc["success"].as<bool>();
    if (!doc["success"])
    {
      const char *pairingCode = doc["pairingCode"].as<const char *>(); // Substitute with your JSON key
      Serial.println(pairingCode);

      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("code: ");
      lcd.setCursor(0, 1);
      lcd.print(pairingCode);
    }
    else
    {
      const char *username = doc["username"].as<const char *>();

      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Hello ");
      lcd.setCursor(0, 1);
      lcd.print(username);
    }
  }
  else
  {
    Serial.print("Error on HTTP request: ");
    Serial.println(httpCode);
  }

  http.end();

  return success;
}

void setup()
{
  WiFi.mode(WIFI_STA);
  Serial.begin(115200);
  Serial2.begin(115200);
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.clear();
  lcd.print("waiting for wifi");
  bool res;
  WiFiManager wm;
  res = wm.autoConnect("esp32", "12345678");

  if (!res)
  {
    Serial.println("Failed to connect");
  }
  else
  {
    Serial.println("connected...yeey :)");
  }

  int channel = WiFi.channel();
  Serial.print("Current Wi-Fi Channel: ");
  Serial.println(channel);

  lcd.clear();
  lcd.print("connected to wifi");

  if (!initBackend())
  {
    Serial.println("displaying pair code");
    for (;;)
    {
      delay(1000);
    }
  }

  WebSocketInit();
}

void loop()
{
  webSocket.loop();
  // delay(2000);
}