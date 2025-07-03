import AddData from "@/components/Common/AddData";
import TableCommon from "@/components/Common/TableCommon";
import TitlePage from "@/components/Common/TitlePage";
import Layout from "@/components/Layout";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import trash from "@/assets/trash.svg";
import view from "@/assets/view.svg";
import ModalCommon from "@/components/Common/ModalCommon";
import EventForm from "@/components/Form/EventForm";
import dynamic from 'next/dynamic';
import sendGetAllEventRequest, { sendDeleteEventRequest, sendApproveEventRequest, sendRejectEventRequest } from "@/api/event";
import { IEventData } from "@/models/event";
import useAuthStore from "@/stores/authStore";
import Swal from 'sweetalert2'
import dayjs from "dayjs";
import Select, { StylesConfig } from 'react-select'

const MapWithNoSSR = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Event() {
  const { user } = useAuthStore();
  const tableHeader = ["Event Name", "Vendor Name", "Confirmed Date", "Proposed Date", "Status", "Date Created", "Action"];
  const [show, setShow] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [confirmationShow, setConfirmationShow] = useState(false);
  const [confirmationApproveShow, setConfirmationApproveShow] = useState(false);
  const [confirmationRejectShow, setConfirmationRejectShow] = useState(false);
  const [allEvent, setAllEvent] = useState<IEventData[]>([])
  const [idEvent, setIdEvent] = useState<string>('')
  const [viewEvent, setViewEvent] = useState<IEventData>({} as IEventData)
  const [proposedDates, setProposedDates] = useState<{ label: string; value: string }[]>([])
  const [selectedProposedDate, setSelectedProposedDate] = useState<string>('')
  const [rejectionReason, setRejectionReason] = useState<string>('')

  const customStylesReactSelect: StylesConfig = {
    container: (provided) => ({
      ...provided,
      width: '100%',
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      width: '100%',
      minWidth: '100%',
    }),
  }

  const handleModalShow = () => {
    setShow(true);
  };

  const handleConfirmationShow = () => {
    setConfirmationShow(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationShow(false);
    setConfirmationApproveShow(false);
    setConfirmationRejectShow(false);
  };

  const handleModalClose = () => {
    setShow(false);
  };

  const handleViewModalShow = () => {
    setViewShow(true);
  };

  useEffect(() => {
    fetchAllEvent()
  }, []);

  useEffect(() => {
    fetchAllEvent()
  }, [show]);

  const fetchAllEvent = () => {
    sendGetAllEventRequest().then((res) => {
      const userId = user._id
      const role = user.role
      const allEvent = res.data as IEventData[]
      const filterEvent = allEvent.filter((event) => {
        if(role === 1){
          return event?.vendorId?.userId === userId
        }else{
          return event.companyId === userId
        }
      })
      setAllEvent(filterEvent)
    });
  }

  const handleViewModalClose = () => {
    setViewShow(false);
  };

  const handleDeleteEvent = () => {
    sendDeleteEventRequest(idEvent).then((res) => {
      setConfirmationShow(false);
      Swal.fire({
        icon: 'success',
        title: `Event ${(res.data as IEventData).eventName} deleted successfully`,
        showConfirmButton: false,
        timer: 1500
      })
      fetchAllEvent()
    })
  }

  const handleConfirmationDelete = (id: string) => {
    setConfirmationShow(true);
    setIdEvent(id)
  }

  const handleViewEventModalShow = (event: IEventData) => {
    setViewEvent(event)
    setViewShow(true);
    setProposedDates(event.proposedDates.map((date) => ({ label: dayjs(date).format('DD/MM/YYYY'), value: date.toString() })))
  }


  const handleApproveEvent = () => {
    setViewShow(false);
    setConfirmationApproveShow(true);
  }

  const handleApprovedEvent = () => {
    setConfirmationApproveShow(false);
    sendApproveEventRequest(viewEvent._id, selectedProposedDate).then((res) => {
      if(res.data){
        Swal.fire({
          icon: 'success',
          title: `Event ${(res.data as IEventData).eventName} approved successfully`,
          showConfirmButton: false,
          timer: 1500
        })
        fetchAllEvent()
      }
    })
  }

  const handleRejectedEvent = () => {
    setConfirmationRejectShow(false);
    sendRejectEventRequest(viewEvent._id, rejectionReason).then((res) => {
      if(res.data){
        Swal.fire({
          icon: 'success',
          title: `Event ${(res.data as IEventData).eventName} rejected successfully`,
          showConfirmButton: false,
          timer: 1500
        })
        fetchAllEvent()
      }
    })
  }

  const handleRejectEvent = () => {
    setViewShow(false);
    setConfirmationRejectShow(true);
  }

  return (
    <Layout isSidebar={true}>
      <Container>
        <Row>
          <TitlePage title="Event" />
          <Col lg={12}>
            <Row className="mb-3">
              <Col>
                <MapWithNoSSR center={[1.3521, 103.8198]} zoom={10.5} scrollWheelZoom={false} allEvent={allEvent} />
              </Col>
            </Row>
            <AddData handleModalShow={handleModalShow} type="event" />
            <TableCommon
              tableHeader={tableHeader}
              handleModalShow={handleModalShow}
              handleConfirmationShow={handleConfirmationShow}
            >
              {allEvent.map((event) => (
                <tr className="align-middle" key={event._id}>
                  <td>{event.eventName}</td>
                  <td>{event?.vendorId?.vendorName}</td>
                  <td>{event?.confirmedDate ? dayjs(event?.confirmedDate).format('DD/MM/YYYY') : '-'}</td>
                  <td>{event.proposedDates.map((date) => dayjs(date).format('DD/MM/YYYY')).join(', ')}</td>
                  <td>{event.status}</td>
                  <td>{dayjs(event.createdAt).format('DD/MM/YYYY')}</td>
                  <td className="d-flex gap-2">
                    <div onClick={() => handleViewEventModalShow(event)}>
                      <Image src={view} alt="view" width={20} height={20} />
                    </div>

                    <div onClick={() => handleConfirmationDelete(event._id)}>
                      <Image src={trash} alt="trash" width={20} height={20} />
                    </div>
                  </td>
                </tr>
              ))}
            </TableCommon>
          </Col>
        </Row>
        <ModalCommon
          show={show}
          title="Add Event"
          handleModalClose={handleModalClose}
          size="md"
          handleModalShow={handleModalShow}
        >
          <EventForm handleModalClose={handleModalClose} />
        </ModalCommon>
        <ModalCommon
          show={viewShow}
          title="View Event"
          handleModalClose={handleViewModalClose}
          size="md"
          handleModalShow={handleViewModalShow}
        >
          <Row>
            <Col>
              <table className="table">
                <tr>
                  <td>Event Name</td>
                  <td>{viewEvent.eventName}</td>
                </tr>
                <tr>
                  <td>Vendor Name</td>
                  <td>{viewEvent?.vendorId?.vendorName}</td>
                </tr>
                <tr>
                  <td>Confirmed Date</td>
                  <td>{dayjs(viewEvent.confirmedDate).format('DD/MM/YYYY')}</td>
                </tr>
                <tr>
                  <td>Proposed Date</td>
                  <td>{viewEvent.proposedDates?.map((date) => dayjs(date).format('DD/MM/YYYY')).join(', ')}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>{viewEvent.status}</td>
                </tr>
                <tr>
                  <td>Date Created</td>
                  <td>{dayjs(viewEvent.createdAt).format('DD/MM/YYYY')}</td>
                </tr>
                <tr>
                  <td>Remarks</td>
                  <td>{viewEvent.remarks}</td>
                </tr>
              </table>
            </Col>
          </Row>
          {user.role === 1 && (
            <Row>
              <Col md={3}>
                <Button variant="success" onClick={handleApproveEvent}>Approve</Button>
              </Col>
              <Col md={3}>
                <Button variant="danger" onClick={handleRejectEvent}>Reject</Button>
              </Col>
            </Row>
          )}
        </ModalCommon>
        <ModalCommon
          show={confirmationShow}
          title="Confirmation"
          handleModalClose={handleConfirmationClose}
          size="sm"
          handleModalShow={handleConfirmationShow}
        >
          <p>Are you sure want to delete this user?</p>
          <div className="w-100 text-end mt-3 d-flex gap-2 justify-content-end">
            <button className="btn btn-primary" onClick={handleDeleteEvent}>Yes</button>
            <button className="btn btn-secondary">No</button>
          </div>
        </ModalCommon>
        <ModalCommon
          show={confirmationApproveShow}
          title="Confirmation Date"
          handleModalClose={handleConfirmationClose}
          size="sm"
          handleModalShow={handleConfirmationShow}
        >
          <Row className="mb-3">
            <Col>
              <Select
                options={proposedDates}
                styles={customStylesReactSelect}
                onChange={(e) => setSelectedProposedDate((e as { value: string }).value)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="success" onClick={handleApprovedEvent}>Submit</Button>
            </Col>
          </Row>
        </ModalCommon>
        <ModalCommon
          show={confirmationRejectShow}
          title="Rejection Reason"
          handleModalClose={handleConfirmationClose}
          size="sm"
          handleModalShow={handleConfirmationShow}
        >
          <Row className="mb-3">
            <Col>
              <textarea
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="success" onClick={handleRejectedEvent}>Submit</Button>
            </Col>
          </Row>
        </ModalCommon>
      </Container>
    </Layout >
  );
}
