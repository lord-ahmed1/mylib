import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from './form';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL ;

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const title="Welcome Back";
  const subTitle="Sign in to access your library"


    


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    axios.post(BASE_URL+'/api/users/login', {
    username: username,
    password: password
        })
        .then(response => {
            if (response.status==200){
              [localStorage["accessToken"],localStorage["refreshToken"]]=[response.data.accessToken,response.data.refreshToken];
              navigate('/')}
            else{setError('error occured');setLoading(false);}
        })
        .catch(error => {
          setError(error.response.data);
          setLoading(false);
        });  
  
  };
  const formArgs ={
    handleSubmit,
    loading,
    error,
    username,
    password,
    setUsername,
    setPassword,
    title,
    subTitle
    };
  return (


        <Form args={formArgs}/>

        
   
  );
}
