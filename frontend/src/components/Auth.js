import { useLocation, Navigate } from "react-router-dom";


export const setToken = (token) => {
    localStorage.setItem('token', token);
};

export const fetchToken = () => {
    return localStorage.getItem('token');
};

export function RequireToken({ children }) {
    const auth = fetchToken();
    const location = useLocation();

    if (!auth) {
        return <Navigate to='/' state={{ from: location }} />;
    }

    return children;
}
