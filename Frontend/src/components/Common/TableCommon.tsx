import { Table } from "react-bootstrap";

export default function TableCommon({
  tableHeader,
  children,
}: {
  tableHeader: string[];
  children: React.ReactNode;
  handleModalShow: () => void;
  handleConfirmationShow: () => void;
}) {
  return (
    <div className="table-responsive">
      <Table className="table table-striped">
        <thead>
          <tr>
            {tableHeader.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </Table>
    </div>
  );
}
