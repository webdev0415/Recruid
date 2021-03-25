import React, { useState, useEffect } from "react";
import styled from "styled-components";
import notify from "notifications";
import {
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
} from "react-stripe-elements";
import { subscribeForPlan } from "helpersV2/pricing";
import Spinner from "sharedComponents/Spinner";

const CardDetails = ({
  stripe,
  planId,
  companyId,
  session,
  successCallback,
  triggerUpgradeBool,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (triggerUpgradeBool) {
      upgradeCompany();
    }
  }, [triggerUpgradeBool]);

  const upgradeCompany = async () => {
    let tok = null;
    let { token } = await stripe.createToken({
      name: "Name",
      type: "card",
    });
    tok = token;
    setLoading(true);
    const subscribeResponse = await subscribeForPlan(
      companyId,
      session,
      planId,
      tok?.id
    );
    if (!subscribeResponse.error) {
      successCallback();
    } else {
      setLoading(false);
      return notify("danger", subscribeResponse.message);
    }
  };

  return (
    <CardContainer>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <h3>Enter your new card details</h3>
          <CardNumberElement className="card-number card-input" />
          <CardExpiryElement className="card-expiry card-input" />
          <CardCVCElement className="card-cvc card-input" />
        </>
      )}
    </CardContainer>
  );
};

export default injectStripe(CardDetails);

const CardContainer = styled.div`
  width: 500px;

  h3 {
    font-weight: 700;
    margin-bottom: 50px;
  }

  .card-input {
    border: 0;
    border-radius: 0;
    border-bottom: 1px solid rgba(42, 55, 68, 0.2);
    box-shadow: none;
    font-family: Gelion-Regular;
    font-size: 16px;
    letter-spacing: 0.23px;
    margin-bottom: 30px;
    width: 100%;
  }
`;
