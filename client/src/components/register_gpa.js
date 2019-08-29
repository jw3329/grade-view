import React, { useEffect, useState } from 'react';
import { SERVER } from '../config';
import axios from 'axios';

const RegisterGPA = () => {


    const [majors, setMajors] = useState([]);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');
    const [registerData, setRegisterData] = useState({
        course: '',
        course_number: '',
        gpa: 'A+/A'
    });

    useEffect(() => {
        axios.get(`${SERVER}/auth/majors`)
            .then(res => res.data)
            .then(({ majors }) => {
                setMajors([...majors.filter(major => major !== 'UNDECLARED')]);
                setRegisterData(registerData => ({
                    ...registerData,
                    course: majors[1]
                }));
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const { status, message } = (await axios.post(`${SERVER}/register/gpa`, registerData)).data;
            setStatus(status);
            setMessage(message);
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = e => {
        setMessage('');
        setRegisterData({
            ...registerData,
            [e.target.id]: e.target.value
        });
    }

    return (
        <form onSubmit={handleSubmit} onChange={handleChange} className="mx-auto col-sm-6">
            <div className="form-group">
                <label htmlFor="course">Course</label>
                <select className="form-control" id="course">
                    {majors.map((major, index) => <option key={index}>{major}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="course_number">Course number</label>
                <input type="number" className="form-control" id="course_number" placeholder="Enter course number" min="100" max="999" required />
            </div>
            <div className="form-group">
                <label htmlFor="gpa">Grade</label>
                <select id="gpa" className="form-control form-control-sm">
                    <option>A+/A</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B</option>
                    <option>B-</option>
                    <option>C+</option>
                    <option>C</option>
                    <option>C-</option>
                    <option>D+</option>
                    <option>D</option>
                    <option>D-</option>
                    <option>F</option>
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

export default RegisterGPA;