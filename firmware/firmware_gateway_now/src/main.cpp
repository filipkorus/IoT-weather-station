#include <Arduino.h>
#include <WiFi.h>
#include <esp_wifi.h>
#include <WiFiManager.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WebSocketsClient.h>
#include <esp_now.h>
#include <LiquidCrystal_I2C.h>

typedef struct struct_message
{
  char nodeId[16];
  float batteryLevel;
  float temperature;
  float humidity;
  float pressure;
  float snowDepth;
  uint32_t pm1;
  uint32_t pm25;
  uint32_t pm10;
} struct_message;

struct_message myData;

void OnDataRecv(const uint8_t *mac_addr, const uint8_t *incomingData, int len)
{
  char macStr[18];
  Serial.print("Packet received from: ");
  snprintf(macStr, sizeof(macStr), "%02x:%02x:%02x:%02x:%02x:%02x",
           mac_addr[0], mac_addr[1], mac_addr[2], mac_addr[3], mac_addr[4], mac_addr[5]);
  Serial.println(macStr);
  memcpy(&myData, incomingData, sizeof(myData));
  Serial.print("Board ID: ");
  Serial.println(myData.nodeId);

  DynamicJsonDocument doc(2048);
  doc["type"] = "sensors";
  doc["nodeId"] = myData.nodeId;
  doc["batteryLevel"] = myData.batteryLevel;
  doc["temperature"] = myData.temperature;
  doc["humidity"] = myData.humidity;
  doc["pressure"] = myData.pressure;
  doc["snowDepth"] = myData.snowDepth;
  doc["pm1"] = myData.pm1;
  doc["pm25"] = myData.pm25;
  doc["pm10"] = myData.pm10;
  char buff[2048];
  serializeJson(doc, buff);
  Serial2.println(buff);
  Serial.println(buff);
}

void setup()
{
  WiFi.mode(WIFI_STA);
  Serial.begin(115200);
  Serial2.begin(115200);

  esp_wifi_set_promiscuous(true);                 // Enable promiscuous mode
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE); // Set the specific channel
  esp_wifi_set_promiscuous(false);                // Disable promiscuous mode

  if (esp_now_init() != ESP_OK)
  {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  esp_now_register_recv_cb(esp_now_recv_cb_t(OnDataRecv));
}

void loop()
{

  // delay(2000);
}
