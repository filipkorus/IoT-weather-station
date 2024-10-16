#include <Arduino.h>
#include <FastLED.h>
#include <RadioLib.h>

#define NUM_LEDS 1
#define DATA_PIN 0
CRGB leds[NUM_LEDS];

void setup()
{
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS);
  leds[0] = CRGB::Black;
  FastLED.show();

  SPI.begin(5, 19, 27, 17);
  SX1272 radio = new Module(17, 23, 18, 22);

  radio.begin();
}

void loop()
{
}
