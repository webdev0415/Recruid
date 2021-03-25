import React, { useState } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import { API_ROOT_PATH } from "constants/api";
import { ModalBody, ModalFooter } from "modals/UniversalModal/UniversalModal";
import styled from "styled-components";

const CardPaymentStripe = (props) => {
  const [pending, setPending] = useState(false);

  const updateCard = async () => {
    setPending(true);
    const url = API_ROOT_PATH + `/v1/payments/${props.companyId}/update_card`;
    try {
      let { token } = await props.stripe.createToken();

      fetch(url, {
        method: "POST",
        headers: props.session,
        body: JSON.stringify({
          token: token,
        }),
      })
        .then((response) => {
          if (response.ok) {
            setPending(false);
            props.handleCloseModal();
            props.updateCardState(
              token.card.last4,
              `${token.card.exp_month}/${token.card.exp_year}`
            );
          } else {
            setPending(false);
            alert(
              "There was a problem with your card details, Please try again."
            );
          }
        })
        .catch(() => {
          setPending(false);
          alert(
            "There was a problem with your card details, Please try again."
          );
        });
    } catch {
      setPending(false);
      alert("There was a problem with your card details, Please try again.");
    }
  };

  return (
    <>
      <ModalBody>
        <CardPaymentWrapper>
          <CardElement hidePostalCode={true} />
        </CardPaymentWrapper>
      </ModalBody>
      <ModalFooter hide={props.handleCloseModal} cancelText="Cancel">
        <button
          id="forward"
          className="button button--default button--blue-dark"
          onClick={updateCard}
          style={{ maxWidth: "max-content" }}
        >
          {pending ? "Changing..." : "Change"}
        </button>
      </ModalFooter>
    </>
  );
};

export default injectStripe(CardPaymentStripe);

const CardPaymentWrapper = styled.div`
  padding: 30px;
`;
