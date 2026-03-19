from pymodbus.server.sync import StartTcpServer
from pymodbus.device import ModbusDeviceIdentification
from pymodbus.datastore import ModbusSequentialDataBlock, ModbusSlaveContext, ModbusServerContext

# Création des registres (40001 → 40004)
store = ModbusSlaveContext(
    hr=ModbusSequentialDataBlock(0, [25, 2, 1200, 1])  # Temp, Pression, Vitesse, Etat
)

context = ModbusServerContext(slaves=store, single=True)

# Identification du PLC simulé
identity = ModbusDeviceIdentification()
identity.VendorName = 'SimulatedPLC'
identity.ProductCode = 'SP'
identity.VendorUrl = 'http://example.com'
identity.ProductName = 'PLC Simulator'
identity.ModelName = 'Python PLC'
identity.MajorMinorRevision = '1.0'

# Démarrage du serveur Modbus TCP
StartTcpServer(context, identity=identity, address=("127.0.0.1", 5020))