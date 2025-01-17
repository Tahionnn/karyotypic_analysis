import numpy as np

def rescale_boxes(boxes, img_height, img_width, input_width=640, input_height=640):
    input_shape = np.array([input_width, input_height, input_width, input_height])
    boxes = np.divide(boxes, input_shape, dtype=np.float32)
    boxes *= np.array([img_width, img_height, img_width, img_height])
    return boxes