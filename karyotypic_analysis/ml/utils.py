import matplotlib.pyplot as plt
import cv2
import numpy as np
import io
from PIL import Image

def save_image_to_buffer(image):
    image_pil = Image.fromarray(image)
    buffer = io.BytesIO()
    image_pil.save(buffer, format='PNG')  
    buffer.seek(0)  
    return buffer


def rescale_boxes(boxes, img_height, img_width, input_width=640, input_height=640):
    input_shape = np.array([input_width, input_height, input_width, input_height])
    boxes = np.divide(boxes, input_shape, dtype=np.float32)
    boxes *= np.array([img_width, img_height, img_width, img_height])
    return boxes


def random_color():
    return tuple(np.random.randint(0, 255, size=3).tolist())


def draw_boxes_onnx(image, results, original_shape):
    results = np.squeeze(results[0])
    overlay_image = image.copy()
    image_for_boxes = image.copy()

    class_dict = [
        'A1', 'A2', 'A3', 'B4', 'B5',
        'C6', 'C7', 'C8', 'C9', 'C10',
        'C11', 'C12', 'D13', 'D14', 'D15',
        'E16', 'E17', 'E18', 'F19', 'F20',
        'G21', 'G22', 'X', 'Y'
    ]

    class_colors = {class_name: random_color() for class_name in class_dict}

    boxes = results[:, :4]
    confidences = results[:, 4]
    classes = results[:, 5].astype(int)

    if boxes.shape[0] == 0:
        print("No boxes detected.")
        return image_for_boxes, overlay_image

    height, width = original_shape[:2]

    boxes = rescale_boxes(boxes=boxes, img_height=height, img_width=width)

    class_images = {class_name: [] for class_name in class_dict}

    for i, box in enumerate(boxes):
        x1, y1, x2, y2 = box
        confidence = confidences[i]
        class_id = classes[i]

        if confidence > 0.5:
            x1, y1, x2, y2 = map(int, [x1, y1, x2, y2])

            class_id = int(class_id)
            class_name = class_dict[class_id]
            color = class_colors[class_name]

            cv2.rectangle(overlay_image, (x1, y1), (x2, y2), color, thickness=cv2.FILLED)
            cv2.rectangle(image_for_boxes, (x1, y1), (x2, y2), color, thickness=2)
            label = f"{class_name}"
            cv2.putText(image_for_boxes, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            cv2.putText(overlay_image, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

            object_image = image[y1:y2, x1:x2]

            if object_image.size > 0:
                class_images[class_name].append(object_image)

    alpha = 0.5
    cv2.addWeighted(overlay_image, alpha, image, 1 - alpha, 0, overlay_image)

    return image_for_boxes, overlay_image, class_images


def resize_images(images, target_height):
    resized_images = []
    for image in images:
        height, width = image.shape[:2]
        aspect_ratio = width / height
        target_width = int(target_height * aspect_ratio)
        resized_image = cv2.resize(image, (target_width, target_height))
        resized_image = np.pad(resized_image, ((1, 1), (1, 1), (0,0)), constant_values=0)
        resized_images.append(resized_image)
    return resized_images


def show_results(image, annotated_image_with_boxes, annotated_image_with_overlay, class_images):
    annotated_image_with_boxes_rgb = cv2.cvtColor(annotated_image_with_boxes, cv2.COLOR_BGR2RGB)
    annotated_image_with_overlay_rgb = cv2.cvtColor(annotated_image_with_overlay, cv2.COLOR_BGR2RGB)
    class_images = {class_name: images for class_name, images in class_images.items() if len(images)>0}

    class_images_buffer = []

    fig = plt.figure(figsize=(20, 20))

    ax1 = fig.add_subplot(1, 3, 1)
    ax1.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    ax1.set_title("Original Image")
    ax1.axis('off')

    ax2 = fig.add_subplot(1, 3, 2)
    ax2.imshow(annotated_image_with_boxes_rgb)
    ax2.set_title("Bounding Boxes")
    ax2.axis('off')

    ax3 = fig.add_subplot(1, 3, 3)
    ax3.imshow(annotated_image_with_overlay_rgb)
    ax3.set_title("Overlay with Transparency")
    ax3.axis('off')

    detection_buffer = io.BytesIO()
    plt.savefig(detection_buffer, format='png', bbox_inches='tight')
    detection_buffer.seek(0)
    
    plt.close()

    num_classes = len(class_images)
    plt.figure(figsize=(16, 5 * num_classes))
    for idx, (class_name, images) in enumerate(class_images.items()):
        plt.subplot(num_classes, 3, idx + 1)
        plt.title(f"Class: {class_name}")
        if images:
            target_height = max(image.shape[0] for image in images)
            resized_images = resize_images(images, target_height)
            combined_image = np.hstack(resized_images)
            plt.imshow(cv2.cvtColor(combined_image, cv2.COLOR_BGR2RGB))
            plt.axis('off')

            buffer_class = io.BytesIO()
            plt.savefig(buffer_class, format='png', bbox_inches='tight')
            buffer_class.seek(0)
            class_images_buffer.append(buffer_class)

    plt.close()

    return detection_buffer, class_images_buffer