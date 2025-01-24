import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Navigate } from "react-router";
import { fetchToken, setToken } from "./Auth";


const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); 

    const login =  async (e) => {
        e.preventDefault();
        setError(null); 
        if (!username || !password) {
            setError("Username and password are required.");
            return;
        }
        
        try {
            console.log("Username:", username);
            console.log("Password:", password);
            const response = await axios.post('http://127.0.0.1:8001/api/token',
                new URLSearchParams({
                    username: username,
                    password: password,
                    grant_type: "password"
                }), 
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );
            const { access_token } = response.data;
            setToken(access_token);
            localStorage.setItem('user_id', response.data.user.id);
            navigate("/app");
        } catch(err) {
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
            <h1>Login page</h1>
            {fetchToken() ? (
                <Navigate to="/app" />
            ) : (
                <form onSubmit={login}>
                    <div>
                        <label>Username or Email</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                    <button onClick={() => {navigate("/registration")}}>Registration</button>
                    <button type="submit" disabled={!username || !password}>Login</button>
                </form>
            )}
        </>
      );
};

export default Login;