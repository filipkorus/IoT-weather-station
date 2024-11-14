#include <Arduino.h>
#include <SPI.h>
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <WiFi.h>
#include <esp_wifi.h>
#include <esp_now.h>
#include <LIDARLite.h>
#include <GlobalVar.h>

Adafruit_BME280 bme;
LIDARLite myLidar;

uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF}; // wpisac tu mac address

// Define variables to store BME280 readings to be sent
float temperature = 0;
float humidity = 0;
float pressure = 0;
float distance = 0;
// Variable to store if sending data was successful
String success;

char col;
unsigned int PMSa1 = 0, PMSa2_5 = 0, PMSa10 = 0, FMHDSa = 0, TPSa = 0, HDSa = 0, PMSb1 = 0, PMSb2_5 = 0, PMSb10 = 0, FMHDSb = 0, TPSb = 0, HDSb = 0;
unsigned int PMS1 = 0, PMS2_5 = 0, PMS10 = 0, FMHDS = 0, TPS = 0, HDS = 0, CR1 = 0, CR2 = 0;
unsigned char buffer_RTT[40] = {}; // Serial buffer; Received Data
char tempStr[15];

// Structure example to send data
// Must match the receiver structure
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

// Create a struct_message called BME280Readings to hold sensor readings
struct_message Readings;

esp_now_peer_info_t peerInfo;

// Callback when data is sent
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status)
{
  Serial.print("\r\nLast Packet Send Status:\t");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");
  if (status == 0)
  {
    success = "Delivery Success :)";
  }
  else
  {
    success = "Delivery Fail :(";
  }
}

void setup()
{
  // Init Serial Monitor
  Serial.begin(115200);
  Serial2.begin(9600);

  // Init BME280 sensor
  bool status = bme.begin(0x77);
  if (!status)
  {
    Serial.println("Could not find a valid BME280 sensor, check wiring!");
    while (1)
      ;
  }

  // Init LIDAR
  myLidar.begin(0, true);
  myLidar.configure(0);

  // Set device as a Wi-Fi Station
  WiFi.mode(WIFI_STA);
  esp_wifi_set_promiscuous(true);                 // Enable promiscuous mode
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE); // Set the specific channel
  esp_wifi_set_promiscuous(false);

  // Init ESP-NOW
  if (esp_now_init() != ESP_OK)
  {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  // Once ESPNow is successfully Init, we will register for Send CB to
  // get the status of Trasnmitted packet
  esp_now_register_send_cb(OnDataSent);

  // Register peer
  memcpy(peerInfo.peer_addr, broadcastAddress, 6);
  peerInfo.channel = 1;
  peerInfo.encrypt = false;

  // Add peer
  if (esp_now_add_peer(&peerInfo) != ESP_OK)
  {
    Serial.println("Failed to add peer");
    return;
  }
}

void getReadings()
{
  temperature = bme.readTemperature();
  humidity = bme.readHumidity();
  pressure = (bme.readPressure() / 100.0F);
  distance = myLidar.distance();
}

void loop()
{
  while (Serial2.available() > 40) // Check whether there is any serial data
  {
    for (int i = 0; i < 40; i++)
    {
      col = Serial2.read();
      buffer_RTT[i] = (char)col;
      delay(2);
    }
    Serial2.flush();
    CR1 = (buffer_RTT[38] << 8) + buffer_RTT[39];
    CR2 = 0;
    for (int i = 0; i < 38; i++)
      CR2 += buffer_RTT[i];

    if (CR1 == CR2) // Check
    {
      PMSa1 = buffer_RTT[10];      // Read PM1 high 8-bit data
      PMSb1 = buffer_RTT[11];      // Read PM1 low 8-bit data
      PMS1 = (PMSa1 << 8) + PMSb1; // PM1 data

      PMSa2_5 = buffer_RTT[12];          // Read PM2.5 high 8-bit data
      PMSb2_5 = buffer_RTT[13];          // Read PM2.5 low 8-bit data
      PMS2_5 = (PMSa2_5 << 8) + PMSb2_5; // PM2.5 data

      PMSa10 = buffer_RTT[14];        // Read PM10 high 8-bit data
      PMSb10 = buffer_RTT[15];        // Read PM10 low 8-bit data
      PMS10 = (PMSa10 << 8) + PMSb10; // PM10 data

      FMHDSa = buffer_RTT[28];        // Read Formaldehyde High 8-bit
      FMHDSb = buffer_RTT[29];        // Read Formaldehyde Low 8-bit
      FMHDS = (FMHDSa << 8) + FMHDSb; // Formaldehyde value
      TPSa = buffer_RTT[30];          // Read Temperature High 8-bit
      TPSb = buffer_RTT[31];          // Read Temperature Low 8-bit
      TPS = (TPSa << 8) + TPSb;       // Temperature value
      HDSa = buffer_RTT[32];          // Read Humidity High 8-bit
      HDSb = buffer_RTT[33];          // Read Humidity Low 8-bit
      HDS = (HDSa << 8) + HDSb;
    }
    else
    {
      Serial.println("checked NOT ok");
      PMS1 = 0;
      PMS2_5 = 0;
      PMS10 = 0;
      // PMS = 0;
      TPS = 0;
      HDS = 0;
    }
  }

  getReadings();

  // Set values to send
  Readings.temperature = temperature;
  Readings.humidity = humidity;
  Readings.pressure = pressure;
  strcpy(Readings.nodeId, UID);

  // lidar distance
  Readings.snowDepth = distance;

  Readings.batteryLevel;

  // pm values - airQualitySensor
  Readings.pm1 = PMS1;
  Readings.pm10 = PMS10;
  Readings.pm25 = PMS2_5;
  Serial.println("TEST PRINT: ");
  Serial.println(temperature);
  Serial.println(humidity);
  Serial.println(pressure);
  Serial.println(distance);
  Serial.println(PMS1);
  Serial.println(PMS10);
  Serial.println(PMS2_5);
  Serial.println();

  // Send message via ESP-NOW
  esp_err_t result = esp_now_send(broadcastAddress, (uint8_t *)&Readings, sizeof(Readings));

  if (result == ESP_OK)
  {
    Serial.println("Sent with success");
  }
  else
  {
    Serial.println("Error sending the data");
  }

  delay(10000);
}
