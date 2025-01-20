import React, { useState } from 'react';
import axios from 'axios';

const SaveResults = ({ title, user_id, image_src, notebook_id, boxes, comment }) => {
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false); 

    const handleSubmit = async (event) => {
        setIsSending(true);
        setError(null);
        setSuccess(false);

        event.preventDefault();
        const data = {
            title: title,
            user_id: user_id || null,
            image: {
                image_src: image_src,
                boxes: boxes,
                notebook_id: notebook_id,
                user_id: user_id || null
            },
            comment: {
                comment: comment,
                notebook_id: notebook_id,
                user_id: user_id
            }
        };
        
        console.log('Отправляемые данные:', JSON.stringify(data, null, 2));

        try {
            const request = await axios.post('http://127.0.0.1:8001/notebooks/add', data);
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
            <button onClick={handleSubmit} disabled={isSending}>
                {isSending ? 'Сохранение...' : 'Сохранить Ноутбук'}
            </button>
            {success && <p>Ноутбук сохранен!</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default SaveResults;
