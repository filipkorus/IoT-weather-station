# Authentication REST API Documentation

This API provides authentication functionalities such as user registration, login, refresh token generation, and logout. Below are the details of each endpoint.

### 1. Register a New User

**URL**: `/api/auth/register`  
**Method**: `POST`

#### Request
**Description**: Registers a new user with a username and password.

- **Body Parameters**:
  ```json
  {
    "username": "string (required, max 255 characters)",
    "password": "string (required, min 6 characters, max 255 characters)"
  }
  ```
#### Response
- **Status Code**: `201 Created`
  ```json
    {
      "message": "Account successfully created."
    }
  ```
  - **Status Code**: `400 Bad Request`
    ```json
      {
          "message": "Missing or invalid body fields.",
          "errors": {
              "username": ["error message"],
              "password": ["error message"]
          }
      }
    ```
- **Status Code**: `409 Conflict`
  ```json
    {
      "message": "Account with given username already exists."
    }
  ```
- **Status Code**: `500 Internal Server Error`
  ```json
    {
      "message": "Error: try again later."
    }
  ```

### 2. User Login

**URL**: `/api/auth/login`  
**Method**: `POST`

#### Request
**Description**: Logs in an existing user using their username and password. Sets the refresh token in an HTTP-only cookie and returns an access token.

- **Body Parameters**:
  ```json
  {
    "username": "string (required, max 255 characters)",
    "password": "string (required, min 6 characters, max 255 characters)"
  }
  ```
#### Response
- **Status Code**: `200 OK`
```json
  {
    "message": "Logged in successfully.",
    "data": {
      "token": "string (access token)",
      "user": {
        "id": "number",
        "username": "string",
        "joined": "string (date)"
      }
    }
  }
```
- **Status Code**: `400 Bad Request`
```json
  {
    "message": "Missing or invalid body fields.",
    "errors": {
      "username": ["error message"],
      "password": ["error message"]
    }
}
```
- **Status Code**: `401 Unauthorized`
```json
  {
    "message": "Invalid username or password."
  }
```
- **Status Code**: `500 Internal Server Error`
```json
  {
    "message": "Error: try again later."
  }
```
### 3. Refresh Access Token

**URL**: `/api/auth/refresh`
**Method**: `POST`

#### Request
**Description**: Generates a new access token using the refresh token stored in the HTTP-only cookie.

No request body is required because the refresh token is sent in the cookie.

#### Response
- **Status Code**: `200 OK`
```json
  {
    "message": "Access token refreshed.",
    "data": {
      "token": "string (new access token)"
    }
  }
```
- **Status Code**: `401 Unauthorized`
```json
  {
    "message": "Invalid, expired or missing refresh token."
  }
```

### 4. User Logout

**URL**: `/api/auth/logout`
**Method**: `POST`

#### Request
**Description**: Logs out the user by clearing the refresh token stored in the HTTP-only cookie.

No request body is required because the refresh token is sent in the cookie.

This endpoint requires the user to be logged in, i.e. have a valid access token in the Authorization header (`Bearer accesstoken`).

#### Response
- **Status Code**: `200 OK`
```json
  {
    "message": "Logged out successfully."
  }
```
- **Status Code**: `500 Internal Server Error`
```json
  {
    "message": "Error: try again later."
  }
```

### 5. Get User Details

**URL**: `/api/user`
**Method**: `GET`

#### Request
**Description**: Retrieves the details of the currently logged-in user.

This endpoint requires the user to be logged in, i.e. have a valid access token in the Authorization header (`Bearer accesstoken`).

#### Response
- **Status Code**: `200 OK`
```json
  {
    "message": "User details retrieved.",
    "data": {
      "id": "number",
      "username": "string",
      "joined": "string (date)"
    }
  }
```
