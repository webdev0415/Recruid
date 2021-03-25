import React, { Fragment } from "react";
import styled from "styled-components";
import Spinner from "sharedComponents/Spinner";

const PlanCard = ({
  currentPlan,
  upcomingPlan,
  handleModalStageChange,
  teamMembers,
  upcomingPlanPending,
}) => {
  return (
    <div>
      <Fragment>
        <PlanContainer>
          <PlanBox>
            <PlanTitle>Current Plan</PlanTitle>
            <PlanNumber>
              {currentPlan ? `up to ${currentPlan?.total_seats} users` : "-"}
            </PlanNumber>
          </PlanBox>
          <PlanBox>
            <PlanTitle>Cost</PlanTitle>
            <PlanNumber>
              {currentPlan
                ? `£${currentPlan?.amount / 100}/${
                    currentPlan.name.includes("yearly") ? "year" : "month"
                  }`
                : "-"}
            </PlanNumber>
          </PlanBox>
          <PlanBox>
            <PlanTitle>Users</PlanTitle>
            <PlanNumber>
              {currentPlan ? teamMembers?.length : teamMembers?.length ?? 0}
            </PlanNumber>
          </PlanBox>
        </PlanContainer>
        <p>
          You have run out of seats on your current plan, please upgrade your
          plan to add more.
        </p>
        <PlanInfo>
          {upcomingPlanPending ? (
            <Fragment>
              <Spinner style={{ padding: "76.5px" }} />
              <button className="button button--default button--grey button--full">
                Upgrade
              </button>
            </Fragment>
          ) : (
            <Fragment>
              <PlanInfoTitle>
                {currentPlan?.total_seats} - {upcomingPlan?.seats} users
              </PlanInfoTitle>
              <p>
                Upgrading your account will allow up to {upcomingPlan?.seats}{" "}
                users on the platform.
              </p>
              <PlanInfoPrice>
                £{upcomingPlan?.amount / 100}/
                {upcomingPlan?.nickname.includes("yearly") ? "year" : "month"}
              </PlanInfoPrice>
              <button
                className="button button--default button--dark button--full"
                onClick={handleModalStageChange("confirm")}
              >
                Upgrade
              </button>
            </Fragment>
          )}
        </PlanInfo>
      </Fragment>
    </div>
  );
};

export default PlanCard;

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
  border: 1px solid #eeeeee;
  border-radius: 4px;
  padding: 25px;

  p {
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 20px;
    padding-bottom: 20px;
  }
`;

const PlanInfoTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const PlanInfoPrice = styled.span`
  font-size: 18px;
  margin-bottom: 20px;
  text-align: right;
`;
