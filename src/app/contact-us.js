import React from 'react';
import {Form} from 'react-bootstrap';
import {Formik, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {FormContainer, FormButton, FormStyles, PageTitleCentered} from "./componentStyling";
import axios from "axios";

// RegEx for phone number validation
const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

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
    phone: Yup.string()
        .matches(phoneRegExp, "*Phone number is not valid")
        .required("*Phone number required"),
    writtenMessage: Yup.string()
        .min(2, "*Message must have at least 2 characters")
        .required("*Message required")
});

const Contact = () => {
    return (

            <div className="container-fluid px-6">
                {/* Contact Us Section */}
                <FormContainer>
                <div className="row top-buffer">
                    <div className="col-md-4">
                        <PageTitleCentered>
                            Contact Us
                        </PageTitleCentered>
                    </div>

                    <div className="col-md-8">
                        <Formik
                            initialValues={{name: "", email: "", phone: "", writtenMessage: ""}}
                            validationSchema={validationSchema}
                            onSubmit={(values, {setSubmitting, resetForm}) => {
                                // When button submits form and form is in the process of submitting, submit button is disabled
                                setSubmitting(true);

                                // Simulate submitting to database, shows us values submitted, resets form
                               /* setTimeout(() => {
                                    alert(JSON.stringify(values, null, 2));
                                    resetForm();
                                    setSubmitting(false);
                                }, 500);*/

                                //send data for email
                                axios.post('http://localhost:3002/send', values)
                                    .then((response) => {
                                        console.log(response);
                                    }, (error) => {
                                        console.log(error);
                                    });
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
                                    <Form.Group controlId="formPhone">
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="phone"
                                            placeholder="Phone"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.phone}
                                            className={touched.phone && errors.phone ? "has-error" : null}
                                        />
                                        {touched.phone && errors.phone ? (
                                            <div className="error-message">{errors.phone}</div>
                                        ) : null}
                                    </Form.Group>
                                    <Form.Group controlId="formwrittenMessage">
                                        <Form.Label>Message</Form.Label>
                                        <Form.Control
                                            as="textArea"
                                            rows ={10}
                                            name="writtenMessage"
                                            placeholder="Message"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.writtenMessage}
                                            className={touched.writtenMessage && errors.writtenMessage ? "has-error" : null}
                                        />
                                        {touched.writtenMessage && errors.writtenMessage ? (
                                            <div className="error-message">{errors.writtenMessage}</div>
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

export default Contact;