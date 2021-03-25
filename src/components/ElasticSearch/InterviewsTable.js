import React, { useContext, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import notify from "notifications";
import spacetime from "spacetime";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import { ROUTES } from "routes";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
// import {
//   ExtensionMenu,
//   ExtensionMenuOption,
// } from "sharedComponents/ExtensionMenu";
import AvatarIcon from "sharedComponents/AvatarIcon";
// import ConfirmModalV2 from "modals/ConfirmModalV2";
import EmptyTab from "components/Profiles/components/EmptyTab";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import { getCompanyEvents } from "helpersV2/interviews";
import { ATSContainer } from "styles/PageContainers";
import { EmptyDeals } from "assets/svg/EmptyImages";
const SLICE_LENGHT = 20;
const InterviewTable = ({ elastic_ids }) => {
  const store = useContext(GlobalContext);
  // const [activeModal, setActiveModal] = useState(undefined);
  const [redirect, setRedirect] = useState(undefined);
  const [hasMore, setHasMore] = useState(false);
  // const [selectedMeetIx, setSelectedMeetIx] = useState(undefined);
  const [interviews, setInterviews] = useState(undefined);

  useEffect(() => {
    if (redirect) {
      setRedirect(false);
    }
  }, [redirect]);

  useEffect(() => {
    if (store.company && store.session) {
      getCompanyEvents(store.session, {
        company_id: store.company.id,
        slice: [0, SLICE_LENGHT],
        event_type: "interview",
        elastic_ids,
      }).then((restInterviews) => {
        if (!restInterviews.err) {
          setInterviews(restInterviews);
          if (restInterviews.length === SLICE_LENGHT) {
            setHasMore(true);
          } else if (hasMore === true) {
            setHasMore(false);
          }
        } else {
          notify("danger", restInterviews);
        }
      });
    }
  }, [store.company, store.session, elastic_ids]);

  const fetchMore = () => {
    getCompanyEvents(store.session, {
      company_id: store.company.id,
      slice: [0, SLICE_LENGHT],
      event_type: "interview",
      elastic_ids,
    }).then((restInterviews) => {
      if (!restInterviews.err) {
        setInterviews([...interviews, ...restInterviews]);
        if (restInterviews.length === SLICE_LENGHT) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else {
        notify("danger", restInterviews);
      }
    });
  };

  return (
    <ATSContainer>
      <EmptyTab
        data={interviews}
        title={"The company has no interviews."}
        copy={"Visit the Calendar to create one!"}
        image={<EmptyDeals />}
        action={() =>
          setRedirect(ROUTES.Calendar.url(store.company.mention_tag))
        }
        actionText={"Go to CRM"}
      >
        <InfiniteScroller
          fetchMore={fetchMore}
          hasMore={hasMore}
          dataLength={interviews?.length || 0}
        >
          <div className={styles.container}>
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Title
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Creator
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Date
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Attendees
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {interviews?.map((interview, index) => {
                    const startDate = new Date(interview.start);
                    const endDate = new Date(interview.end);
                    return (
                      <React.Fragment key={`interview-row-${index}`}>
                        <tr className="table-row-hover">
                          <td
                            className={sharedStyles.tableItem}
                            style={{ overflow: "hidden" }}
                          >
                            {interview.name}
                          </td>
                          <td
                            className={sharedStyles.tableItem}
                            style={{ overflow: "hidden" }}
                          >
                            <div className="d-flex align-items-center">
                              <AvatarIcon
                                name={interview.created_by?.name}
                                imgUrl={interview.created_by?.avatar}
                                size={25}
                                style={{
                                  marginRight: "10px",
                                }}
                              />
                              <OverflowCell style={{ color: "#1e1e1e" }}>
                                {interview.created_by?.name}
                              </OverflowCell>
                            </div>
                          </td>
                          <td
                            className={sharedStyles.tableItem}
                            style={{ overflow: "hidden" }}
                          >
                            {spacetime(new Date(interview.start)).format(
                              "{time} {date} {month}, {year}"
                            )}
                          </td>
                          <td
                            className={sharedStyles.tableItem}
                            style={{ overflow: "hidden" }}
                          >
                            <IconsWrapper className="leo-flex">
                              {interview.participants?.map(
                                (attendee, index) => (
                                  <OverlayTrigger
                                    key={`top-${index}`}
                                    placement={"top"}
                                    overlay={
                                      <Tooltip id={`tooltip-top`}>
                                        <strong>{attendee.name}</strong>
                                      </Tooltip>
                                    }
                                  >
                                    <div
                                      className="icon-holder"
                                      key={`participant-${index}-${attendee.name}`}
                                    >
                                      <AvatarIcon
                                        name={attendee.name}
                                        imgUrl={attendee.avatar}
                                        size={30}
                                      />
                                    </div>
                                  </OverlayTrigger>
                                )
                              )}
                            </IconsWrapper>
                          </td>
                          <td
                            className={sharedStyles.tableItem}
                            style={{ overflow: "hidden" }}
                          >
                            {Math.ceil((endDate - startDate) / (60 * 1000))}{" "}
                            minutes
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
                      </React.Fragment>
                    );
                  })}
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

export default InterviewTable;

const OverflowCell = styled.span`
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const IconsWrapper = styled.div`
  margin-top: 10px;
  padding-left: 15px;

  .icon-holder {
    background: white;
    margin-left: -15px;
    padding: 4px;
    border-radius: 50%;
  }
`;
