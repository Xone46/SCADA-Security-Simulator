import ModbusRTU from "modbus-serial";

const client = new ModbusRTU();

export async function connectModbus() {
    await client.connectTCP("127.0.0.1", { port: 5020 });
    client.setID(1);
}

export async function readModbusData() {
    const res = await client.readHoldingRegisters(0, 4);

    return {
        temperature: res.data[0],
        pressure: res.data[1],
        speed: res.data[2],
        state: res.data[3]
    };
}