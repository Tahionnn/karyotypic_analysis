import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Title from './Title';
import BoxDrawer from './BoxDrawer';
import MarkdownEditor from './MarkdownEditor';
import UpdateNotebook from './UpdateNotebook';

const NotebookDetail = () => {
    const { notebook_id } = useParams();
    const [notebook, setNotebook] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [imageURL, setImageURL] = useState('');
    const [loadingImage, setLoadingImage] = useState(false);
    const [prediction, setPrediction] = useState({ boxes: {}, classes: [] });
    const [originalShape, setOriginalShape] = useState([0, 0]);

    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchNotebook = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Token not found. Please log in again.');
                return;
            }
            
            try {
                const response = await axios.get(`http://127.0.0.1:8001/notebooks/get/${notebook_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.boxes) {
                    const predictionData = {
                        boxes: response.data.boxes,
                        classes: response.data.classes,
                        confidences: response.data.confidences
                    };
                    setPrediction(predictionData);
                } else {
                    setError('Prediction data is missing');
                }

                if (response.data.title) {
                    setTitle(response.data.title);
                } else {
                    setError('Title data is missing');
                }

                if (response.data.comment) {
                    setComment(response.data.comment);
                } else {
                    setError('Comment data is missing');
                }

                let base64Image = response.data.image_src; 

                if (base64Image.startsWith('dataimage/jpegbase64')) {
                    base64Image = base64Image.replace('dataimage/jpegbase64', '');
                    base64Image = `data:image/jpeg;base64,${base64Image}`;
                } else if (!base64Image.startsWith('data:image/jpeg;base64,')) {
                    setError('Invalid image data format.');
                    return;
                }
                setImageURL(base64Image);

            } catch (error) {
                console.error('Ошибка при получении ноутбука', error);
                setError('Error fetching notebook');
            }
        };

        fetchNotebook();
    }, [notebook_id]);

    useEffect(() => {
        const loadImage = async () => {
            if (imageURL) {
                setLoadingImage(true);
                const img = new Image();
                img.src = imageURL;

                img.onload = () => {
                    const shape = [img.height, img.width];
                    setOriginalShape(shape);
                    setLoadingImage(false);
                };

                img.onerror = (error) => {
                    console.error('Error loading image', error);
                    setError('Error loading image');
                    setLoadingImage(false);
                };
            }
        };

        loadImage();
    }, [imageURL]);

    const handleTitleChange = (newTitle) => {
        setTitle(newTitle);
    };

    const handleMarkdownChange = (newComment) => {
        setComment(newComment);
    };

    return (
        <>
            {error && <p>{error}</p>}
            {loadingImage ? (
                <p>Loading image...</p>
            ) : (
                imageURL ? (
                    <>
                    <Title value={title} onChange={handleTitleChange} />
                    <figure>
                        <figcaption>Оригинальное изображение</figcaption>
                        <img src={imageURL} alt="Uploaded" />
                    </figure>
                    <figure>
                        <figcaption>Bounding Boxes</figcaption>
                        {prediction && prediction.boxes && (
                            <BoxDrawer imageURL={imageURL} prediction={prediction} originalShape={originalShape} />
                        )}
                    </figure>
                    <MarkdownEditor value={comment} onChange={handleMarkdownChange} />
                    <UpdateNotebook 
                    title={title}
                    comment={comment}
                    />
                    </>
                ) : (
                    <p>No image available.</p>
                )
            )}
            <button onClick={() => {navigate("/app/")}}>Назад</button>
        </>
    );
};

export default NotebookDetail;
