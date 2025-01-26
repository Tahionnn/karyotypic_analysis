import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile.js';
import DeleteNotebook from './DeleteNotebook.js';
import styles from "../App.css";


const SavedNotebooks = () => {
    const [notebooks, setNotebooks] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotebooks = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('/user/user/get/notebooks_list', {
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

    const handleDelete = (notebook_id) => {
        setNotebooks(prevNotebook => prevNotebook.filter(notebook => notebook.id !== notebook_id));
    };

    return (
        <div>
            <Profile />
            <h2>Сохраненные Ноутбуки</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {notebooks.map((notebook) => (
                <div key={notebook.id} style={{ marginBottom: '5%', display: "flex", flexDirection: 'row' }}>
                    <button className='notebook' onClick={() => handleClick(notebook.id)}>
                        {notebook.title}
                    </button>
                    <DeleteNotebook
                        notebook_id={notebook.id}
                        onDelete={handleDelete}
                    />
                </div>
            ))}
        </div>
    );
};

export default SavedNotebooks;
