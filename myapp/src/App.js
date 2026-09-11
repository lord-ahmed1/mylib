import {BrowserRouter,Routes,Route} from 'react-router-dom'
import PDFViewer from './components/reader'
import HomePage from './components/home'
import LoginPage from './components/login';
import SignupPage from './components/signup';
import { useState } from 'react';


function App() {

  return (
   <BrowserRouter>
   <Routes>
<Route path="/" element={<HomePage />} />
<Route path="/login" element={<LoginPage/>} />
<Route path="/signup" element={<SignupPage/>} />

<Route path="/book" element={<PDFViewer />} />

   </Routes>
   </BrowserRouter>
  );
}

export default App;
