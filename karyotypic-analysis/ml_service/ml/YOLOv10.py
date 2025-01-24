import cv2
import numpy as np
import onnx
import onnxruntime as ort
import time


class YOLOv10:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.session = None

    def load(self):
        self.model = onnx.load(self.model_path)
        self.session = ort.InferenceSession(self.model_path)

    def shutdowm(self):
        self.session = None

    def preprocess(self, image: np.ndarray):
        original_shape = image.shape

        input_shape = self.session.get_inputs()[0].shape
        input_height, input_width = input_shape[2], input_shape[3]
        image_resized = cv2.resize(image, (input_width, input_height))

        image_normalized = image_resized.astype(np.float32) / 255.0
        image_input = np.transpose(image_normalized, (2, 0, 1))
        image_input = image_input[np.newaxis, :, :, :].astype(np.float32)

        return image_input, original_shape

    def predict(self, image_input: np.ndarray):
        if self.session is None:
            raise RuntimeError("Model is not loaded")

        input_name = self.session.get_inputs()[0].name
        results = self.session.run(None, {input_name: image_input})

        return results
