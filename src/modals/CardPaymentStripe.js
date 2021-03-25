import React, { useState } from "react";
import styled from "styled-components";
import { CardElement, injectStripe } from "react-stripe-elements";

import { API_ROOT_PATH } from "constants/api";

const CardContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  margin-top: 10px;

  button {
    width: auto;
  }
`;

const CardPaymentStripe = props => {
  const [pending, setPending] = useState(false);

  const updateCard = async () => {
    setPending(true);
    const url = API_ROOT_PATH + `/v1/payments/${props.companyId}//update_card`;

    try {
      let { token } = await props.stripe.createToken();

      fetch(url, {
        method: "POST",
        headers: props.session,
        body: JSON.stringify({
          token: token
        })
      }).then(response => {
        setPending(false);
        if (response.ok) {
          response.json().then(res => {
            props.updateCardDetails(
              res.brand,
              res.last4,
              res.exp_year,
              res.exp_month
            );
            props.cancel();
          });
        } else {
          alert(
            "There was a problem with your card details, Please try again."
          );
        }
      });
    } catch {
      alert("There was a problem with your card details, Please try again.");
    }
  };

  return (
    <CardContainer>
      <CardElement hidePostalCode={true} />
      <ButtonContainer>
        <button
          type="button"
          className="button button--default button--primary button--full"
          onClick={() => updateCard()}
          disabled={pending}
          style={{ marginRight: "5px", width: "100%" }}
        >
          {pending ? "Adding..." : "Add Card"}
        </button>
        <button
          type="button"
          className="button button--default button--grey button--full"
          onClick={props.cancel}
          disabled={pending}
          style={{ marginLeft: "5px", width: "100%" }}
        >
          Cancel
        </button>
      </ButtonContainer>
    </CardContainer>
  );
};

export default injectStripe(CardPaymentStripe);
