import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Navigate } from "react-router";
import { fetchToken, setToken } from "./Auth";


const Registration = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const login = async (e) => {
        e.preventDefault();
        setError(null);
        if (!username || !email || !password) {
            setError("Username, email and password are required.");
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8001/register', {
                "username": username,
                "email": email,
                "password": password
            });
            navigate("/");
        } catch (err) {
            if (err.response) {
                console.error("Error response from server:", err.response);
                console.error("Error details:", err.response.data.detail);
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <>
            <h1>Registration page</h1>
            {fetchToken() ? (
                <Navigate to="/app" />
            ) : (
                <form onSubmit={login}>
                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button onClick={() => { navigate("/") }}>Login</button>
                    <button type="submit" disabled={!username || !password}>Register</button>
                </form>
            )}
        </>
    );
};

export default Registration;