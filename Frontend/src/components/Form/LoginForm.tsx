import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { Col, Row, Alert, Card } from "react-bootstrap";
import sendLoginRequest from "@/api/auth";
import {
  ILoginFormValue,
  ILoginResponse,
  ILoginResponseFail,
} from "@/models/auth";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";

const LoginForm: React.FC = () => {
  const { setAuthStateZustand, setToken, setData } = useAuthStore();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  return (
    <div>
      <Card>
        <Card.Body>
          <h5 className="mb-3">Login</h5>
          <Formik
            initialValues={{ email: "", password: "" }}
            validate={(values: ILoginFormValue) => {
              const errors: Partial<ILoginFormValue> = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                  values.email
                ) &&
                !/^[A-Z0-9._%+-]+$/i.test(values.email) // Allow username without domain
              ) {
                errors.email = "Invalid email or username";
              }
              if (!values.password) {
                errors.password = "Required";
              }
              return errors;
            }}
            onSubmit={(
              values: ILoginFormValue,
              { setSubmitting }: FormikHelpers<ILoginFormValue>
            ) => {
              sendLoginRequest(values)
                .then((response) => {
                  const { data } = response;
                  if (data?.code) {
                    const dataTyped: ILoginResponseFail = data;
                    setErrorMessage(dataTyped.message);
                  } else {
                    const dataTyped: ILoginResponse = data;
                    setAuthStateZustand(true);
                    setToken(dataTyped.token);
                    setData(dataTyped.user);
                    localStorage.setItem(
                      "user",
                      JSON.stringify(dataTyped.user)
                    );
                    setTimeout(() => {
                      router.push("/dashboard/user");
                    }, 100);
                  }
                })
                .catch((error) => {
                  console.log(error);
                })
                .finally(() => {
                  setSubmitting(false);
                });
            }}
          >
            {({ isSubmitting }) => (
              <Row className="justify-content-center align-items-center">
                <Form>
                  <div className="form-group d-flex flex-column mb-3">
                    <label htmlFor="email">Email or Username</label>
                    <Field type="text" name="email" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger font-size-10"
                    />
                  </div>
                  <div className="form-group d-flex flex-column mb-4">
                    <label htmlFor="password">Password</label>
                    <Field type="password" name="password" />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger font-size-10"
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      Submit
                    </button>
                  </div>
                  {errorMessage !== "" ? (
                    <Row className="mt-2">
                      <Col>
                        <Alert key="danger" variant="danger">
                          {errorMessage}
                        </Alert>
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                </Form>
              </Row>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginForm;
