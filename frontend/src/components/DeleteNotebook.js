import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile.js';
import styles from "../App.css";


const DeleteNotebook = ({ notebook_id, onDelete }) => {
    const [error, setError] = useState(null);

    const handleClick = async () => {
        const confirm = window.confirm("Вы уверены, что хотите удалить этот ноутбук?");
        if (!confirm) {
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`/user/notebooks/delete/${notebook_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            onDelete(notebook_id);
        } catch (error) {
            console.error('Ошибка при удалении ноутбуков', error);
            setError('Не удалось удалить ноутбуки.');
        }
    };

    return (
        <>
            <button onClick={handleClick}>Delete</button>
        </>
    );
};

export default DeleteNotebook;