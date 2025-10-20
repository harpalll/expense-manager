import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../features/common/modalSlice";
import ConfirmationModalBody from "../features/common/components/ConfirmationModalBody";

export default function ModalLayout() {
  const dispatch = useDispatch();
  const { isOpen, bodyType, extraObject } = useSelector((state) => state.modal);

  if (!isOpen) return null;

  const close = () => dispatch(closeModal());

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        {bodyType === "CONFIRMATION_MODAL" && (
          <ConfirmationModalBody extraObject={extraObject} closeModal={close} />
        )}
      </div>
      <div className="modal-backdrop" onClick={close}></div>
    </div>
  );
}
