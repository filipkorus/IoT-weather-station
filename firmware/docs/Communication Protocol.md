# Connection to backend

All frames will have a special key to auth on the backend side.

### `POST` Init Frame:
##### Request:

	{
		uid: *NodeId/MAC*
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
