import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../features/common/modalSlice";
import ConfirmationModalBody from "../features/common/components/ConfirmationModalBody";
// import AddEditPeopleModal from "../features/people/components/AddEditPeopleModal";
import AddEditCategoryModal from "../features/category/components/AddEditCategoryModal";

import { MODAL_BODY_TYPES } from "../utils/globalConstantUtil";
import { clearcategoryDetails } from "../features/category/categorySlice";

export default function ModalLayout() {
  const dispatch = useDispatch();
  const { isOpen, bodyType, extraObject } = useSelector((state) => state.modal);

  if (!isOpen) return null;

  const close = () => {
    dispatch(closeModal());
    dispatch(clearcategoryDetails());
  };

  const renderModalBody = () => {
    switch (bodyType) {
      case MODAL_BODY_TYPES.CONFIRMATION:
        return (
          <ConfirmationModalBody extraObject={extraObject} closeModal={close} />
        );
      // case MODAL_BODY_TYPES.ADD_EDIT_PEOPLE:
      //   return (
      //     <AddEditPeopleModal extraObject={extraObject} closeModal={close} />
      //   );
      case MODAL_BODY_TYPES.ADD_EDIT_CATEGORY:
        return (
          <AddEditCategoryModal extraObject={extraObject} closeModal={close} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-xl">{renderModalBody()}</div>
      <div className="modal-backdrop" onClick={close}></div>
    </div>
  );
}
