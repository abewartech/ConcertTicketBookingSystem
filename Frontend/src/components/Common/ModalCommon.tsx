import { Modal } from "react-bootstrap";

export default function ModalCommon({
  show,
  title,
  children,
  handleModalClose,
  size,
}: {
  show: boolean;
  title: string;
  children: React.ReactNode;
  size: string;
  handleModalClose: () => void;
  handleModalShow: () => void;
}) {
  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      size={size as "sm" | "lg" | "xl" | undefined}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
}
