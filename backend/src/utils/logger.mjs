import fs from "fs";

export function logData(data) {
    const line = `${new Date().toISOString()} ${JSON.stringify(data)}\n`;
    fs.appendFileSync("logs/system.log", line);
}