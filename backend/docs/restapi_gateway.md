# Gateway REST API Documentation

This API provides functionalities for managing gateways and their associated devices. Below are the details of each endpoint.

### 1. Fetch Gateway Pairing Code (to the Gateway)

**URL**: `/api/gateway/init`
**Method**: `POST`

#### Request
**Description**: This endpoint is used by a gateway device to initialize its pairing process. It generates or returns an existing pairing code if the gateway is not already paired with a user.

No request body is required because the gateway's API key is sent in the authorization header.

#### Response
- **Status Code**: `200 OK` is returned if the gateway is successfully initialized.
  ```json
  {
    "username": "string (username of the gateway owner)"
  }
  ```
- **Status Code**: `403 Forbidden` is returned if the gateway is not paired yet but the pairing code has been created.
  ```json
  {
    "pairingCode": "string (6-digit pairing code)"
  }
  ```
- **Status Code**: `500 Internal Server Error` is returned if the owner of the gateway is not found.
  ```json
    {
      "message": "Server Error: User owning gateway (id={gatewayId}) not found"
    }
  ```
- **Status Code**: `500 Internal Server Error` is returned if the pairing code could not be generated.
  ```json
    {
      "message": "Server Error: Pairing code could not be created"
    }
  ```
  
### 2. Insert Gateway Pairing Code (from the User)

**URL**: `/api/gateway/pariring-code`
**Method**: `POST`

#### Request
**Description**: This endpoint is used by a user to pair a gateway device with their account. The user must provide the 6-digit pairing code displayed on the gateway device.

This endpoint requires the user to be logged in, i.e. have a valid access token in the Authorization header (`Bearer accesstoken`).

- **Body Parameters**:
  ```json
  {
    "pairingCode": "string (6-digit pairing code inserted by the user)"
  }
  ```
  
#### Response
- **Status Code**: `200 OK` is returned if the gateway is successfully paired with the user.
  ```json
  {
    "message": "Gateway paired"
  }
  ```
- **Status Code**: `400 Bad Request` is returned if the `pairingCode` body field is missing or invalid.
  ```json
  {
    "message": "Missing or invalid body fields.",
    "errors": {
      "pairingCode": ["error message"]
    }
  }
  ```
- **Status Code**: `404 Not Found` is returned if the pairing code is invalid or the gateway is already paired or does not exist.
  ```json
  {
    "message": "Invalid pairing code"
  }
  ```
- **Status Code**: `500 Internal Server Error` is returned if the gateway could not be paired due to a server error.
  ```json
  {
    "message": "Server Error: Gateway could not be paired"
  }
  ```

### 3. Fetch Gateway Details

**URL**: `/api/gateway/:gatewayId`
**Method**: `GET`

#### Request
**Description**: This endpoint is used to fetch the details of a gateway device when gateway ID is provided. Else, it returns the details of all gateways associated with the logged user.

This endpoint requires the user to be logged in, i.e. have a valid access token in the Authorization header (`Bearer accesstoken`).

#### Response
- When `gatewayId` is provided:
  - **Status Code**: `200 OK` is returned if the gateway details are successfully fetched.
  ```json
  {
    "gateway": {
        "id": "string (gateway ID)",
        "name": "string (gateway name)",
        "isPaired": "boolean (gateway pairing status)",
        "isOnline": "boolean (gateway online status)",
        "lastOnline": "string (last online timestamp)",
        "userId": "string (user ID of the gateway owner)",
        "nodes": [{
            "id": "string (node ID)",
            "name": "string (node name)",
            "gatewayId": "string (gateway ID)"
        }]
    }
  }
  ```
    - **Status Code**: `404 Not Found` is returned if the gateway is not found.
    ```json
    {
        "message": "Gateway (id={gatewayId}) not found"
    }
    ```
- When `gatewayId` is not provided:
  - **Status Code**: `200 OK` is returned if gateways details are successfully fetched.
  ```json
  {
    "gateways": [{
        "id": "string (gateway ID)",
        "name": "string (gateway name)",
        "isPaired": "boolean (gateway pairing status)",
        "isOnline": "boolean (gateway online status)",
        "lastOnline": "string (last online timestamp)",
        "userId": "string (user ID of the gateway owner)",
        "nodes": [{
            "id": "string (node ID)",
            "name": "string (node name)",
            "gatewayId": "string (gateway ID)"
        }]
    }]
  }
  ```
    - **Status Code**: `500 Internal Server Error` is returned if the server could not fetch the gateways.
    ```json
    {
        "message": "Server Error: Gateways could not be retrieved"
    }
    ```
  
### 4. Fetch Gateway Public Details

**URL**: `/api/public-gateway/:gatewayId`
**Method**: `GET`

#### Request
**Description**: This endpoint is used to fetch the public details of a gateway device when gateway ID is provided. Else, it returns the public details of all gateways.

This endpoint does not require to be logged in.

#### Response
- When `gatewayId` is provided:
  - **Status Code**: `200 OK` is returned if gateways public details are successfully fetched.
  ```json
  {
    "gateway": {
        "id": "string (gateway ID)",
        "name": "string (gateway name)",
        "isPaired": "boolean (gateway pairing status)",
        "isOnline": "boolean (gateway online status)",
        "lastOnline": "string (last online timestamp)",
        "userId": "string (user ID of the gateway owner)",
        "nodes": [{
            "id": "string (node ID)",
            "name": "string (node name)",
            "gatewayId": "string (gateway ID)"
        }],
        "likes": "number (number of likes)"
    }
  }
  ```
  - **Status Code**: `404 Not Found` is returned if the gateway is not found.
    ```json
    {
        "message": "Gateway (id=${gatewayId}) not found"
    }
    ```
- When `gatewayId` is not provided:
    - **Status Code**: `200 OK` is returned if gateways public details are successfully fetched.
    ```json
    {
        "gateways": [{
            "id": "string (gateway ID)",
            "name": "string (gateway name)",
            "isPaired": "boolean (gateway pairing status)",
            "isOnline": "boolean (gateway online status)",
            "lastOnline": "string (last online timestamp)",
            "userId": "string (user ID of the gateway owner)",
            "nodes": [{
                "id": "string (node ID)",
                "name": "string (node name)",
                "gatewayId": "string (gateway ID)"
            }],
            "likes": "number (number of likes)"
        }]
    }
    ```
    - **Status Code**: `500 Internal Server Error` is returned if the server could not fetch the gateways.
    ```json
    {
        "message": "Server Error: Gateways could not be retrieved"
    }
    ```
  