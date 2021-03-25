import React, { Fragment } from "react";
import CardPaymentStripe from "modals/CardPaymentStripe";
import styled from "styled-components";
import { injectStripe } from "react-stripe-elements";
import Spinner from "sharedComponents/Spinner";

const PlanCard = ({
  upcomingPlan,
  upgradePlan,
  company,
  session,
  updateCardDetails,
  bililngDetails,
  handleBillingUpdate,
  editBilling,
  teamMembers,
  subscribeIsPending,
}) => {
  return (
    <div>
      {upcomingPlan != null && bililngDetails !== null ? (
        <Fragment>
          <PlanContainer>
            <PlanBox>
              <PlanTitle>New Plan</PlanTitle>
              <PlanNumber>
                {upcomingPlan ? `up to ${upcomingPlan?.seats} users` : "-"}
              </PlanNumber>
            </PlanBox>
            <PlanBox>
              <PlanTitle>Cost</PlanTitle>
              <PlanNumber>
                {upcomingPlan ? `£${upcomingPlan?.amount / 100}/month` : "-"}
              </PlanNumber>
            </PlanBox>
            <PlanBox>
              <PlanTitle>Users</PlanTitle>
              <PlanNumber>
                {upcomingPlan ? teamMembers?.length : teamMembers?.length ?? 0}
              </PlanNumber>
            </PlanBox>
          </PlanContainer>
          <p>
            Your new subscription will be active once you confirm below, you can
            start adding new team members today and will be charged the
            difference for the remainder of this month.
          </p>
          <PlanInfo>
            {bililngDetails !== undefined && !editBilling ? (
              <CardContainer>
                <CardNumber>
                  <CardBrand>{bililngDetails?.brand}</CardBrand>
                  <span>···· {bililngDetails?.last4}</span>
                  <span>{" · "}</span>
                  <span>
                    Expires {bililngDetails?.expMonth}/{bililngDetails?.expYear}
                  </span>
                </CardNumber>
                <button
                  className="button button--default button--blue-dark"
                  onClick={handleBillingUpdate(true)}
                >
                  Edit
                </button>
              </CardContainer>
            ) : (
              <CardPaymentStripe
                companyId={company.id}
                session={session}
                cancel={handleBillingUpdate(false)}
                updateCardDetails={updateCardDetails}
              />
            )}
            <PlanInfoPrice>£{upcomingPlan?.amount / 100}/month</PlanInfoPrice>
            <button
              className="button button--default button--dark button--full"
              onClick={upgradePlan(upcomingPlan)}
            >
              {subscribeIsPending ? (
                <Spinner
                  style={{
                    padding: "15px",
                    transform: "scale(0.8)",
                  }}
                />
              ) : (
                "Confirm Upgrade"
              )}
            </button>
          </PlanInfo>
        </Fragment>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default injectStripe(PlanCard);

const CardContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const CardBrand = styled.div`
  background: rgba(0, 74, 109, 0.2);
  border-radius: 4px;
  color: #004a6d;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-right: 5px;
  padding: 1px 8px;
  text-transform: uppercase;
`;

const CardNumber = styled.div`
  align-items: center;
  display: flex;

  span {
    color: #3f3f3f;
    font-size: 12px;
    margin-left: 5px;
  }
`;

const PlanContainer = styled.div`
  background: #f6f6f6;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  line-height: 1;
  margin-bottom: 20px;
  padding: 16px 30px;

  span {
    line-height: 1;
  }
`;

const PlanBox = styled.div`
  &:not(:last-child) {
    margin-right: 40px;
  }
`;

const PlanTitle = styled.span`
  color: #74767b;
  margin-bottom: 10px;
`;

const PlanNumber = styled.span`
  font-weight: 500;
`;

const PlanInfo = styled.div`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #eeeeee;

  p {
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 20px;
    padding-bottom: 20px;
  }
`;

const PlanInfoPrice = styled.span`
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: right;
`;
