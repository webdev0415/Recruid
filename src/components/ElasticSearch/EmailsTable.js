import React, { useContext, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import notify from "notifications";
import spacetime from "spacetime";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
// import { ROUTES } from "routes";
import GlobalContext from "contexts/globalContext/GlobalContext";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";
// import {
//   ExtensionMenu,
//   ExtensionMenuOption,
// } from "sharedComponents/ExtensionMenu";
import AvatarIcon from "sharedComponents/AvatarIcon";
// import ConfirmModalV2 from "modals/ConfirmModalV2";
import EmptyTab from "components/Profiles/components/EmptyTab";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import { listEmails } from "components/Profiles/Emails/emailMethods";
import { ATSContainer } from "styles/PageContainers";
import { EmptyDeals } from "assets/svg/EmptyImages";
const SLICE_LENGHT = 20;
const EmailsTable = ({ elastic_ids }) => {
  const store = useContext(GlobalContext);
  // const [activeModal, setActiveModal] = useState(undefined);
  const [redirect, setRedirect] = useState(undefined);
  const [hasMore, setHasMore] = useState(false);
  // const [selectedMeetIx, setSelectedMeetIx] = useState(undefined);
  const [emails, setEmails] = useState(undefined);
  const [showBodyIndex, setShowBodyIndex] = useState(undefined);

  useEffect(() => {
    if (redirect) {
      setRedirect(false);
    }
  }, [redirect]);
  useEffect(() => {
    if (store.company && store.session) {
      listEmails(undefined, store.company.id, store.session, elastic_ids).then(
        (resEmails) => {
          if (resEmails) {
            setEmails(resEmails);
            if (resEmails.length === SLICE_LENGHT) {
              setHasMore(true);
            } else if (hasMore === true) {
              setHasMore(false);
            }
          } else {
            notify("danger", "Unable to fetch emails");
          }
        }
      );
    }
  }, [store.company, store.session, elastic_ids]);

  const fetchMore = () => {
    listEmails(undefined, store.company.id, store.session, elastic_ids).then(
      (resEmails) => {
        if (resEmails) {
          setEmails([...emails, ...resEmails]);
          if (resEmails.length === SLICE_LENGHT) {
            setHasMore(true);
          } else if (hasMore === true) {
            setHasMore(false);
          }
        } else {
          notify("danger", "Unable to fetch emails");
        }
      }
    );
  };

  return (
    <ATSContainer>
      <EmptyTab
        data={emails}
        title={"The company has no emails."}
        copy={"Visit a profile to send one!"}
        image={<EmptyDeals />}
        // action={() =>
        //   setRedirect(ROUTES.ClientManager.url(store.company.mention_tag))
        // }
        // actionText={"Go to CRM"}
      >
        <InfiniteScroller
          fetchMore={fetchMore}
          hasMore={hasMore}
          dataLength={emails?.length || 0}
        >
          <div className={styles.container}>
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Subject
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Sender
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Receiver
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Time sent
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {emails &&
                    emails.map((email, index) => (
                      <React.Fragment key={`email-row-${index}`}>
                        <tr className="table-row-hover">
                          <td
                            className={sharedStyles.tableItem}
                            style={{ overflow: "hidden" }}
                          >
                            <button
                              onClick={() => {
                                if (email.email_body?.length > 0) {
                                  setShowBodyIndex(
                                    showBodyIndex === index ? undefined : index
                                  );
                                }
                              }}
                            >
                              {email.subject}
                            </button>
                          </td>
                          <td
                            className={sharedStyles.tableItem}
                            style={{ overflow: "hidden" }}
                          >
                            <div className="d-flex align-items-center">
                              <AvatarIcon
                                name={email.sender}
                                imgUrl={email.sender_avatar}
                                size={25}
                                style={{
                                  marginRight: "10px",
                                }}
                              />
                              <OverflowCell style={{ color: "#1e1e1e" }}>
                                {email.sender}
                              </OverflowCell>
                            </div>
                          </td>
                          <td
                            className={sharedStyles.tableItem}
                            style={{ overflow: "hidden" }}
                          >
                            <div className="d-flex align-items-center">
                              <AvatarIcon
                                name={email.receiver}
                                imgUrl={email.receiver_avatar}
                                size={25}
                                style={{
                                  marginRight: "10px",
                                }}
                              />
                              <OverflowCell style={{ color: "#1e1e1e" }}>
                                {email.receiver}
                              </OverflowCell>
                            </div>
                          </td>
                          <td
                            className={sharedStyles.tableItem}
                            style={{ overflow: "hidden" }}
                          >
                            {spacetime(new Date(email.created_at)).format(
                              "{time} {date} {month}, {year}"
                            )}
                          </td>
                          {/*}<td className={sharedStyles.tableItemStatus}>
                          <ExtensionMenu>
                            <ExtensionMenuOption
                              onClick={() => {
                                setRedirect(
                                  ROUTES.DealProfile.url(
                                    store.company.mention_tag,
                                    deal.id
                                  )
                                );
                              }}
                            >
                              View Deal
                            </ExtensionMenuOption>
                            <ExtensionMenuOption
                      onClick={() => {
                        setSelectedDealIx(index);
                        setActiveModal("delete-deal");
                      }}
                    >
                      Delete Deal
                    </ExtensionMenuOption>
                          </ExtensionMenu>
                        </td>*/}
                        </tr>
                        {showBodyIndex === index && (
                          <tr>
                            <td
                              colSpan="12"
                              className={sharedStyles.tableItem}
                              style={{ overflow: "hidden" }}
                            >
                              {email.email_body}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </InfiniteScroller>
      </EmptyTab>
      {redirect && <Redirect to={redirect} />}
    </ATSContainer>
  );
};

export default EmailsTable;

const OverflowCell = styled.span`
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
