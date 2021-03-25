import React, { useState, useContext, useEffect } from "react";
import { StripeProvider, Elements } from "react-stripe-elements";
import notify from "notifications";
// import styled from "styled-components";

import GlobalContext from "contexts/globalContext/GlobalContext";
import { getPricingPlan } from "contexts/globalContext/GlobalMethods";

import {
  getAllPlans,
  subscribeForPlan,
  getCustomerDetails,
} from "helpersV2/pricing";

import UniversalModal, {
  ModalBody,
  ModalHeaderClassic,
} from "modals/UniversalModal/UniversalModal";

import UpgradeBody from "./UpgradeBody";
import ConfirmBody from "./ConfirmBody";

const CheckoutModal = ({ show, onHide }) => {
  const store = useContext(GlobalContext);
  const [plans, setPlans] = useState([]);
  const [upcomingPlan, setUpcomingPlan] = useState(null);
  const [bililngDetails, setBillingDetails] = useState(null);
  const [triggerUpdate, setTriggerUpdate] = useState(null);
  const [editBilling, setEditBilling] = useState(false);
  const [modalStage, setModalStage] = useState(
    !store.pricingPlan ? "confirm" : "upgrade"
  );
  const [subscribeIsPending, setSubscribeIsPending] = useState(false);
  const [upcomingPlanPending, setUpcomingPlanPending] = useState(true);

  // GET CURRENT AND ALL PLANS
  useEffect(() => {
    const requestController = new AbortController();
    const { signal } = requestController;
    if (store.session && store.company) {
      (async (company, session) => {
        const nextPlans = await getAllPlans(company.id, session, signal);
        if (!nextPlans.error) setPlans(nextPlans);
        else notify("danger", nextPlans.message);

        const customerDetails = await getCustomerDetails(company.id, session);
        if (!customerDetails.error && !!customerDetails.card_details) {
          setBillingDetails({
            expMonth: customerDetails?.card_details.exp_month,
            expYear: customerDetails?.card_details.exp_year,
            last4: customerDetails?.card_details.last4,
            brand: customerDetails?.card_details.brand,
          });
        } else setBillingDetails(undefined);
      })(store.company, store.session);
    }

    return () => requestController.abort();
  }, [store.session, store.company, triggerUpdate]);
  // SORT PLANS AND FIND UPCOMING
  useEffect(() => {
    if (plans?.length) {
      setUpcomingPlanPending(true);
      let period = store.pricingPlan?.name.includes("yearly")
        ? "yearly"
        : "monthly";
      const currentSeats = store.pricingPlan?.total_seats ?? -1;
      const sortedPlans = plans.sort((a, b) => a.seats - b.seats);
      const nextUpcomingPlan =
        currentSeats < 0
          ? sortedPlans[0]
          : sortedPlans.filter(
              (plan) =>
                plan.seats > currentSeats && plan.nickname.includes(period)
            )[0];
      setUpcomingPlan(nextUpcomingPlan ?? -1);
      setUpcomingPlanPending(false);
    }
  }, [plans, store.pricingPlan]);

  const upgradePlan = (plan) => async () => {
    setSubscribeIsPending(true);
    const subscribeResponse = await subscribeForPlan(
      store.company.id,
      store.session,
      plan.id
    );
    if (subscribeResponse.error) {
      setSubscribeIsPending(false);
      return notify("danger", subscribeResponse.message);
    }
    await getPricingPlan(store.company.id, store.session, store.dispatch);
    setSubscribeIsPending(false);
    notify("info", "Your pricing plan has been updated successfully");
    return onHide();
  };

  const handleBillingUpdate = (bool) => () => setEditBilling(bool);

  const updateCardDetails = () => {
    handleBillingUpdate(false)();
    setTriggerUpdate(Math.random());
  };

  const handleModalStageChange = (newStage) => () => setModalStage(newStage);

  return (
    <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
      <UniversalModal
        show={show}
        hide={onHide}
        id={"pricing-modal"}
        width={480}
      >
        <ModalHeaderClassic title="Upgrade your plan" closeModal={onHide} />
        <ModalBody className="no-footer">
          <div style={{ padding: 30 }}>
            {modalStage === "upgrade" && upcomingPlan !== -1 && (
              <UpgradeBody
                currentPlan={store.pricingPlan}
                upcomingPlan={upcomingPlan}
                handleModalStageChange={handleModalStageChange}
                teamMembers={store.teamMembers}
                upcomingPlanPending={upcomingPlanPending}
              />
            )}
            {modalStage === "confirm" && upcomingPlan !== -1 && (
              <Elements>
                <ConfirmBody
                  upcomingPlan={upcomingPlan}
                  upgradePlan={upgradePlan}
                  company={store.company}
                  session={store.session}
                  updateCardDetails={updateCardDetails}
                  bililngDetails={bililngDetails}
                  handleBillingUpdate={handleBillingUpdate}
                  editBilling={editBilling}
                  teamMembers={store.teamMembers}
                  subscribeIsPending={subscribeIsPending}
                />
              </Elements>
            )}
            {upcomingPlan === -1 && (
              <h3>
                Please contact us to get any further information about upgrading
                your plan.
              </h3>
            )}
          </div>
        </ModalBody>
      </UniversalModal>
    </StripeProvider>
  );
};

export default CheckoutModal;

// const Header = styled(Modal.Header)`
//   flex-direction: row;
// `;

// const Title = styled.h2`
//   font-size: 22px;
//   margin: 10px 0;
//   text-align: right;
//   flex-grow: 0.6;
// `;

// const ModalBody = styled(Modal.Body)`
//   background: #fff;
// `;
