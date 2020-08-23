import React from 'react';
import {Form} from 'react-bootstrap';
import {Formik, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {FormContainer, FormButton, FormStyles, PageTitleCentered, ParaTextLeft} from "../componentStyling";
import axios from "axios";
import {saveAs} from 'file-saver';
import downloadImage from '../data/images/download.png';

// Schema for yup
const validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "*Names must have at least 2 characters")
        .max(100, "*Names can't be longer than 100 characters")
        .required("*Name is required"),
    email: Yup.string()
        .email("*Must be a valid email address")
        .max(100, "*Email must be less than 100 characters")
        .required("*Email is required"),
});

const Download = () => {
    return (

        <div className="container-fluid px-6">
            {/* Download Section */}
            <div className="row top-buffer">
                <div className="col-md-2"></div>
                <div className="col-md-8">
                    <PageTitleCentered>
                        Download the Dataset
                    </PageTitleCentered>
                </div>
                <div className="col-md-2"></div>
            </div>
            <FormContainer>
            <div className="row top-spacer-1">
                <div className="col-md-8">
                    <ParaTextLeft>The data made available here has been compiled from the excavation of Antioch, which
                        was conducted by a consortium of institutions led by Princeton University from 1932-1939.
                        This dataset is not of the full catalog, but the 10,110 coin finds dated between 330 BCE and 450
                        CE.</ParaTextLeft>
                    <ParaTextLeft>
                        The dataset is in csv format encoded as <a
                        href="https://en.wikipedia.org/wiki/UTF-8#:~:text=UTF%2D8%20(8%2Dbit,Ken%20Thompson%20and%20Rob%20Pike."> UTF-8</a> supplemented
                        with a detailed description.
                    </ParaTextLeft>
                    <ParaTextLeft> Please provide your your name and email address in the form on the right side to start
                        the download.
                    </ParaTextLeft>
                    <img src={downloadImage} alt="Screenshot dataset" className="w-100"/>
                </div>

                    <div className="col-md-4">
                        <Formik
                            initialValues={{name: "", email: ""}}
                            validationSchema={validationSchema}
                            onSubmit={(values, {setSubmitting, resetForm}) => {
                                // When button submits form and form is in the process of submitting, submit button is disabled
                                setSubmitting(true);

                                //send data for email
                                axios.post('http://localhost:3002/send', values)
                                    .then((response) => {
                                        console.log(response);
                                    }, (error) => {
                                        console.log(error);
                                    });
                                //download the data (currently in public folder)
                                saveAs(
                                    process.env.PUBLIC_URL + "/resources/Antioch_Dataset_08032020.zip",
                                    "Antioch_Dataset_08032020.zip");
                            }}
                        >
                            {({
                                  values,
                                  errors,
                                  touched,
                                  handleChange,
                                  handleBlur,
                                  handleSubmit,
                                  isSubmitting
                              }) => (
                                <FormStyles onSubmit={handleSubmit} className="mx-auto">
                                    <Form.Group controlId="formName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            placeholder="Full Name"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.name}
                                            className={touched.name && errors.name ? "has-error" : null}
                                        />
                                        {touched.name && errors.name ? (
                                            <div className="error-message">{errors.name}</div>
                                        ) : null}
                                    </Form.Group>
                                    <Form.Group controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="email"
                                            placeholder="Email"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.email}
                                            className={touched.email && errors.email ? "has-error" : null}
                                        />
                                        {touched.email && errors.email ? (
                                            <div className="error-message">{errors.email}</div>
                                        ) : null}
                                    </Form.Group>
                                    {/*Submit button that is disabled after button is clicked/form is in the process of submitting*/}
                                    <FormButton variant="primary" type="submit" disabled={isSubmitting}>
                                        Submit
                                    </FormButton>
                                </FormStyles>
                            )}
                        </Formik>
                    </div>
            </div>
            </FormContainer>
            <div className="row top-buffer"></div>
        </div>
    );
}


export default Download;
