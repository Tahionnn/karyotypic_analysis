import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile.js';
import styles from "../App.css";


const SavedNotebooks = () => {
    const [notebooks, setNotebooks] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotebooks = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://127.0.0.1:8001/user/get/notebooks_list', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setNotebooks(response.data);
            } catch (error) {
                console.error('Ошибка при получении ноутбуков', error);
                setError('Не удалось загрузить ноутбуки.');
            }
        };

        fetchNotebooks();
    }, []);

    const handleClick = (notebook_id) => {
        navigate(`/app/notebook/${notebook_id}`);
    };

    return (
        <div>
            <Profile />
            <h2>Сохраненные Ноутбуки</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
                {notebooks.map((notebook) => (
                    <div key={notebook.id}>
                        <button className='notebook' onClick={() => handleClick(notebook.id)}>
                            {notebook.title}
                        </button>
                    </div>
                ))}
        </div>
    );
};

export default SavedNotebooks;
