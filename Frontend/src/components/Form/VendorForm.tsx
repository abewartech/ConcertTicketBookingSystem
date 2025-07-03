import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { Row } from 'react-bootstrap';
import { IVendorData } from '@/models/vendor';

const VendorForm: React.FC = () => {
    return (
        <div>
            <Formik
                initialValues={{ vendorName: '', userId: '', _id: '' }}
                onSubmit={(values: IVendorData, { setSubmitting }: FormikHelpers<IVendorData>) => {
                    console.log(values)
                    setSubmitting(false)
                }}
            >
                {({ isSubmitting }) => (
                    <Row className="justify-content-center align-items-center">
                        <Form>
                            <div className="form-group d-flex flex-column mb-3">
                                <label htmlFor="vendorName">Vendor Name</label>
                                <Field type="text" name="vendorName" />
                                <ErrorMessage name="vendorName" component="div" />
                            </div>
                            <div className="form-group d-flex flex-column mb-5">
                                <label htmlFor="userId">User ID</label>
                                <Field type="text" name="userId" />
                                <ErrorMessage name="userId" component="div" />
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

export default VendorForm;