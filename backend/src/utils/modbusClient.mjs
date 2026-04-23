import ModbusRTU from "modbus-serial";

const client = new ModbusRTU();

let isConnected = false;

export const connectModbus = async () => {
  try {
    if (isConnected) return true;

    await client.connectTCP("127.0.0.1", { port: 502 }); // mets 502 si tu utilises 502
    client.setID(1);

    isConnected = true;
    console.log("✅ Connected to Modbus Slave");
    return true;
  } catch (error) {
    isConnected = false;
    console.error("❌ Modbus connection error:", error.message);
    return false;
  }
};

export const readScadaRegisters = async () => {
  try {
    if (!isConnected) {
      const ok = await connectModbus();
      if (!ok) throw new Error("Modbus not connected");
    }

    const response = await client.readHoldingRegisters(0, 4);

    const [temperature, pressure, speed, stateRaw] = response.data;

    return {
      temperature,
      pressure,
      speed,
      state: stateRaw === 1 ? "RUNNING" : "STOPPED"
    };
  } catch (error) {
    console.error("❌ Modbus read error:", error.message);
    throw error;
  }
};

export const closeModbus = async () => {
  try {
    client.close();
    isConnected = false;
    console.log("🔌 Modbus connection closed");
  } catch (error) {
    console.error("❌ Modbus close error:", error.message);
  }
};