import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../features/common/modalSlice";
import ConfirmationModalBody from "../features/common/components/ConfirmationModalBody";
import EditPeopleModal from "../features/people/components/EditPeopleModal";
import AddEditCategoryModal from "../features/category/components/AddEditCategoryModal";

import { MODAL_BODY_TYPES } from "../utils/globalConstantUtil";
import { clearcategoryDetails } from "../features/category/categorySlice";
import { clearpeopleDetails } from "../features/people/peopleSlice";
import AddEditSubCategoryModal from "../features/subCategory/components/AddEditSubCategoryModal";
import ExportPreviewModal from "../features/common/components/ExportPreviewModal";
import ReportModal from "../features/common/components/ReportMoal";
import { clearsubcategoryDetails } from "../features/subCategory/subCategorySlice";
import GenerateTodaysReportModal from "../features/dashboard/components/GenerateTodaysReportModal";

export default function ModalLayout() {
  const dispatch = useDispatch();
  const { isOpen, bodyType, extraObject, title } = useSelector(
    (state) => state.modal
  );

  if (!isOpen) return null;

  const close = () => {
    dispatch(closeModal());
    dispatch(clearcategoryDetails());
    dispatch(clearsubcategoryDetails());
    dispatch(clearpeopleDetails());
  };

  const renderModalBody = () => {
    switch (bodyType) {
      case MODAL_BODY_TYPES.CONFIRMATION:
        return (
          <ConfirmationModalBody extraObject={extraObject} closeModal={close} />
        );
      case MODAL_BODY_TYPES.EDIT_PEOPLE:
        return <EditPeopleModal extraObject={extraObject} closeModal={close} />;
      case MODAL_BODY_TYPES.ADD_EDIT_CATEGORY:
        return (
          <AddEditCategoryModal extraObject={extraObject} closeModal={close} />
        );
      case MODAL_BODY_TYPES.ADD_EDIT_SUB_CATEGORY:
        return (
          <AddEditSubCategoryModal
            extraObject={extraObject}
            closeModal={close}
          />
        );
      case MODAL_BODY_TYPES.EXCEL_PREVIEW:
        return (
          <ExportPreviewModal extraObject={extraObject} closeModal={close} />
        );
      case MODAL_BODY_TYPES.GENERATE_REPORT:
        return <ReportModal extraObject={extraObject} closeModal={close} />;
      case MODAL_BODY_TYPES.GENERATE_TODAYS_REPORT:
        return (
          <GenerateTodaysReportModal
            title={title}
            extraObject={extraObject}
            closeModal={close}
          />
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
