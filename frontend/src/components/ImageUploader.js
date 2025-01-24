import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Profile from './Profile.js';
import BoxDrawer from './BoxDrawer.js';
import MarkdownEditor from './MarkdownEditor.js';
import Title from './Title.js';
import SaveResults from './SaveResults.js';
import SavedNotebooks from './SavedNotebooks.js';
import NotebookDetail from './NotebookDetail.js';


const ImageUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageURL, setImageURL] = useState('');
    const [prediction, setPrediction] = useState({ boxes: {}, classes: [] });
    const [originalShape, setOriginalShape] = useState([0, 0]);

    const [title, setTitle] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    const [comment, setComment] = useState('');
    
    const handleFile = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.src = url;
    
        img.onload = () => {
            setOriginalShape([img.height, img.width]);
            setImageURL(url);
        };
    
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageBase64(reader.result); 
        };
    
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://127.0.0.1:8000/ml/predict', formData);
            const predictionData = {
                boxes: response.data.boxes,
                classes: response.data.classes,
                confidences: response.data.confidences
            };
            setPrediction(predictionData);
        } catch (error) {
            console.error('Error uploading image', error);
        }
    };

    const handleTitleChange = (text) => {
        setTitle(text);
    };

    const handleMarkdownChange = (text) => {
        setComment(text);
    };

    return (
        <div>
            <Profile />
            <h1>Upload your Chromosome ;)</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFile} accept="image/*" required />
                <button type='submit'>Submit</button>
            </form>
            {prediction.boxes && Object.keys(prediction.boxes).length > 0 && (
                <>
                <Title onChange={handleTitleChange} />
                <figure>
                    <figcaption>Оригинальное изображение</figcaption>
                    <img src={imageURL} alt="Uploaded" />
                </figure>
                <figure>
                    <figcaption>Bounding Boxes</figcaption>
                    <BoxDrawer imageURL={imageURL} prediction={prediction} originalShape={originalShape} />
                </figure>
                <MarkdownEditor onChange={handleMarkdownChange} />
                <SaveResults
                title={title}
                image_src={imageBase64}
                boxes={prediction["boxes"]}
                comment={comment}
                />
                </>
            )}
        </div>
    );
};

export default ImageUploader;
