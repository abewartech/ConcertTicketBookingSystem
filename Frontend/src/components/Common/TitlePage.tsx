import { Col } from "react-bootstrap";

export default function TitlePage({ title }: { title: string }) {
  return (
    <Col lg={12} className="mb-3">
      <h2>
        <b>{title}</b>
      </h2>
    </Col>
  );
}
