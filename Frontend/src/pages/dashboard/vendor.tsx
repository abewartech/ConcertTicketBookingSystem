import AddData from "@/components/Common/AddData";
import TableCommon from "@/components/Common/TableCommon";
import TitlePage from "@/components/Common/TitlePage";
import Layout from "@/components/Layout";
import Image from "next/image";
import edit from "@/assets/edit.svg";
import trash from "@/assets/trash.svg";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ModalCommon from "@/components/Common/ModalCommon";
import VendorForm from "@/components/Form/VendorForm";
import { IVendorData } from "@/models/vendor";
import { useEffect } from "react";
import sendGetAllVendorRequest from "@/api/vendor";

export default function Vendor() {
  const tableHeader = ["Name", "Description", "Action"];
  const [show, setShow] = useState(false);
  const [confirmationShow, setConfirmationShow] = useState(false);
  const [allVendor, setAllVendor] = useState<IVendorData[]>([]);

  const handleModalShow = () => {
    setShow(true);
  };

  const handleConfirmationShow = () => {
    setConfirmationShow(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationShow(false);
  };

  const handleModalClose = () => {
    setShow(false);
  };

  useEffect(() => {
    sendGetAllVendorRequest().then((res) => {
      setAllVendor(res.data as IVendorData[]);
    });
  }, []);

  return (
    <Layout isSidebar={true}>
      <Container>
        <Row>
          <TitlePage title="Vendor" />
          <Col lg={12}>
            <AddData handleModalShow={handleModalShow} type="vendor" />
            <TableCommon
              tableHeader={tableHeader}
              handleModalShow={handleModalShow}
              handleConfirmationShow={handleConfirmationShow}
            >
              {allVendor.map((vendor) => (
                <tr className="align-middle" key={vendor._id}>
                  <td>{vendor.vendorName}</td>
                  <td>{vendor.userId}</td>
                  <td className="d-flex gap-2">
                    <div onClick={handleModalShow}>
                      <Image src={edit} alt="edit" width={20} height={20} />
                    </div>

                    <div onClick={handleConfirmationShow}>
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
          title="Add Vendor"
          handleModalClose={handleModalClose}
          size="md"
          handleModalShow={handleModalShow}
        >
          <VendorForm />
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
            <button className="btn btn-primary">Yes</button>
            <button className="btn btn-secondary">No</button>
          </div>
        </ModalCommon>
      </Container>
    </Layout>
  );
}
