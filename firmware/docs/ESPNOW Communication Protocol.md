# Frame struct

```C++
typedef struct struct_message
{
    char nodeId[16];
    float batteryLevel; // volts
    float temperature;  // °C
    float humidity;     // %
    float pressure;     // hPa
    int32_t snowDepth;  // cm
    uint32_t pm1;       // ug/m³
    uint32_t pm25;      // ug/m³
    uint32_t pm10;      // ug/m³
    bool pair;
} struct_message;
```
