# Web Browser Client WebSocket API Documentation

This API provides functionalities for the web browser client WebSocket server. Below are the details of each type of message.

Every client trying to connect without an API key in the `Authorization` header, is assumed to be a web browser client.

### 1. Receiving live sensor data (from the Server, to the Web Browser Client)

**Description**: Sends live sensor data to the web browser client.

**JSON Body**:
```json
{
  "type": "sensors-to-client",
  "gatewayId": "Grrrrmmdd(00-FF)", // string (Gateway ID)
  "nodeId": "Nrrrrmmdd(00-FF)",    // string (Node ID)
  "sensorData": {
    "batteryLevel":  5.5,   // float (Battery level in volts)
    "temperature": 25.5,    // float (Temperature in Celsius)
    "humidity":  70.5,      // float (Humidity in percentage)
    "pressure": 1013.25,    // float (Pressure in hPa)
    "snowDepth":  42.0,     // float (Snow depth in cm)
    "pm1": 10.0,            // float (PM1 in µg/m³)
    "pm25":  25.0,          // float (PM2.5 in µg/m³)
    "pm10": 50.0,            // float (PM10 in µg/m³)
    "created": "2024-11-13T15:41:34.588Z" // string - timestamp of the sensor data",    // string (Date and time of the measurement)
  }
}
```

### 2. Sending 'like' (from the Web Browser Client, to the Server)

**Description**: Sends the like to the server.

**Request JSON Body**:
```json
{
  "type": "likes",
  "gatewayId": "Grrrrmmdd(00-FF)" // string (Gateway ID)
}
```

**Response JSON Body**:
- If the like was successfully sent (FYI: one like from one `(IP address, User Agent)` pair per day per each Gateway is allowed):
```json
{
  "type": "likes",
  "gatewayId": "Grrrrmmdd(00-FF)", // string (Gateway ID)
  "likes":  10 // integer (Like count)
}
```

- Else, if the like was not successful - e.g., the user has already liked:
```json
{
  "type": "likes-error-response",
  "error": true,
  "gatewayId": "Grrrrmmdd(00-FF)", // string (Gateway ID)
  "message": "You have already liked" // string (Error message)
}
```

### 3. Sending 'remove like' request (from the Web Browser Client, to the Server)

**Description**: Sends the 'remove like' request to the server.

**Request JSON Body**:
```json
{
  "type": "dislike",
  "gatewayId": "Grrrrmmdd(00-FF)" // string (Gateway ID)
}
```

**Response JSON Body**:
- If the request was successful and the like was removed:
```json
{
  "type": "likes",
  "gatewayId": "Grrrrmmdd(00-FF)", // string (Gateway ID)
  "likes":  9 // integer (Like count)
}
```

- Else, if the request was not successful - e.g., the user has not liked yet:
```json
{
  "type": "dislike-error-response",
  "error": true,
  "gatewayId": "Grrrrmmdd(00-FF)", // string (Gateway ID)
  "message": "You have not liked yet" // string (Error message)
}
```
