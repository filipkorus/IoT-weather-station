# Gateway WebSocket API Documentation

This API provides functionalities for the gateway WebSocket server. Below are the details of each type of message.

Authentication is done using the gateway's API key in the `Authorization` header.

### 1. Sending Node sensor data (from the Gateway, to the Server)

**Description**: Sends sensor data from a node to the server.

**JSON Body**:
```json
{
  "type": "sensors",
  "nodeId": "Nrrrrmmdd(00-FF)", // string (Node ID)
  "batteryLevel":  5.5,   // float (Battery level in volts)
  "temperature": 25.5,    // float (Temperature in Celsius)
  "humidity":  70.5,      // float (Humidity in percentage)
  "pressure": 1013.25,    // float (Pressure in hPa)
  "snowDepth":  42.0,     // float (Snow depth in cm)
  "pm1": 10.0,            // float (PM1 in µg/m³)
  "pm25":  25.0,          // float (PM2.5 in µg/m³)
  "pm10": 50.0,           // float (PM10 in µg/m³)
}
```

### 2. Receiving like count data (from the Server, to the Gateway)

**Description**: Sends the like count data to the gateway.

**JSON Body**:
```json
{
  "type": "likes",
  "gatewayId": "Grrrrmmdd(00-FF)", // string (Node ID)
  "likes":  10 // integer (Like count)
}
```
