# Measurements REST API Documentation

This API provides functionalities for reading historical measurements. Below are the details of each endpoint.

### 1. Fetch measurements for a given node

**URL**: `/api/measurements/node/<node_id>`
**Method**: `GET`

#### Request

**Description**: This endpoint is used for fetching measurements for a given node.

- **Query Parameters**:
  - `startDate`: Start time of the measurements (optional), format: `YYYY-MM-DDTHH:mm:ss`, default: 1 week ago
  - `endDate`: End time of the measurements (optional), format: `YYYY-MM-DDTHH:mm:ss`, default: now

#### Response

- When the node_id is correct and there are measurements for the given node:

  - **Status Code**: 200
  - **Body**:

    ```json
    {
      "success": true,
      "msg": "Measurements for node ${node_id}",
      "measurements": [
        {
          "id": "", // string, (unique identifier of the measurement)
          "nodeId": "", // string, (unique identifier of the node)
          "batteryLevel": 5.5, // float (Battery level in volts)
          "temperature": 25.5, // float (Temperature in Celsius)
          "humidity": 70.5, // float (Humidity in percentage)
          "pressure": 1013.25, // float (Pressure in hPa)
          "snowDepth": 42.0, // float (Snow depth in cm)
          "pm1": 10.0, // float (PM1 in µg/m³)
          "pm25": 25.0, // float (PM2.5 in µg/m³)
          "pm10": 50.0, // float (PM10 in µg/m³)
          "created": "YYYY-MM-DDTHH:mm:ss" // string - timestamp of the sensor data",    // string (Date and time of the measurement)
        },
        {
          "id": "", // string, (unique identifier of the measurement)
          "nodeId": "", // string, (unique identifier of the node)
          "batteryLevel": 5.5, // float (Battery level in volts)
          "temperature": 25.5, // float (Temperature in Celsius)
          "humidity": 70.5, // float (Humidity in percentage)
          "pressure": 1013.25, // float (Pressure in hPa)
          "snowDepth": 42.0, // float (Snow depth in cm)
          "pm1": 10.0, // float (PM1 in µg/m³)
          "pm25": 25.0, // float (PM2.5 in µg/m³)
          "pm10": 50.0, // float (PM10 in µg/m³)
          "created": "YYYY-MM-DDTHH:mm:ss" // string - timestamp of the sensor data",    // string (Date and time of the measurement)
        }
      ]
    }
    ```

    - When there are no measurements for the given node:

      - **Status Code**: 200
      - **Body**:

        ```json
        {
          "success": true,
          "msg": "Measurements for Node ID: ${id}",
          "measurements": []
        }
        ```

    - When the node_id is incorrect:
      - **Status Code**: 404
      - **Body**:
        ```json
        {
          "success": false,
          "message": "Node ID: ${id} not found"
        }
        ```
    - When the measurements aren't found for other reasons:

      - **Status Code**: 404
      - **Body**:

        ```json
        {
          "success": false,
          "message": "Measurements not found"
        }
        ```

    - When the request path is invalid:

      - **Status Code**: 400
      - **Body**:

        ```json
        {
          "success": false,
          "message": "Invalid request path"
        }
        ```

    - When there's an internal server error:

      - **Status Code**: 500
      - **Body**:

        ```json
        {
          "success": false,
          "message": "Error retrieving measurements"
        }
        ```

### 2. Fetch measurements from nodes connected to a given gateway

**URL**: `/api/measurements/gateway/<gateway_id>`
**Method**: `GET`

#### Request

**Description**: This endpoint is used for fetching measurements from all nodes connected to that gateway.

- **Query Parameters**:
  - `startDate`: Start time of the measurements (optional), format: `YYYY-MM-DDTHH:mm:ss`, default: 1 week ago
  - `endDate`: End time of the measurements (optional), format: `YYYY-MM-DDTHH:mm:ss`, default: now

#### Response

- When the gateway_id is correct and there are measurements for the given gateway:

  - **Status Code**: 200
  - **Body**:

    ```json
    {
      "success": true,
      "msg": "Measurements for gateway ${gateway_id}",
      "measurements": [
        {
          "id": "", // string, (unique identifier of the measurement)
          "nodeId": "", // string, (unique identifier of the node)
          "batteryLevel": 5.5, // float (Battery level in volts)
          "temperature": 25.5, // float (Temperature in Celsius)
          "humidity": 70.5, // float (Humidity in percentage)
          "pressure": 1013.25, // float (Pressure in hPa)
          "snowDepth": 42.0, // float (Snow depth in cm)
          "pm1": 10.0, // float (PM1 in µg/m³)
          "pm25": 25.0, // float (PM2.5 in µg/m³)
          "pm10": 50.0, // float (PM10 in µg/m³)
          "created": "YYYY-MM-DDTHH:mm:ss" // string (Date and time of the measurement)
        },
        {
          "id": "", // string, (unique identifier of the measurement)
          "nodeId": "", // string, (unique identifier of the node)
          "batteryLevel": 5.5, // float (Battery level in volts)
          "temperature": 25.5, // float (Temperature in Celsius)
          "humidity": 70.5, // float (Humidity in percentage)
          "pressure": 1013.25, // float (Pressure in hPa)
          "snowDepth": 42.0, // float (Snow depth in cm)
          "pm1": 10.0, // float (PM1 in µg/m³)
          "pm25": 25.0, // float (PM2.5 in µg/m³)
          "pm10": 50.0, // float (PM10 in µg/m³)
          "created": "YYYY-MM-DDTHH:mm:ss" // string (Date and time of the measurement)
        }
      ]
    }
    ```

    - When there are no measurements for the given gateway:
      - **Status Code**: 200
      - **Body**:
        ```json
        {
          "success": true,
          "msg": "Measurements for Gateway ID: ${id}",
          "measurements": []
        }
        ```
    - When the node_id is incorrect:
      - **Status Code**: 404
      - **Body**:
        ```json
        {
          "success": false,
          "message": "Gateway ID: ${id} not found"
        }
        ```
    - When the measurements aren't found for other reasons:
      - **Status Code**: 404
      - **Body**:
        ```json
        {
          "success": false,
          "message": "Measurements not found"
        }
        ```
    - When the request path is invalid:
      - **Status Code**: 400
      - **Body**:
        ```json
        {
          "success": false,
          "message": "Invalid request path"
        }
        ```
    - When there's an internal server error:
      - **Status Code**: 500
      - **Body**:
        ```json
        {
          "success": false,
          "message": "Error retrieving measurements"
        }
        ```
