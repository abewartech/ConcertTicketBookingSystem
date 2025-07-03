import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { Row } from 'react-bootstrap';
import { IUserData } from '@/models/auth';

const UserForm: React.FC = () => {
    return (
        <div>
            <Formik
                initialValues={{ email: '', password: '', _id: '', firstName: '', createdAt: '', updatedAt: '', username: '', role: 0 }}
                onSubmit={(values: IUserData, { setSubmitting }: FormikHelpers<IUserData>) => {
                    console.log(values)
                    setSubmitting(false)
                }}
            >
                {({ isSubmitting }) => (
                    <Row className="justify-content-center align-items-center">
                        <Form>
                            <div className="form-group d-flex flex-column mb-3">
                                <label htmlFor="firstName">First Name</label>
                                <Field type="text" name="firstName" />
                                <ErrorMessage name="firstName" component="div" />
                            </div>
                            <div className="form-group d-flex flex-column mb-3">
                                <label htmlFor="email">Email</label>
                                <Field type="email" name="email" />
                                <ErrorMessage name="email" component="div" />
                            </div>
                            <div className="form-group d-flex flex-column mb-5">
                                <label htmlFor="password">Password</label>
                                <Field type="password" name="password" />
                                <ErrorMessage name="password" component="div" />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                Submit
                            </button>
                        </Form>
                    </Row>
                )}
            </Formik>
        </div>
    );

}

export default UserForm;