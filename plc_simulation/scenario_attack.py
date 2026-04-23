# plc_simulation/scenario_attack.py
import random
import time

def generate_normal_data():
    return {
        "temperature": random.randint(25, 45),
        "pressure": random.randint(60, 100),
        "motorSpeed": random.randint(1000, 2500),
        "status": random.choice(["RUNNING", "STOPPED"])
    }

def generate_attack_data():
    return {
        "temperature": random.randint(85, 120),
        "pressure": random.randint(130, 180),
        "motorSpeed": random.randint(3200, 5000),
        "status": "RUNNING"
    }

if __name__ == "__main__":
    for i in range(10):
        if i < 6:
            print("NORMAL:", generate_normal_data())
        else:
            print("ATTACK:", generate_attack_data())
        time.sleep(1)