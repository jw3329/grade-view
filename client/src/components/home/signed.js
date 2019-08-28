import React, { useEffect, useState, Fragment } from 'react';
import Axios from 'axios';
import { SERVER } from '../../config';

const Signed = () => {

    const [gpas, setGpas] = useState([]);

    useEffect(() => {
        Axios.get(`${SERVER}/register/gpa`)
            .then(res => res.data)
            .then(({ status, info }) => {
                if (!status) throw new Error('Error occured');
                setGpas(info.reverse().map(({ course, course_number, gpa }, index) => <Fragment key={index}>{createCard(course, course_number, gpa)}</Fragment>));
            })
            .catch(error => console.log(error));
    }, []);

    const createCard = (course, courseNumber, gpa) => (
        <div className="card mt-3">
            <div className="card-body">
                <h5 className="card-title">{course}</h5>
                <h6 className="card-subtitle mb-2 text-muted">Course number: {courseNumber}</h6>
                <p className="card-text">GPA: {gpa}</p>
            </div>
        </div>
    )

    return (
        <div className="row">
            <div className="col-sm-5">
                <div className="card">
                    <div className="card-body">
                        <h1 className="text-center">Registered GPA</h1>
                        {gpas}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signed;