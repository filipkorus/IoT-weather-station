#!/usr/bin/env node

import { select, confirm, password, input } from "@inquirer/prompts";
import child_process from "child_process";
import "dotenv/config";
import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import axios from "axios";

const CONFIG_PATH = path.join(os.homedir(), ".sosen-cli-config.json");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE = path.join(__dirname, "data.json");
const buildsFolder = path.join(__dirname, "builds");

async function sendPostRequest(url, data, token) {
  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    return response.data.data.gateway.apiKey;
  } catch (error) {
    console.error(
      "Error:",
      error.response?.status,
      error.response?.data || error.message
    );
  }
}

async function copyFirmware(sourceFolder, name) {
  // Check if the builds directory exists, if not, create it
  if (!fs.existsSync(buildsFolder)) {
    console.log(`Creating destination folder: ${buildsFolder}`);
    fs.mkdirSync(buildsFolder, { recursive: true });
  }

  // Define source and destination file paths
  const sourcePath = path.join(
    sourceFolder,
    ".pio/build/esp32dev/firmware.bin"
  );
  const destinationPath = path.join(buildsFolder, name);

  // Check if the firmware exists in the source folder
  if (!fs.existsSync(sourcePath)) {
    console.error(`Error: Firmware file does not exist at ${sourcePath}`);
    process.exit(1);
  }

  // Copy the file from the source to the destination
  try {
    fs.copyFileSync(sourcePath, destinationPath);
    console.log(`Firmware successfully copied to: ${destinationPath}`);
  } catch (err) {
    console.error(`Error copying firmware: ${err.message}`);
    process.exit(1);
  }
}

function getCurrentDate() {
  const now = new Date(); // Get the current date
  const year = now.getFullYear(); // Extract the full 4-digit year
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based, pad with '0' if needed
  const day = String(now.getDate()).padStart(2, "0"); // Pad the day with '0'

  return `${year}${month}${day}`; // Combine into the desired format
}

function saveApiKey(apiKey) {
  const configData = { apiKey };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(configData, null, 2), {
    mode: 0o600,
  });
}

function getSavedApiKey() {
  if (fs.existsSync(CONFIG_PATH)) {
    // Read and parse the config file
    const configData = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    return configData.apiKey;
  }
  return null; // No API key found
}

function saveNumberToFile(numberGateway, numberNode, date) {
  const data = { numberGateway, numberNode, date };

  // Write the number to the file
  fs.writeFileSync(STORAGE, JSON.stringify(data, null, 2));
}

// Function to read the number from the file
function readNumberFromFile(type) {
  if (type === "now") return;
  if (fs.existsSync(STORAGE)) {
    try {
      const data = JSON.parse(fs.readFileSync(STORAGE, "utf8"));

      if (data.date == getCurrentDate()) {
        if (type === "wifi") {
          saveNumberToFile(
            data.numberGateway + 1,
            data.numberNode,
            getCurrentDate()
          );
          return data.numberGateway;
        } else {
          saveNumberToFile(
            data.numberGateway,
            data.numberNode + 1,
            getCurrentDate()
          );
          return data.numberNode;
        }
      }
    } catch (error) {
      saveNumberToFile(0, 0, getCurrentDate());
      console.log("data.json recreated, restart cli");
      process.exit();
    }
  }
  saveNumberToFile(0, 0, getCurrentDate());
  console.log("data.json created, restart cli");
  process.exit();
}

function formatToHex(num) {
  return num.toString(16).toUpperCase().padStart(2, "0");
}

async function runCLI() {
  const automatic = await confirm({
    message: "Use automatic flow?",
    default: true,
  });

  if (!getSavedApiKey() && automatic) {
    const answer = await password({
      message: "Api key not found, enter one: ",
    });
    saveApiKey(answer);
  }

  const savedApiKey = getSavedApiKey();

  const runArguments = ["run"];

  const type = await select({
    message: "Select a firmware",
    choices: [
      {
        name: "Gateway WiFi",
        value: "wifi",
        description: "Firmware for main gateway esp32",
      },
      {
        name: "Gateway NOW",
        value: "now",
        description:
          "Firmware for gateway esp32 used to communicate with nodes",
      },
      {
        name: "Node",
        value: "node",
        description: "Firmware for node esp32",
      },
    ],
  });

  let firmwarePath = "";
  switch (type) {
    case "wifi":
      firmwarePath = "../firmware_gateway_wifi";
      break;
    case "now":
      firmwarePath = "../firmware_gateway_now";
      break;
    case "node":
      firmwarePath = "../firmware_node";
      break;
  }

  runArguments.push(`-d ${firmwarePath}`);

  let UID = "";
  let AUTH_TOKEN = "";

  if (automatic) {
    const number = readNumberFromFile(type);
    UID =
      type === "now"
        ? "gatewaynow"
        : `${type === "wifi" ? "G" : "N"}${getCurrentDate()}${formatToHex(
            number
          )}`;

    if (type !== "now") console.log(`Generated UID: ${UID}`);

    if (type === "wifi" && automatic) {
      AUTH_TOKEN = await sendPostRequest(
        "https://iot.fkor.us/api/gateway",
        { gatewayId: UID },
        savedApiKey
      );

      console.log(`Generated Token: ${AUTH_TOKEN}`);
    }
  } else {
    UID = await input({
      message: "Enter UID (only for 'gateway wifi'/'node')",
    });
    AUTH_TOKEN = await input({
      message: "Enter AUTH TOKEN (only for 'gateway wifi')",
    });
    console.log(`UID: ${UID}`);
    console.log(`Token: ${AUTH_TOKEN}`);
  }

  const upload = await confirm({ message: "Upload to ESP?", default: false });

  if (upload) runArguments.push("-t upload");

  const customEnv = {
    ...process.env, // Inherit existing environment variables
    PLATFORMIO_BUILD_FLAGS: `-D PROD=1
        -D UID=\\"${UID}\\" 
        -D AUTH_TOKEN=\\"${AUTH_TOKEN}\\"
        `,
  };

  const platformio = child_process.spawn("platformio", runArguments, {
    stdio: "inherit",
    shell: true,
    env: customEnv,
  });

  platformio.on("close", (code) => {
    if (code === 0) {
      console.log("PlatformIO build completed successfully!");
      copyFirmware(firmwarePath, `${UID}.bin`);
    } else {
      console.error(`PlatformIO exited with code ${code}`);
    }
    process.exit(code);
  });
}

await runCLI();
