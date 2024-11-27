# Connection to backend

All frames will have a special key to auth on the backend side.

Node ID (unique serial number): N*rrrrmmdd(00-FF)*

Gateway ID (unique serial number): G*rrrrmmdd(00-FF)*

The gateway initialises the connection by sending the `Init Frame`. If the gateway is not paired to any account, the backend returns the pairing code, which the gateway displays on the LCD screen.

The user enters the code on the website to pair it with his account. After the gateway restarts, it sends the `Init frame` again. The backend returns user data, and then the gateway starts the WS connection.

The user can pair nodes with the gateway with the button located on the case. A node sends his NID number via ESP-NOW to the gateway. The gateway saves this NID to EEPROM as a trusted node.

The gateway sends a frame via WS containing sensor data and node serial number to the backend. The backend will create a node object if it does not exist, then log data from sensors.

Node object contains also `last_message` and `battery_level` used to check if the node is alive.

### `POST` Init Frame:

##### Request:

    {
    	uid: *GatewayId*
    }

##### Response:

If not paired:
Status: `403`

    {
    	pair_code: *6 char code*
    }

If paired:
Status: `200`

    {
    	user_name: *Name of the user*
    }

### `WS` Data Frame:

#### Gateway to backend:

    {
    	type: 'sensors'
    	node_id:
    	battery_level: 5-8,4 (V)
    	temperature: -5.5 (*C)
    	humidity: 50 (0-100%)
    	pressure: 1010 (hPa)
    	snow_depth: 50 (cm)
    	pm1: ?
    	pm25: ?
    	pm10: ?
    }

#### Backend to Gateway:

    {
    	type: 'likes'
    	likes: *int*
    }
