import React from 'react'
import{useState} from 'react'
import api from '../api'
import {useNavigate} from 'react-router-dom'
import { ACCESS_TOKEN,REFRESH_TOKEN } from '../constants'
import '../styles/Form.css'
import LoadingIndicator from './LoadingIndicator'

const Form = ({route , method}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = (method === 'login' ? 'Login' : 'Register')
    const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()

    try{
        const res = await api.post(route, {username, password})
        if(method === 'login'){
            // Fixed: Backend returns 'access' and 'refresh', not 'accessToken' and 'refreshToken'
            localStorage.setItem(ACCESS_TOKEN, res.data.access)
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
            navigate('/')
        }else{
            alert('Registration Successful! Please Login.')
            navigate('/login')
        }

    }catch(err){
        alert(err.response.data.message)
    }finally{
        setLoading(false)
    }
}

  return (
    <form onSubmit = {handleSubmit} className="form-container">
        <h2>{name}</h2>
        <input
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            className="form-input"
        />
        <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="form-input"
        />
        {loading && <LoadingIndicator />}
        <button className="form-button" type="submit">
            {name}
        </button>
    </form>
  )
}

export default Form