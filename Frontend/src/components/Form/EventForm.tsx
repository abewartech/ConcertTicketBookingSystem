import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import Select, { StylesConfig } from "react-select";
import * as Yup from "yup";
import dynamic from "next/dynamic";
import sendGetAllUserRequest from "@/api/user";
import sendGetAllVendorRequest from "@/api/vendor";
import { sendAddEventRequest } from "@/api/event";
import { IUserData } from "@/models/auth";
import { IVendorData } from "@/models/vendor";
import DatePicker from "react-multi-date-picker";
import { IEventData } from "@/models/event";
import Swal from "sweetalert2";

const MapWithNoSSR = dynamic(() => import("./Map"), { ssr: false });

interface FormValues {
  eventName: string;
  companyId: string;
  proposedDates: Date[];
  proposedLocation: string;
  status: "Pending" | "Approved" | "Rejected";
  vendorId: string;
  confirmedDate?: Date;
  remarks?: string;
}

const validationSchema = Yup.object({
  eventName: Yup.string().required("Required"),
  companyId: Yup.string().required("Required"),
  proposedLocation: Yup.string().required("Required"),
  vendorId: Yup.string().required("Required"),
  remarks: Yup.string().nullable(),
  proposedDates: Yup.array()
    .of(Yup.date())
    .min(1, "At least one date is required"),
});

const customStylesReactSelect: StylesConfig = {
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    width: "100%",
    minWidth: "100%",
  }),
};

const EventForm: React.FC<{ handleModalClose: () => void }> = ({
  handleModalClose,
}) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    1.3521, 103.8198,
  ]);

  const [users, setUsers] = useState<{ label: string; value: string }[]>([]);
  const [vendors, setVendors] = useState<{ label: string; value: string }[]>(
    []
  );

  const today = new Date();
  const tomorrow = new Date();

  tomorrow.setDate(tomorrow.getDate() + 1);

  const [values, setValues] = useState([today, tomorrow]);

  useEffect(() => {
    sendGetAllUserRequest().then((data) => {
      const users = data.data as IUserData[];
      const usersWithFullName = users.map((user: IUserData) => ({
        label: user.firstName,
        value: user._id,
      }));
      setUsers(usersWithFullName);
    });
    sendGetAllVendorRequest().then((data) => {
      const vendors = data.data as IVendorData[];
      const vendorsWithFullName = vendors.map((vendor: IVendorData) => ({
        label: vendor.vendorName,
        value: vendor._id,
      }));
      setVendors(vendorsWithFullName);
    });
    console.log(values);
  }, []);

  return (
    <div>
      <Formik
        initialValues={{
          eventName: "",
          companyId: "",
          proposedDates: values,
          proposedLocation: "",
          status: "Pending",
          vendorId: "",
          confirmedDate: undefined,
          remarks: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(
          values: FormValues,
          { setSubmitting }: FormikHelpers<FormValues>
        ) => {
          setTimeout(() => {
            const newValues = {
              ...values,
              proposedLocation: {
                lat: markerPosition[0],
                lng: markerPosition[1],
              },
            };
            sendAddEventRequest(newValues)
              .then((response) => {
                const data: IEventData = response.data;
                console.log(data);
                Swal.fire({
                  title: "Success",
                  text: "Event added successfully",
                  icon: "success",
                  confirmButtonText: "OK",
                }).then(() => {
                  handleModalClose();
                });
              })
              .catch((error) => {
                Swal.fire({
                  title: "Error",
                  text: error.response?.data.message,
                  icon: "error",
                  confirmButtonText: "OK",
                });
              });
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ isSubmitting, setFieldValue, errors }) => (
          <Form>
            <div className="form-group d-flex flex-column mb-3">
              <label htmlFor="eventName">Event Name</label>
              <Field type="text" name="eventName" />
              <ErrorMessage
                name="eventName"
                component="div"
                className="text-danger font-size-10"
              />
            </div>
            <div className="form-group d-flex flex-column mb-3">
              <label htmlFor="companyId">Company Name</label>
              <Select
                placeholder="Pilih company"
                options={users}
                isSearchable
                name="companyId"
                styles={customStylesReactSelect}
                onChange={(option) =>
                  setFieldValue(
                    "companyId",
                    (option as { value: string }).value
                  )
                }
                className={errors.companyId ? "is-invalid" : ""}
              />
              <ErrorMessage
                name="companyId"
                component="div"
                className="text-danger font-size-10"
              />
            </div>
            <div className="form-group d-flex flex-column mb-3">
              <label htmlFor="vendorId">Vendor</label>
              <Select
                placeholder="Pilih vendor"
                options={vendors}
                isSearchable
                name="vendorId"
                styles={customStylesReactSelect}
                onChange={(option) =>
                  setFieldValue("vendorId", (option as { value: string }).value)
                }
                className={errors.vendorId ? "is-invalid" : ""}
              />
              <ErrorMessage
                name="vendorId"
                component="div"
                className="text-danger font-size-10"
              />
            </div>
            <div className="form-group d-flex flex-column mb-3">
              <label htmlFor="proposedDates">Proposed Date</label>
              <DatePicker
                multiple
                value={values}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(date: any[]) => {
                  const newValues = date.map(
                    (d) => new Date(d.year, d.month - 1, d.day)
                  );
                  setValues(newValues);
                  setFieldValue("proposedDates", newValues);
                }}
                name="proposedDates"
                inputClass="custom-input w-100"
                className="custom-calendar"
                arrowClassName="custom-arrow"
                containerClassName="custom-container w-100"
              />
              <ErrorMessage
                name="proposedDates"
                component="div"
                className="text-danger font-size-10"
              />
            </div>
            <div className="form-group d-flex flex-column mb-5">
              <label htmlFor="proposedLocation">Proposed Location</label>
              <MapWithNoSSR
                center={markerPosition}
                zoom={10.5}
                scrollWheelZoom={false}
                setMarkerPosition={setMarkerPosition}
                setFieldValue={setFieldValue}
              />
              <Field
                type="text"
                name="proposedLocation"
                value={markerPosition.join(",")}
              />
              <ErrorMessage
                name="proposedLocation"
                component="div"
                className="text-danger font-size-10"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EventForm;
