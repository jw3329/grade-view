import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { AuthContextProvider } from './contexts/auth_context';

axios.defaults.withCredentials = true
ReactDOM.render(<AuthContextProvider><App /></AuthContextProvider>, document.getElementById('root'));