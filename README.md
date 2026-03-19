# SCADA-Security-Simulator

## Description
Simulation SCADA avec PLC virtuel et protocole Modbus TCP pour auditer la sécurité industrielle. 
Ce projet permet de générer des données normales et des anomalies simulant un malware industriel.

## Fonctionnalités
- PLC simulé en Python (`pymodbus`)
- Variables industrielles : Température, Pression, Vitesse, Etat ON/OFF
- Mode NORMAL et Mode MALWARE
- Test des registres avec Modbus Poll
- Logs pour analyse et détection des anomalies

## Installation
```bash
pip install pymodbus