# Insert this code into your YOLO:BIT device
# , then press save to store config

from yolobit import *
import machine
import ubinascii
import time
import json

# Lấy MAC Address
mac_bytes = machine.unique_id()
mac_string = ubinascii.hexlify(mac_bytes, ':').decode().upper()

# Hàm tính toán khoảng cách cho cảm biến siêu âm (không cần cài thêm thư viện ngoài)
def read_ultrasonic(trig_pin, echo_pin):
    # Phát xung Trigger
    trig_pin.write_digital(0)
    time.sleep_us(2)
    trig_pin.write_digital(1)
    time.sleep_us(10)
    trig_pin.write_digital(0)

    try:
        # Đo thời gian xung Echo dội về (dùng hàm time_pulse_us của MicroPython)
        # Biến .pin ở đây là để lấy đối tượng phần cứng thật bên dưới của OhStem
        duration = machine.time_pulse_us(echo_pin.pin, 1, 30000)
        if duration > 0:
            # Công thức tính khoảng cách: (Thời gian * Vận tốc âm thanh) / 2
            return int((duration * 0.0343) / 2)
        return 0
    except:
        return 0

while True:
    # Đọc ánh sáng (Từ cảm biến ngoài cắm cổng P0)
    # read_analog() trả về 0 - 4095, ép về % (0-100)
    raw_light = pin0.read_analog()
    light_val = int((raw_light / 4095) * 100)

    # Đọc chuyển động (Từ cảm biến cắm cổng P16/P12)
    motion_val = (pin16.read_digital() == 1)

    # Đọc khoảng cách (Từ cảm biến cắm cổng P3/P6)
    # Giả sử Trigger cắm vào chân P3, Echo cắm vào P6.
    distance_val = read_ultrasonic(pin14, pin15)

    # 4. Gói thành JSON chuẩn
    data = {
        "mac_address": mac_string,
        "distance": distance_val,
        "motion": motion_val,
        "light": light_val
    }

    # Đẩy ra cáp USB
    print(json.dumps(data))

    time.sleep(2)