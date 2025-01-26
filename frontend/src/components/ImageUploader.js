import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import BoxDrawer from './BoxDrawer.js';
import MarkdownEditor from './MarkdownEditor.js';
import Title from './Title.js';
import SaveResults from './SaveResults.js';
import SavedNotebooks from './SavedNotebooks.js';
import NotebookDetail from './NotebookDetail.js';
import '../App.css';


const ImageUploader = () => {
    const [isSending, setIsSending] = useState(false);

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
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setTitle('');
        setComment('');

        const file = selectedFile;

        if (!file) {
            console.error('No file selected');
            return; 
        }

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
        
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('/ml/ml/predict', formData);
            const predictionData = {
                boxes: response.data.boxes,
                classes: response.data.classes,
                confidences: response.data.confidences
            };
            setPrediction(predictionData);
            setIsSending(true);
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
        <>
            {!isSending ? (
                <div className='uploadForm'>
                    <div>
                        <h1>Upload your Chromosome ;)</h1>
                        <form onSubmit={handleSubmit}>
                            <input type="file" onChange={handleFile} accept="image/*" required />
                            <button type='submit' className='submit'>Submit</button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className=''>
                    <h1>Upload your Chromosome ;)</h1>
                    <form onSubmit={handleSubmit}>
                        <input type="file" onChange={handleFile} accept="image/*" required />
                        <button type='submit' className='submit'>Submit</button>
                    </form>
                    {prediction.boxes && Object.keys(prediction.boxes).length > 0 && (
                        <div className='notebookDisplay'>
                            <Title value={title} onChange={handleTitleChange} />
                            <figure>
                                <figcaption>Оригинальное изображение</figcaption>
                                <img src={imageURL} alt="Uploaded" />
                            </figure>
                            <figure>
                                <figcaption>Bounding Boxes</figcaption>
                                <BoxDrawer imageURL={imageURL} prediction={prediction} originalShape={originalShape} />
                            </figure>
                            <MarkdownEditor value={comment} onChange={handleMarkdownChange} />
                            <SaveResults
                                title={title}
                                image_src={imageBase64}
                                boxes={prediction["boxes"]}
                                comment={comment}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ImageUploader;
