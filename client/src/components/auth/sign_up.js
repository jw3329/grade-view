import React, { useState } from 'react';
import axios from 'axios';
import { SERVER, PORT } from '../../config';

const SignUp = () => {

    const [form, setForm] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: ''
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        const { email, firstName, lastName, password, confirmPassword } = form;
        try {
            const { status, message } = (await axios.post(`${SERVER}:${PORT}/auth/signup`, {
                email,
                firstname: firstName,
                lastname: lastName,
                password,
                confirm_password: confirmPassword
            })).data;
            if (!status) {
                setErrorMessage(message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        });
        setErrorMessage('');
    }

    return (
        <form onChange={handleChange} onSubmit={handleSubmit} className="mt-5 mx-auto col-sm-6">
            <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" required />
            </div>
            <div className="form-group">
                <label htmlFor="firstName">First name</label>
                <input type="text" className="form-control" id="firstName" placeholder="Enter first name" required />
            </div>
            <div className="form-group">
                <label htmlFor="lastName">Last name</label>
                <input type="text" className="form-control" id="lastName" placeholder="Enter last name" required />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Password" required />
            </div>
            <div className="form-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm password" required />
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

export default SignUp;