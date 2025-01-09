import cv2
import numpy as np
import onnx
import onnxruntime as ort
import time

from karyotypic_analysis.ml.utils import *


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
    
    def postprocess(self, image: np.ndarray):
        image_input, original_shape = self.preprocess(image)

        results = self.predict(image_input)

        image_postprocess = image.copy()

        annotated_image_with_boxes, annotated_image_with_overlay, class_images = draw_boxes_onnx(image_postprocess, 
                                                                                                 results, 
                                                                                                 original_shape
                                                                                                )

        annotated_image_with_boxes_rgb = cv2.cvtColor(annotated_image_with_boxes, cv2.COLOR_BGR2RGB)
        annotated_image_with_overlay_rgb = cv2.cvtColor(annotated_image_with_overlay, cv2.COLOR_BGR2RGB)

        detection_buffer, class_images_buffer = show_results(
                                                                image, 
                                                                annotated_image_with_boxes_rgb, 
                                                                annotated_image_with_overlay_rgb, 
                                                                class_images
                                                            )
        
        return detection_buffer, class_images_buffer