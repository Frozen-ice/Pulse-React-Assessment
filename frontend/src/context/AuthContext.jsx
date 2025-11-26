import { createContext, useState, useContext, useEffect } from 'react';
import { getProfile } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user profile if token exists
        const fetchUserProfile = async () => {
            if (token) {
                try {
                    const response = await getProfile();
                    if (response.success) {
                        setUser(response.data);
                    } else {
                        // Token might be invalid, clear it
                        setToken(null);
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    // Token invalid or expired, clear it
                    setToken(null);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        fetchUserProfile();
    }, [token]);

    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
