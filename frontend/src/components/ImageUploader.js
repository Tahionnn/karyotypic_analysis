import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [classes, setClasses] = useState(Array().fill(null));
    
    const handleFile = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://127.0.0.1:8000/predict', formData);/*, {
                responseType: 'blob',
            });*/
            //const detection_imageURL = URL.createObjectURL(new Blob([response.data.detection_image.content]));
            const detection_imageURL = `data:image/png;base64,${response.data.detection_image.content}`;
            setPrediction(detection_imageURL)

            /*const classes_imageURL = response.data.class_images.map( imageData => 
                URL.createObjectURL(new Blob([imageData.content]))
            );*/
            const classes_imageURLs = response.data.class_images.map(imageData => 
                `data:image/png;base64,${imageData.content}`
            );
            setClasses(classes_imageURLs);
        }
        catch (error) {
            console.error('Error uploading image', error);
        }
    };

    return(
        <div>
            <h1>Upload your Chromosome ;)</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFile} accept="image/*" required/>
                <button type='submit'>Submit</button>
            </form>
            {prediction && <img src={prediction}></img>}
            {(classes.length > 0) && (
                <div>
                    {classes.map((url, index) => (
                        <img key={index} src={url} alt={`Class Image ${index}`}></img>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ImageUploader;