from celery import shared_task
import numpy as np
import cv2
import json
from ml.YOLOv10 import YOLOv10
from ml.utils import rescale_boxes


path="/app/ml_service/models/best.onnx"
model = YOLOv10(model_path=path)
model.load()


@shared_task(bind=True)
def predict(self, image: bytes):
    try:
        np_array = np.frombuffer(image, np.uint8)
        image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        image, original_shape = model.preprocess(image)
        results = model.predict(image)
        results = np.squeeze(results[0])

        boxes = results[:, :4]
        confidences = results[:, 4]
        classes = results[:, 5].astype(int)
        height, width = original_shape[:2]
        boxes = rescale_boxes(boxes=boxes, img_height=height, img_width=width)

        class_dict = ['A1', 'A2', 'A3', 'B4', 'B5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'D13', 'D14', 'D15', 'E16', 'E17', 'E18', 'F19', 'F20', 'G21', 'G22', 'X', 'Y']
        class_images = {class_name: [] for class_name in class_dict}

        for i, box in enumerate(boxes):
            x1, y1, x2, y2 = box
            confidence = confidences[i]
            class_id = classes[i]

            if confidence > 0.5:
                x1, y1, x2, y2 = map(float, [x1, y1, x2, y2])
                class_id = int(class_id)
                class_name = class_dict[class_id]
                object_image = [x1, y1, x2, y2]
                class_images[class_name].append(object_image)

        result = {'boxes': class_images}
        return result

    except Exception as e:
        print(f"Error in processing image: {e}")
        self.retry(exc=e)