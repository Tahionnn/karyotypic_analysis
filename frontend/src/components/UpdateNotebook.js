import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; 


const UpdateNotebook = ({ title, comment }) => {
    const { notebook_id } = useParams();
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
            comment: {
                comment: comment,
            }
        };
        
        console.log('Отправляемые данные:', JSON.stringify(data, null, 2));

        try {
            const request = await axios.put(`http://127.0.0.1:8001/notebooks/update/${notebook_id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Prediction saved successfully:', request.data);
            setSuccess(true);
        } catch (error) {
            console.error('Error sending data', error.response ? error.response.data : error);
            setError(`Ошибка при обновлении ноутбука. Попробуйте еще раз. ${error}`);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div>
            <button className='submit' onClick={handleSubmit} disabled={isSending}>
                {isSending ? 'Обновление...' : 'Обновить Ноутбук'}
            </button>
            {success && <p>Ноутбук обвнолен!</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default UpdateNotebook;
