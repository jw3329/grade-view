import React, { useState, useContext } from 'react';
import axios from 'axios';
import { SERVER, PORT } from '../../config';
import AuthContext from '../../contexts/auth_context';

const SignIn = ({ history }) => {

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    const { setUser } = useContext(AuthContext);

    const handleSubmit = async e => {
        e.preventDefault();
        const { email, password } = form;
        setErrorMessage('');
        try {
            const { status, message, user } = (await axios.post(`${SERVER}:${PORT}/auth/signin`, {
                email,
                password,
            })).data;
            if (!status) {
                setErrorMessage(message);
            } else {
                // redirect to home page
                setUser(user);
                history.push('/');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        })
        setErrorMessage('');
    }

    return (
        <form onChange={handleChange} onSubmit={handleSubmit} className="mt-5 mx-auto col-sm-6">
            <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" required />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Password" required />
            </div>
            {
                errorMessage && (<div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>)
            }
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
}

export default SignIn;