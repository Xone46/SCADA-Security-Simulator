from pymodbus.server import StartTcpServer
from pymodbus.datastore import ModbusSequentialDataBlock
from pymodbus.datastore import ModbusSlaveContext, ModbusServerContext
import random
import threading
import time

store = ModbusSlaveContext(
    hr=ModbusSequentialDataBlock(0, [0]*10)
)

context = ModbusServerContext(slaves=store, single=True)

def update_values():
    while True:
        # Mode normal
        temperature = random.randint(20, 30)
        pressure = random.randint(1, 5)
        speed = random.randint(1000, 1500)
        state = random.randint(0, 1)

        # Mode malware (10%)
        if random.random() < 0.1:
            temperature = random.randint(80, 120)

        context[0].setValues(3, 0, [temperature, pressure, speed, state])

        print(f"T={temperature} P={pressure} S={speed} ON={state}")
        time.sleep(2)

threading.Thread(target=update_values, daemon=True).start()

StartTcpServer(context, address=("0.0.0.0", 5020))