import Layout from "@/components/Layout";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import trash from "@/assets/trash.svg";
import edit from "@/assets/edit.svg";
import TitlePage from "@/components/Common/TitlePage";
import AddData from "@/components/Common/AddData";
import ModalCommon from "@/components/Common/ModalCommon";
import TableCommon from "@/components/Common/TableCommon";
import UserForm from "@/components/Form/UserForm";
import sendGetAllUserRequest, { sendDeleteUserRequest } from "@/api/user";
import { IUserData } from "@/models/auth";
import useAuthStore from '@/stores/authStore';
import Swal from 'sweetalert2'

export default function User() {
  const { authState } = useAuthStore()
  const tableHeader = ["Name", "Email", "Username", "Role", "Action"];
  const [modalShow, setModalShow] = useState(false);
  const [confirmationShow, setConfirmationShow] = useState(false);
  const [allUser, setAllUser] = useState<IUserData[]>([])
  const [idUser, setIdUser] = useState<string>('')


  useEffect(() => {
    if (authState) {
      sendGetAllUserRequest().then((res) => {
        setAllUser(res.data as IUserData[])
      });
    }
  }, [authState]);

  const handleModalShow = () => {
    setModalShow(true);
  };

  const handleModalClose = () => {
    setModalShow(false);
  };

  const handleConfirmationShow = () => {
    setConfirmationShow(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationShow(false);
  };

  const handleDeleteUser = () => {
    sendDeleteUserRequest(idUser).then((res) => {
      setConfirmationShow(false);
      Swal.fire({
        icon: 'success',
        title: `User ${(res.data as IUserData).firstName} deleted successfully`,
        showConfirmButton: false,
        timer: 1500
      })
    })
  }

  const handleConfirmationDelete = (id: string) => {
    setConfirmationShow(true);
    setIdUser(id)
  }

  return (
    <Layout isSidebar={true}>
      <Container>
        <Row>
          <TitlePage title="User" />
          <Col lg={12}>
            <AddData handleModalShow={handleModalShow} type="user" />
            <TableCommon
              tableHeader={tableHeader}
              handleModalShow={handleModalShow}
              handleConfirmationShow={handleConfirmationShow}
            >
              {allUser.map((user) => (
                <tr className="align-middle" key={user._id}>
                  <td>{user.firstName}</td>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.role === 0 ? 'HR' : 'Vendor'}</td>
                  <td className="d-flex gap-2">
                    <div onClick={handleModalShow}>
                      <Image src={edit} alt="edit" width={20} height={20} />
                    </div>

                    <div onClick={() => handleConfirmationDelete(user._id)}>
                      <Image src={trash} alt="trash" width={20} height={20} />
                    </div>
                  </td>
                </tr>
              ))}
            </TableCommon>
          </Col>
        </Row>
      </Container>
      <ModalCommon
        show={modalShow}
        title="Add User"
        handleModalClose={handleModalClose}
        size="md"
        handleModalShow={handleModalShow}
      >
        <UserForm />
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
          <button className="btn btn-primary" onClick={handleDeleteUser}>Yes</button>
          <button className="btn btn-secondary">No</button>
        </div>
      </ModalCommon>
    </Layout>
  );
}
