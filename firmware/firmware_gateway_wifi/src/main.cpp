#include <Arduino.h>
#include <WiFi.h>
#include <esp_wifi.h>
#include <WiFiManager.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <GlobalVar.h>
#include <WebSocketsClient.h>
#include <LiquidCrystal_I2C.h>
#include <EEPROM.h>

#define USE_SERIAL Serial
WebSocketsClient webSocket;
LiquidCrystal_I2C lcd(0x27, 12, 2);

#define BUTTON_PIN 15

#define NODE_ID_SIZE 16
#define NUM_NODES 10
const int EEPROM_SIZE = NUM_NODES * NODE_ID_SIZE + 1;

// Function to read a Node ID from EEPROM at a given index
void readNodeID(int index, char *buffer)
{
  int offset = index * NODE_ID_SIZE + 1; // Calculate offset
  for (int i = 0; i < NODE_ID_SIZE; ++i)
  {
    EEPROM.get(offset + i, buffer[i]); // Read Node ID byte by byte
  }
}

void saveNodeID(int index, const char *nodeID)
{
  int offset = index * NODE_ID_SIZE + 1; // Calculate offset based on Node ID size
  for (int i = 0; i < NODE_ID_SIZE; ++i)
  {
    EEPROM.put(offset + i, nodeID[i]);
  }
  EEPROM.commit(); // Save changes to EEPROM

  Serial.print("Paired: ");
  Serial.println(nodeID);
}

void saveNextNodeID(const char *nodeID)
{
  int nextIndex = EEPROM.read(0);
  saveNodeID(nextIndex + 1, nodeID);
  EEPROM.put(0, nextIndex + 1);
  EEPROM.commit();
}

// Function to search for a Node ID in EEPROM, returns the index if found, or -1 if not found
int searchNodeID(const char *nodeIDToSearch)
{
  char buffer[NODE_ID_SIZE] = {0}; // Temporary buffer to store Node ID during comparison

  for (int i = 0; i < NUM_NODES; ++i)
  {
    readNodeID(i, buffer); // Read Node ID from EEPROM
    if (strncmp(buffer, nodeIDToSearch, NODE_ID_SIZE) == 0)
    {
      return i; // Match found, return index
    }
  }

  return -1; // Node ID not found
}

void resetEEPROM()
{
  for (int i = 0; i < EEPROM_SIZE; i++)
  {
    EEPROM.put(i, 0);
  }
  EEPROM.commit();
}

float hum = 0.f;
float temp = 0.f;
int likes = 0;
void updateLCD()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Likes: ");
  lcd.print(likes);
  lcd.setCursor(0, 1);
  lcd.printf("Temp: %.1f*C", temp);
}
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

    if (strcmp(doc["gatewayId"], UID) != 0)
    {
      Serial.println("tak sie nie robi");
      return;
    }

    if (strcmp(doc["type"], "likes") == 0)
    {
      Serial.println("[Comm] Init frame received");
      likes = doc["likes"].as<int>();
      updateLCD();
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
      lcd.print("Pairing code: ");
      lcd.setCursor(0, 1);
      lcd.print(pairingCode);
    }
    else
    {
      const char *username = doc["username"].as<const char *>();

      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Hello ");
      lcd.print(username);
      lcd.setCursor(0, 1);
      lcd.print("nodes: ");
      uint8_t nextIndex;
      EEPROM.get(0, nextIndex);
      Serial.print("nextIndex ");
      Serial.println(nextIndex);
      lcd.print(nextIndex);
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

  if (!EEPROM.begin(EEPROM_SIZE))
  {
    Serial.println("Failed to initialize EEPROM");
    return;
  }

  pinMode(BUTTON_PIN, INPUT_PULLUP);

  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.clear();
  lcd.print("Waiting");
  lcd.setCursor(0, 1);
  lcd.print("for WiFi");
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
  lcd.print("Connected");
  lcd.setCursor(0, 1);
  lcd.print("to WiFi");

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

uint8_t resetCount = 6;
bool pairMode = false;
String receivedMessage = "";

void loop()
{
  if (!digitalRead(BUTTON_PIN))
  {
    resetCount--;
    if (resetCount >= 5)
    {
      lcd.clear();
      lcd.print("pair mode");
    }
    else
    {
      lcd.clear();
      lcd.print("reset in: ");
      lcd.print(resetCount);
      lcd.print(" s");
    }

    delay(1000);
    if (resetCount <= 0)
    {
      Serial.println("reset");
      resetEEPROM();
      int nextIndex = EEPROM.read(0);
      Serial.println(nextIndex);
      if (nextIndex == 0)
      {
        lcd.clear();
        lcd.print("reset OK");
        delay(3000);
        ESP.restart();
      }
    }
    return;
  }
  else
  {
    if (resetCount == 5)
    {
      pairMode = true;
      Serial.println("pair mode");
    }
    resetCount = 6;
  }

  webSocket.loop();
  // delay(2000);

  // Check if data is available in the Serial buffer
  while (Serial2.available())
  {
    DynamicJsonDocument doc(2048);
    char incomingChar = Serial2.read(); // Read each character from the buffer

    if (incomingChar == '\n')
    { // Check if the user pressed Enter (new line character)
      // Print the message
      deserializeJson(doc, receivedMessage);

      auto nodeId = doc["nodeId"].as<const char *>();
      auto pair = doc["pair"].as<bool>();
      Serial.print(nodeId);
      Serial.print(" pair?: ");
      Serial.println(pair);
      Serial.println(receivedMessage);

      if (pairMode && pair)
      {
        saveNextNodeID(nodeId);
        lcd.clear();
        lcd.print("Paired: ");
        lcd.setCursor(0, 1);
        lcd.print(nodeId);
        pairMode = false;
        delay(2000);
        updateLCD();
      }

      if (searchNodeID(nodeId) == -1)
      {
        Serial.println("Tak sie nie robi");
        receivedMessage = "";
        return;
      }

      webSocket.sendTXT(receivedMessage);
      hum = doc["humidity"].as<float>();
      temp = doc["temperature"].as<float>();
      updateLCD();
      // Clear the message buffer for the next input
      receivedMessage = "";
    }
    else
    {
      // Append the character to the message string
      receivedMessage += incomingChar;
    }
  }
}