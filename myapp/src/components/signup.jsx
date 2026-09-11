import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from './form';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL ;

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const title="Please join us";
  const subTitle="become a member"


    


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    axios.post(BASE_URL+'/api/users/signup', {
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
