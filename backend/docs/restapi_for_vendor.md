# Vendor REST API Documentation

This API provides functionalities for the vendor. Below are the details of each endpoint.

### 1. Create a new gateway (and its API key)

**URL**: `/api/gateway`
**Method**: `POST`

#### Request
**Description**: Creates a new gateway and its API key.

This endpoint requires the vendor to be authorized by **his** API key in the Authorization header (without `Bearer` prefix).

- **Body Parameters**:
  ```json
    {
        "gatewayId": "Grrrrmmdd(00-FF)", // string (Gateway ID)
    }
    ```

#### Response
- **Status Code**: `201 Created` is returned if the gateway is created successfully.
    ```json
    {
        "apiKey": "API_KEY", // string (API key for the gateway)
        "gatewayId": "Grrrrmmdd(00-FF)", // string (Gateway ID)
    }
    ```

- **Status Code**: `400 Bad Request` is returned if the gateway ID is invalid.
    ```json
    {
        "message": "Invalid gateway ID",
        "gatewayId": "incorrect ID"
    }
    ```

- **Status Code**: `409 Conflict` is returned if the gateway ID is already taken.
    ```json
    {
        "message": "Gateway with id=${gatewayId} already exists",
        "gatewayId": "Grrrrmmdd(00-FF)" // string (Gateway ID)
    }
    ```


