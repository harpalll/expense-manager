import { useDispatch } from "react-redux";
import { showNotification } from "../headerSlice";

function ConfirmationModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();
  const { message, onConfirm } = extraObject;

  const handleConfirm = async () => {
    try {
      if (onConfirm && typeof onConfirm === "function") {
        await onConfirm();
      }
      dispatch(showNotification({ message: "Action completed!", status: 1 }));
    } catch (err) {
      dispatch(showNotification({ message: "Action failed!", status: 0 }));
    } finally {
      closeModal();
    }
  };

  return (
    <>
      <p className="text-xl mt-8 text-center">{message}</p>

      <div className="modal-action mt-12">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary w-36" onClick={handleConfirm}>
          Yes
        </button>
      </div>
    </>
  );
}

export default ConfirmationModalBody;
