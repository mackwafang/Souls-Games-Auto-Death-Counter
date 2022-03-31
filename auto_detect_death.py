import time
import pytesseract
import cv2 as cv
import numpy as np
import requests

from time import localtime
from PIL import Image as image
from PIL import ImageGrab
from string import ascii_lowercase

x, y, w, h = (700, 500, 500, 96)
print("reading screen")
while True:
	screenshot_raw = ImageGrab.grab()
	screenshot = np.array(screenshot_raw.getdata(), dtype='uint8')
	screenshot = screenshot.reshape((screenshot_raw.size[1], screenshot_raw.size[0], 3))
	screenshot = cv.split(screenshot)[0]
	screenshot = screenshot[y : y+h, x : x+w]
	screenshot = cv.resize(screenshot, (screenshot.shape[1] // 4, screenshot.shape[0] // 4))
	screenshot = cv.inRange(screenshot, 80, 160)
	screenshot = cv.morphologyEx(screenshot, cv.MORPH_CLOSE, np.ones((3,3), np.uint8))


	ocr_output = pytesseract.image_to_string(image.fromarray(screenshot)).lower()
	ocr_output = ''.join(i for i in ocr_output if i in ascii_lowercase)
	if ocr_output == "youdied":
		cur_time = localtime()
		print(f"[{cur_time.tm_mon}/{cur_time.tm_mday}/{cur_time.tm_year} {cur_time.tm_hour:02}:{cur_time.tm_min:02}:{cur_time.tm_sec:02}]", end=" ")
		print("You died, Loser!", end=" ")
		response = requests.post("http://192.168.1.214:8080/server", json={"counter": 1, "set": False, "update_pulse": False})
		print(f"Now at {response.json()['counter']} deaths!")
		time.sleep(5)