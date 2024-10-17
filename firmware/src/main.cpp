#include <Arduino.h>
#include <FastLED.h>
#include <Wire.h>
#include <LIDARLite.h>
LIDARLite myLidarLite;

#define NUM_LEDS 1
#define DATA_PIN 0
CRGB leds[NUM_LEDS];

void setup()
{
  Serial.begin(9600);

  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS);
  leds[0] = CRGB::Black;
  FastLED.show();

  Serial.println();

  myLidarLite.begin(0, true);
  myLidarLite.configure(0);
}

void loop()
{
  Serial.println(myLidarLite.distance());

  // Take 99 measurements without receiver bias correction and print to serial terminal
  for (int i = 0; i < 99; i++)
  {
    Serial.println(myLidarLite.distance(false));
  }
}
