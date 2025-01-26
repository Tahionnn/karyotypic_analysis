import { useNavigate } from "react-router";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { fetchToken } from "./Auth";

const Profile = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getUser = async () => {
        const token = fetchToken();
        try {
            const response = await axios.get('/user/user/users/me/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const username = response.data.username;
            setUsername(username);
        } catch (err) {
            if (err.response) {
                console.error("Error response from server:", err.response);
                console.error("Error details:", err.response.data.detail);
                setError(err.response.data.detail);
            } else {
                console.error("Error:", err);
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const signOut = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <img src={process.env.PUBLIC_URL + "/logo192.png"} alt="Logo" width="50" height="50" />
            <figcaption>{username}</figcaption>
            <button onClick={signOut}>Sign out</button>
        </>
    );
};

export default Profile;
