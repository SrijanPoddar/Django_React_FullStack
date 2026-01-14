import React from 'react'
import { Navigate } from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import { ACCESS_TOKEN , REFRESH_TOKEN } from '../constants.js'
import { useState, useEffect } from 'react'
import api from '../api'

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        auth().catch((error) => {
            console.error("Error during authentication:", error);
            setIsAuthenticated(false);
        });
    },[])


    const refreshToken = async() => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try{
            const res = await api.post("/api/token/refresh/", { refresh: refreshToken });
            if(res.status === 200){
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthenticated(true)
            }else{
                setIsAuthenticated(false)
            }
        }catch(error){
            console.error("Error refreshing token:", error);
            setIsAuthenticated(false)
        }

    }

    const auth = async() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        console.log("Retrieved token:", token);
        console.log("Token type:", typeof token);
        
        if (!token){
            setIsAuthenticated(false)
            return;
        }
        
        // Check if token has 3 parts (header.payload.signature)
        const tokenParts = token.split('.');
        console.log("Token parts count:", tokenParts.length);
        
        if (tokenParts.length !== 3) {
            console.error("Invalid token format - expected 3 parts, got:", tokenParts.length);
            setIsAuthenticated(false);
            return;
        }
        
        try {
            const decodedToken = jwtDecode(token);
            const tokenExpiration = decodedToken.exp * 1000;
            const currentTime = Date.now();

            if(tokenExpiration < currentTime){
                await refreshToken()
            }else{
                setIsAuthenticated(true)
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            setIsAuthenticated(false);
        }
    }

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}
export default ProtectedRoute