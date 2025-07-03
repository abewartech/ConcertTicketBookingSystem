import Image from "next/image";
import plus from "@/assets/add.svg";

export default function AddData({
  handleModalShow,
  type,
}: {
  handleModalShow: () => void;
  type: string;
}) {
  return (
    <div className="d-flex justify-content-end">
      <div className="btn-custom" onClick={handleModalShow}>
        <Image src={plus} alt="plus" width={20} height={20} className="me-1" />
        Add {type}
      </div>
    </div>
  );
}
