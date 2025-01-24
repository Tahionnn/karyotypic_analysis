import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const SaveResults = ({ title, image_src, boxes, comment }) => {
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        setIsSending(true);
        setError(null);
        setSuccess(false);

        event.preventDefault();

        const token = localStorage.getItem('token');

        const data = {
            title: title,
            image: {
                image_src: image_src,
                boxes: boxes,
            },
            comment: {
                comment: comment,
            }
        };

        console.log('Отправляемые данные:', JSON.stringify(data, null, 2));

        try {
            const request = await axios.post('http://127.0.0.1:8001/notebooks/add', data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Prediction saved successfully:', request.data);
            setSuccess(true);
        } catch (error) {
            console.error('Error sending data', error.response ? error.response.data : error);
            setError(`Ошибка при сохранении ноутбука. Попробуйте еще раз. ${error}`);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div>
            <button className='submit' onClick={handleSubmit} disabled={isSending}>
                {isSending ? 'Сохранение...' : 'Сохранить Ноутбук'}
            </button>
            {success && <p>Ноутбук сохранен!</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default SaveResults;
