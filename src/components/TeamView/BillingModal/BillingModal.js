import React from "react";
import UniversalModal, {
  ModalHeaderClassic,
} from "modals/UniversalModal/UniversalModal";

import { Elements, StripeProvider } from "react-stripe-elements";
import CardPaymentStripe from "./CardPaymentStripe";

const EditBillingInfoModal = ({
  modalView,
  handleCloseModal,
  companyId,
  session,
  updateCardState,
}) => (
  <UniversalModal
    show={modalView}
    hide={handleCloseModal}
    id="billing-odal"
    width={480}
  >
    <ModalHeaderClassic
      title="Change your payment details"
      closeModal={handleCloseModal}
    />
    <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
      <Elements>
        <CardPaymentStripe
          handleCloseModal={handleCloseModal}
          companyId={companyId}
          session={session}
          updateCardState={updateCardState}
        />
      </Elements>
    </StripeProvider>
  </UniversalModal>
);

export default EditBillingInfoModal;
