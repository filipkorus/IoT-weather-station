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
#include <DFRobot_AirQualitySensor.h>

Adafruit_BME280 bme;
LIDARLite myLidar;
DFRobot_AirQualitySensor particle(&Wire , 0x19);


void readMacAddress(){
  uint8_t baseMac[6];
  esp_err_t ret = esp_wifi_get_mac(WIFI_IF_STA, baseMac);
  if (ret == ESP_OK) {
    Serial.printf("%02x:%02x:%02x:%02x:%02x:%02x\n",
                  baseMac[0], baseMac[1], baseMac[2],
                  baseMac[3], baseMac[4], baseMac[5]);
  } else {
    Serial.println("Failed to read MAC address");
  }
}

uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF}; //wpisac tu mac address 

// Define variables to store BME280 readings to be sent
float temperature;
float humidity;
float pressure;
float distance;

// Variable to store if sending data was successful
String success;

//Structure example to send data
//Must match the receiver structure
typedef struct struct_message {
    float temp;
    float hum;
    float pres;
    float dist;
    float pm1;
    float pm10;
    gloat pm25;
} struct_message;

// Create a struct_message called BME280Readings to hold sensor readings
struct_message Readings;

esp_now_peer_info_t peerInfo;

// Callback when data is sent
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  Serial.print("\r\nLast Packet Send Status:\t");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");
  if (status ==0){
    success = "Delivery Success :)";
  }
  else{
    success = "Delivery Fail :(";
  }
}

 
void setup() {
  // Init Serial Monitor
  Serial.begin(115200);

  // Init BME280 sensor
  bool status = bme.begin(0x76);  
  if (!status) {
    Serial.println("Could not find a valid BME280 sensor, check wiring!");
    while (1);
  }
 
  // Init LIDAR
  myLidar.begin(0, true);


  // Init AirQuailitySensor
  particle.begin()

  // Set device as a Wi-Fi Station
  WiFi.mode(WIFI_STA);

  // Init ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  // Once ESPNow is successfully Init, we will register for Send CB to
  // get the status of Trasnmitted packet
  esp_now_register_send_cb(OnDataSent);
  
  // Register peer
  memcpy(peerInfo.peer_addr, broadcastAddress, 6);
  peerInfo.channel = 0;  
  peerInfo.encrypt = false;
  
  // Add peer        
  if (esp_now_add_peer(&peerInfo) != ESP_OK){
    Serial.println("Failed to add peer");
    return;
  }

  
}
 
void getReadings(){
  temperature = bme.readTemperature();
  humidity = bme.readHumidity();
  pressure = (bme.readPressure() / 100.0F);
  distance = myLidar.distance(true, 0x62);
  uint16_t pm1value = particle.gainParticleConcentration_ugm3(PARTICLE_PM1_0_STANDARD);
  uint16_t pm10value = particle.gainParticleConcentration_ugm3(PARTICLE_PM10_STANDARD);
  uint16_t pm25value = particle.gainParticleConcentration_ugm3(PARTICLE_PM2_5_STANDARD);
}

void loop() {
  getReadings();
 
  // Set values to send
  Readings.temp = temperature;
  Readings.hum = humidity;
  Readings.pres = pressure;

  //lidar distance
  Readings.dist = distance;

 // pm values - airQualitySensor
  Readings.pm1 = pm1value;
  Readings.pm10 = pm10value;
  REadings.pm25 = pm25value;

  Serial.println(myLidar.distance());

  // Send message via ESP-NOW
  esp_err_t result = esp_now_send(broadcastAddress, (uint8_t *) &Readings, sizeof(Readings));
   
  if (result == ESP_OK) {
    Serial.println("Sent with success");
  }
  else {
    Serial.println("Error sending the data");
  }

}




