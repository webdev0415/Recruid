import React, { useState, Suspense } from "react";

import styles from "./billingTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { AWS_CDN_URL } from "constants/api";
import Spinner from "sharedComponents/Spinner";
import retryLazy from "hooks/retryLazy";
const EditBillingInfoModal = React.lazy(() =>
  retryLazy(() => import("./../BillingModal/BillingModal"))
);
const CancelSubModal = React.lazy(() =>
  retryLazy(() =>
    import("components/TeamView/CancelSubscriptonModal/CancelSubscriptonModal")
  )
);

const BillingTable = ({
  setActiveMenuOption,
  companyId,
  session,
  paymentInfo,
  billingHistory,
  updatePaymentInfo,
  company,
  setParentState,
  state,
}) => {
  const [modal, setModal] = useState(false);
  const handleCloseModal = () => setModal(false);
  const handleShowModal = () => setModal(true);
  const [cancelSubModal, setCancelSubModal] = useState(false);

  const openCancelSubModal = () => setCancelSubModal(true);
  const closeCancelSubModal = () => setCancelSubModal(false);

  return (
    <React.Fragment>
      <div style={{ minHeight: "50vh" }}>
        {(!paymentInfo || !billingHistory) && <Spinner />}
        {typeof paymentInfo === "string" && <NoTeamMembers />}
        {paymentInfo && typeof paymentInfo !== "string" && (
          <React.Fragment>
            <BillingData
              setActiveMenuOption={setActiveMenuOption}
              handleShowModal={handleShowModal}
              paymentInfo={paymentInfo}
              company={company}
              openCancelSubModal={openCancelSubModal}
            />
            <BillingHistory billingHistory={billingHistory} />
            {modal && (
              <Suspense fallback={<div />}>
                <EditBillingInfoModal
                  modalView={modal}
                  handleCloseModal={handleCloseModal}
                  companyId={companyId}
                  session={session}
                  updateCardState={updatePaymentInfo}
                />
              </Suspense>
            )}
            {cancelSubModal && (
              <Suspense fallback={<div />}>
                <CancelSubModal
                  modalView={cancelSubModal}
                  handleCloseModal={closeCancelSubModal}
                  setParentState={setParentState}
                  state={state}
                  companyId={companyId}
                  session={session}
                />
              </Suspense>
            )}
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

const BillingData = ({
  setActiveMenuOption,
  handleShowModal,
  paymentInfo,
  company,
  openCancelSubModal,
}) => {
  return (
    <div className={styles.container}>
      <div className="table-responsive">
        <table className="table table-borderless">
          <thead>
            <tr>
              <th scope="col" className={sharedStyles.tableHeader}>
                Billing Details
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={sharedStyles.tableItem}>Payment Method</td>
              <td className={`${sharedStyles.tableItem} ${styles.alignRight}`}>
                {paymentInfo && paymentInfo.card_end && paymentInfo.card_exp
                  ? `Card ending in ${paymentInfo.card_end}, exp ${paymentInfo.card_exp}`
                  : `Invite a member to your team`}
              </td>
              <td className={`${sharedStyles.tableItem} ${styles.alignRight}`}>
                <button
                  className={styles.buttonNoLink}
                  onClick={handleShowModal}
                >
                  Update
                </button>
              </td>
            </tr>
            <tr>
              <td className={sharedStyles.tableItem}>Billing Period</td>
              <td className={`${sharedStyles.tableItem} ${styles.alignRight}`}>
                {paymentInfo && paymentInfo.billing_period === "month"
                  ? "Monthly"
                  : paymentInfo && paymentInfo.billing_period === "year"
                  ? "Yearly"
                  : ""}
              </td>
              <td
                className={`${sharedStyles.tableItem} ${styles.alignRight}`}
              />
            </tr>
            <tr>
              <td className={sharedStyles.tableItem}>Manage Licenses</td>
              <td className={`${sharedStyles.tableItem} ${styles.alignRight}`}>
                {paymentInfo && paymentInfo.licenses
                  ? paymentInfo.licenses
                  : ""}
              </td>
              <td className={`${sharedStyles.tableItem} ${styles.alignRight}`}>
                <button
                  className={styles.buttonNoLink}
                  onClick={() => setActiveMenuOption("team")}
                >
                  Manage
                </button>
              </td>
            </tr>
            {company && company.trial && company.trial === "upgraded" && (
              <tr>
                <td className={sharedStyles.tableItem}>Subscription</td>
                <td
                  className={`${sharedStyles.tableItem} ${styles.alignRight}`}
                >
                  {company.trial === "upgraded"
                    ? "Active"
                    : company.trial || ""}
                </td>
                <td
                  className={`${sharedStyles.tableItem} ${styles.alignRight}`}
                >
                  <button
                    className={styles.buttonNoLink}
                    onClick={openCancelSubModal}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BillingHistory = ({ billingHistory }) => {
  const HistoryTab = ({ historyElem }) => {
    const workers = () => {
      if (historyElem.team_members.length === 1)
        return historyElem.team_members[0].desc;
      let response = historyElem.team_members.map((member) => member.desc);
      return response.join(", ").slice(0, 52).concat("...");
    };
    let workersArr = workers();
    return (
      <tr>
        <td className={sharedStyles.tableItem}>
          <span className={styles.dateItem}>
            {historyElem && historyElem.date ? historyElem.date : ""}
          </span>
        </td>
        <td className={sharedStyles.tableItem} style={{ overflow: "hidden" }}>
          {historyElem &&
            historyElem.team_members.length > 0 &&
            historyElem.team_members.map((workers, i) => (
              <span key={`workers-${i}`} style={{ display: "inline-block" }}>
                {workersArr}
              </span>
            ))}
        </td>
        <td className={sharedStyles.tableItem}>
          <div className={styles.flexCell}>
            {historyElem && !historyElem.settled && (
              <span className={styles.dueWarning}>DUE</span>
            )}
            <span>
              {historyElem && historyElem.amount && historyElem.currency
                ? `${historyElem.currency}${historyElem.amount / 100}`
                : ""}
            </span>
          </div>
        </td>
        <td className={sharedStyles.tableItem}>
          <div className={styles.flexCell}>
            {historyElem && historyElem.invoice && (
              <a
                href={historyElem.invoice}
                target={"_blank"}
                rel="noopener noreferrer"
              >
                View Invoice
              </a>
            )}
            {/*
              <span>|</span>
              <Link
                to="/">
                receipt
          </Link>
            */}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className={styles.container}>
      <div className="table-responsive">
        <table className="table table-borderless">
          <thead>
            <tr>
              <th scope="col" className={sharedStyles.tableHeader}>
                Billing History
              </th>
            </tr>
          </thead>
          <tbody>
            {billingHistory &&
              billingHistory.length > 0 &&
              billingHistory.map((historyElem, i) => (
                <HistoryTab
                  historyElem={historyElem}
                  key={`billing-tab-${i}`}
                />
              ))}
            {/*(!billingHistory || billingHistory.length === 0) && <p>You haven't got any billing History yet</p>*/}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function NoTeamMembers() {
  return (
    <div className={sharedStyles.emptyContainer}>
      <div className={sharedStyles.empty}>
        <img
          src={`${AWS_CDN_URL}/icons/empty-icons/empty-team.svg`}
          alt="empty team illustration"
        />
        <h2>You have no billing information yet.</h2>
        <p>
          When you start adding to your team you will see your invoices and
          receipts here.
        </p>
      </div>
    </div>
  );
}

export default BillingTable;
