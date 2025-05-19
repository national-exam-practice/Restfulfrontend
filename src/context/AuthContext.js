import React, { useContext, useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apis from './Api';

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await apis.get('/auth/me');
                    setCurrentUser(response.data.data); 
                } catch (error) {
                    console.error('Error fetching user:', error);
                    setCurrentUser(null);
                    localStorage.removeItem('authToken');
                }
            }
            setLoading(false);
        };

        checkUser();
    }, []);

    const login = async ({ email, password }) => {
        try {
            const response = await apis.post('/auth/login', { email, password });
            const token = response.data.data.token;
            localStorage.setItem('authToken', token);
            const userResponse = await apis.get('/auth/me');
            setCurrentUser(userResponse.data.data); 
            return response.data.message;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Login failed');
        }
    };

    const register = async ({ email, password, firstname, lastname,role }) => {
        try {
            const response = await apis.post('/auth/register', {
                email,
                password,
                firstname,
                lastname,
                role
            });
            setCurrentUser(response.data.user); 
            return response.data.message; 
        } catch (error) {
            throw new Error(error.response.data.message || 'Registration failed');
        }
    };

    const logout = async () => {
        try {
            await apis.post('/auth/logout');
            setCurrentUser(null);
            localStorage.removeItem('authToken');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

        const isOwner = currentUser?.role === 'OWNER';
        const isAdmin = currentUser?.role === 'ADMIN';

    const value = {
        currentUser,
        login,
        register,
        logout,
        isOwner,
        isAdmin,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
