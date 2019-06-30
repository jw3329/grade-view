import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER, PORT } from '../../config';

const SignUp = ({ history }) => {

    const [form, setForm] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        majors: []
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [majors, setMajors] = useState([]);

    useEffect(() => {
        axios.get(`${SERVER}:${PORT}/auth/majors`)
            .then(res => res.data)
            .then(({ status, majors }) => {
                if (!status) throw new Error('Something wrong getting majors');
                setMajors([...majors]);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        const { email, firstName, lastName, password, confirmPassword, majors } = form;
        setErrorMessage('');
        try {
            const { status, message } = (await axios.post(`${SERVER}:${PORT}/auth/signup`, {
                email,
                firstname: firstName,
                lastname: lastName,
                password,
                confirm_password: confirmPassword,
                majors
            })).data;
            if (!status) {
                setErrorMessage(message);
            } else {
                // redirect to home page
                history.push('/');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = e => {
        if (e.target.options === undefined) {
            setForm({
                ...form,
                [e.target.id]: e.target.value
            });
        } else {
            setForm({
                ...form,
                majors: [...e.target.options].filter(option => option.selected).map(option => option.value)
            });
        }
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
            <div className="form-group">
                <label htmlFor="majors">Select majors</label>
                <select multiple className="form-control" id="majors">
                    {majors.map((major, index) => <option key={index}>{major}</option>)}
                </select>
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