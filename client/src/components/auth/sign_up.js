import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER } from '../../config';

const SignUp = () => {

    const [form, setForm] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        majors: []
    });

    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null);
    const [majors, setMajors] = useState([]);

    useEffect(() => {
        axios.get(`${SERVER}/auth/majors`)
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
        const { email, username, password, confirmPassword, majors } = form;
        setMessage('');
        try {
            const { status, message } = (await axios.post(`${SERVER}/auth/signup`, {
                email,
                username,
                password,
                confirm_password: confirmPassword,
                majors
            })).data;
            setStatus(status);
            setMessage(message);
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
        setMessage('');
    }

    return (
        <form onChange={handleChange} onSubmit={handleSubmit} className="mx-auto col-sm-6">
            <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" required />
            </div>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" className="form-control" id="username" placeholder="Enter username" required />
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
                message && (<div className={"alert alert-" + (status ? 'success' : 'danger')} role="alert">
                    {message}
                </div>)
            }
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
}

export default SignUp;