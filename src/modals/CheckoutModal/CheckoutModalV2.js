import React, { useState, useContext, useEffect } from "react";
import { StripeProvider, Elements } from "react-stripe-elements";
import notify from "notifications";
import styled from "styled-components";

import GlobalContext from "contexts/globalContext/GlobalContext";
import {
  getPricingPlan,
  updateCompany,
} from "contexts/globalContext/GlobalMethods";
import { AWS_CDN_URL } from "constants/api";
import CardDetails from "sharedComponents/CardDetails";

import {
  getAllPlans,
  subscribeForPlan,
  // getCustomerDetails,
} from "helpersV2/pricing";

const CheckoutModal = ({ closeModal }) => {
  const store = useContext(GlobalContext);
  const [plans, setPlans] = useState([]);
  const [upcomingPlan, setUpcomingPlan] = useState(null);
  const [modalView, setModalView] = useState("initial");
  const [planDuration, setPlanDuration] = useState("yearly");
  const [saveCard, setSaveCard] = useState(false);
  // GET CURRENT AND ALL PLANS
  useEffect(() => {
    const requestController = new AbortController();
    const { signal } = requestController;
    if (store.session && store.company) {
      (async (company, session) => {
        const nextPlans = await getAllPlans(company.id, session, signal);
        if (!nextPlans.error) setPlans(nextPlans);
        else if (!signal.aborted) notify("danger", nextPlans.message);

        // const customerDetails = await getCustomerDetails(company.id, session);
        // if (!customerDetails.error && !!customerDetails.card_details) {
        //   setBillingDetails({
        //     expMonth: customerDetails?.card_details.exp_month,
        //     expYear: customerDetails?.card_details.exp_year,
        //     last4: customerDetails?.card_details.last4,
        //     brand: customerDetails?.card_details.brand,
        //   });
        // } else setBillingDetails(undefined);
      })(store.company, store.session);
    }

    return () => requestController.abort();
    // eslint-disable-next-line
  }, [store.session, store.company]);

  // SORT PLANS AND FIND UPCOMING
  useEffect(() => {
    if (plans?.length) {
      let period = store.pricingPlan?.name.includes("monthly")
        ? "monthly"
        : "yearly";
      const currentSeats = store.pricingPlan?.total_seats ?? -1;
      const sortedPlans = plans.sort((a, b) => a.seats - b.seats);
      const nextUpcomingPlan =
        currentSeats < 0
          ? sortedPlans.filter((plan) => plan.nickname.includes(period))[0]
          : sortedPlans.filter(
              (plan) =>
                plan.seats > currentSeats && plan.nickname.includes(period)
            )[0];
      setPlanDuration(period);
      setUpcomingPlan(nextUpcomingPlan ?? -1);
    }
    // eslint-disable-next-line
  }, [plans, store.pricingPlan]);

  useEffect(() => {
    if (store.pricingPlan && store.pricingPlan.name.includes("enterprise")) {
      setModalView("contact");
    }
  }, [store.pricingPlan]);

  const upgradePlan = async () => {
    const subscribeResponse = await subscribeForPlan(
      store.company.id,
      store.session,
      upcomingPlan.id
    );
    if (subscribeResponse.error) {
      return notify("danger", subscribeResponse.message);
    }
    await getPricingPlan(store.company.id, store.session, store.dispatch);
    notify("info", "Your pricing plan has been updated successfully");
    return closeModal();
  };
  const findPlan = (plan) => {
    if (plans) {
      // eslint-disable-next-line
      plans.map((pricingPlan) => {
        if (
          plan.seats === pricingPlan.seats &&
          pricingPlan.nickname.includes(planDuration) &&
          (!store.pricingPlan ||
            pricingPlan.seats > store.pricingPlan.total_seats)
        ) {
          setUpcomingPlan(pricingPlan);
        }
      });
    }
  };

  const successUpdate = async () => {
    notify("info", "Company successfully updated");
    await updateCompany(store, store.company.mention_tag);
    return closeModal();
  };

  return (
    <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
      <PricingWrapper>
        {modalView === "initial" && (
          <>
            <div style={{ right: 30, top: 30 }} className="leo-absolute">
              <button type="button" onClick={closeModal}>
                <img src={`${AWS_CDN_URL}/icons/CloseModal2.svg`} alt="Close" />
              </button>
            </div>
            {store.company?.trial === "active" && (
              <PricingToggleWrapper>
                <PricingToggleContainer>
                  <p className={planDuration === "yearly" ? "active" : ""}>
                    Pay Yearly
                  </p>
                  <PricingToggle
                    className={planDuration}
                    onClick={() => {
                      setPlanDuration(
                        planDuration === "yearly" ? "monthly" : "yearly"
                      );
                      setUpcomingPlan(null);
                    }}
                  >
                    <PricingToggleKnob className={planDuration} />
                  </PricingToggle>
                  <p className={planDuration === "monthly" ? "active" : ""}>
                    Pay Monthly
                  </p>
                </PricingToggleContainer>
                <span>
                  {planDuration === "yearly" && "Annual Plan - Save 18%"}
                </span>
              </PricingToggleWrapper>
            )}
            <PricingContainer>
              {plansTwo?.map((plan, index) => (
                <PlanContainer
                  key={index}
                  onClick={() => {
                    if (index !== plansTwo.length - 1) {
                      findPlan(plan);
                    } else {
                      setModalView("contact");
                    }
                  }}
                  className={`${
                    upcomingPlan?.seats === plan.seats ? "active" : ""
                  } ${
                    plan.seats <= store.pricingPlan?.total_seats ? "lower" : ""
                  }`}
                >
                  <PlanIcon>
                    <img src={plan.icon} alt={plan.title} />
                  </PlanIcon>
                  <PlanTitle>{plan.title}</PlanTitle>
                  {plan.monthlyCost && planDuration === "yearly" && (
                    <PlanDiscount>£{plan.monthlyCost}</PlanDiscount>
                  )}
                  <PlanCost>
                    {plan.monthlyCost ? (
                      <>
                        <span>
                          <span className="currency">£</span>
                          {planDuration === "yearly"
                            ? plan.yearlyCost
                            : plan.monthlyCost}
                        </span>
                      </>
                    ) : (
                      <PlanCostCustom>Contact our sales team</PlanCostCustom>
                    )}
                    {plan.monthlyCost ? (
                      <PlanDuration>per month</PlanDuration>
                    ) : (
                      <PlanDuration> </PlanDuration>
                    )}
                  </PlanCost>
                </PlanContainer>
              ))}
            </PricingContainer>
            <div style={{ textAlign: "center" }}>
              <button
                className="button button--default button--blue-dark"
                onClick={() =>
                  store.pricingPlan
                    ? upgradePlan()
                    : setModalView("card-details")
                }
                style={{ marginBottom: 10 }}
              >
                {store.pricingPlan ? "Confirm Upgrade" : "Confirm Upgrade"}
              </button>
              <p>Your card will be automatically charged</p>
            </div>
          </>
        )}
        {modalView === "contact" && <>CONTACT FORM</>}
        {modalView === "card-details" && (
          <>
            <Elements>
              <CardDetails
                planId={upcomingPlan?.id}
                companyId={store.company.id}
                session={store.session}
                successCallback={successUpdate}
                triggerUpgradeBool={saveCard}
              />
            </Elements>
            <button
              className="button button--default button--blue-dark"
              onClick={() => setSaveCard(true)}
            >
              Save
            </button>
          </>
        )}
      </PricingWrapper>
    </StripeProvider>
  );
};

export default CheckoutModal;

const plansTwo = [
  {
    title: "Single User",
    monthlyCost: "100",
    yearlyCost: "80",
    planSize: "single",
    icon: `${AWS_CDN_URL}/icons/pricing-icons/Helmet.svg`,
    seats: "1",
  },
  {
    title: "Teams up to 5",
    monthlyCost: "400",
    yearlyCost: "328",
    planSize: "5",
    icon: `${AWS_CDN_URL}/icons/pricing-icons/UFO.svg`,
    seats: "5",
  },
  {
    title: "Teams of 5-10",
    monthlyCost: "800",
    yearlyCost: "656",
    planSize: "10",
    icon: `${AWS_CDN_URL}/icons/pricing-icons/Rocket.svg`,
    seats: "10",
  },
  {
    title: "Teams of 10-25",
    monthlyCost: "1500",
    yearlyCost: "1230",
    planSize: "25",
    icon: `${AWS_CDN_URL}/icons/pricing-icons/Base.svg`,
    seats: "25",
  },
  {
    title: "Teams of 25-50",
    monthlyCost: "3000",
    yearlyCost: "2460",
    planSize: "50",
    icon: `${AWS_CDN_URL}/icons/pricing-icons/Planet.svg`,
    seats: "50",
  },
  {
    title: "Teams of 50+",
    monthlyCost: null,
    yearlyCost: "80",
    planSize: "50+",
    icon: `${AWS_CDN_URL}/icons/pricing-icons/Solar-System.svg`,
    seats: "100",
  },
];

const PricingWrapper = styled.div`
  align-items: center;
  background: #fff;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: 0;
  max-height: 100vh;
  min-height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1040;
`;

const PricingContainer = styled.div`
  display: grid;
  grid-column-gap: 15px;
  grid-template-columns: repeat(6, 182px);
  margin-left: -30px;
  margin-right: -30px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 15px 30px 25px;

  @media (min-width: 768px) {
    overflow: inherit;
    margin: 0;
    margin-bottom: 70px;
    padding: 0;
  }
`;

const PlanContainer = styled.div`
  align-items: center;
  background: #ffffff;
  border-radius: 11px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 400px;
  padding: 25px 0 60px;
  padding-left: 30px;
  padding-right: 30px;
  position: relative;
  transition: 0.25s ease-in-out box-shadow;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.11);
  }

  &.active {
    border: solid #eee 1px;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.11);
  }
  &.lower {
    opacity: 0.4;

    &:hover {
      border: 0;
      box-shadow: none;
    }
  }
`;

const PlanTitle = styled.div`
  font-family: Gelion-Regular;
  font-size: 26px;
  letter-spacing: 0.43px;
  line-height: 26px;
  text-align: center;
`;

const PricingToggleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-bottom: 40px;
  max-width: 400px;
  text-align: center;

  span {
    color: rgba(116, 118, 123, 0.74);
    font-family: Gelion-Light;
    font-size: 20px;
    height: 20px;
    letter-spacing: 0.33px;
    text-align: center;
  }
`;

const PricingToggleContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;

  p {
    color: rgba(116, 118, 123, 0.74);
    font-family: Gelion-Bold;
    font-size: 20px;
    letter-spacing: 0.33px;
    margin: 0;
    margin-left: 20px;
    margin-right: 20px;

    &.active {
      color: #2a3944;
    }
  }
`;

const PricingToggle = styled.div`
  background: #2a3944;
  border-radius: 15px;
  cursor: pointer;
  height: 30px;
  position: relative;
  width: 58px;

  &.monthly {
    background: #74767b;
  }
`;

const PricingToggleKnob = styled.div`
  background: #ffffff;
  border-radius: 50%;
  height: 24px;
  left: 3px;
  position: absolute;
  top: 3px;
  width: 24px;
  transition: left ease-in-out 0.2s;

  &.monthly {
    left: 31px;
  }
`;

const PlanDiscount = styled.div`
  color: rgba(116, 118, 123, 0.74);
  font-family: Gelion-Light;
  font-size: 16px;
  height: 20px;
  letter-spacing: 0.27px;
  position: relative;
  text-align: center;

  &:after {
    content: "";
    -webkit-transform: translateY(-20px) translateX(5px) rotate(-27deg);
    border-bottom: 1px solid #979797;
    height: 12px;
    left: -10px;
    position: absolute;
    top: 18px;
    width: 50px;
  }
`;

const PlanCost = styled.div`
  // height: 50px;

  .currency {
    font-family: Gelion-Bold;
    font-size: 16px;
    left: -10px;
    position: absolute;
    top: 0;
  }

  span {
    font-family: Gelion-Bold;
    font-size: 40px;
    letter-spacing: 0.67px;
    line-height: 26px;
    margin-bottom: 10px;
    position: relative;
  }

  p {
    margin: 0;
  }
`;

const PlanCostCustom = styled.div`
  font-family: Gelion-Bold;
  font-size: 20px;
  letter-spacing: 0.33px;
  line-height: 20px;
`;

const PlanDuration = styled.div`
  color: rgba(116, 118, 123, 0.74);
  font-family: Gelion-Light;
  font-size: 16px;
  letter-spacing: 0.27px;
  margin-top: 10px;
`;

const PlanIcon = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  height: 104px;
`;
