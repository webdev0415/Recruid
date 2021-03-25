import React, { useState, useEffect } from "react";
import styled from "styled-components";
import notify from "notifications";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { ROUTES } from "routes";
import AvatarIcon from "sharedComponents/AvatarIcon";
import spacetime from "spacetime";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  STContainer,
  STTable,
  OverflowCell,
} from "modals/ViewProfilesListsModal/components";
import { getMeetings } from "helpersV2/meetings";
import Spinner from "sharedComponents/Spinner";

const SLICE_LENGTH = 20;

const MeetingsTable = ({
  store,
  elasticIds,
  meetings,
  setMeetings,
  hasMore,
  setHasMore,
  loaded,
  setLoaded,
}) => {
  const [showBodyIndex, setShowBodyIndex] = useState(undefined);
  useEffect(() => {
    if (store.company && store.session) {
      getMeetings(store.session, {
        slice: [0, SLICE_LENGTH],
        ids: elasticIds,
      }).then((resMeets) => {
        if (!resMeets.err) {
          setMeetings(resMeets);
          setLoaded(true);
          if (resMeets.length === SLICE_LENGTH) {
            setHasMore(true);
          } else if (hasMore === true) {
            setHasMore(false);
          }
        } else {
          notify("danger", "Unable to fetch meetings");
        }
      });
    }
  }, [store.company, store.session, elasticIds]);

  const fetchMore = () => {
    getMeetings(store.session, {
      slice: [meetings.length, SLICE_LENGTH],
      ids: elasticIds,
    }).then((resMeets) => {
      if (!resMeets.err) {
        setMeetings([...meetings, ...resMeets]);
        if (resMeets.length === SLICE_LENGTH) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else {
        notify("danger", "Unable to fetch meetings");
      }
    });
  };
  return (
    <>
      {!loaded ? (
        <Spinner />
      ) : (
        <InfiniteScroller
          fetchMore={fetchMore}
          hasMore={hasMore}
          dataLength={meetings?.length || 0}
          scrollableTarget={"modal-container-scroll"}
        >
          <STContainer id="modal-container-scroll">
            <div className="table-responsive">
              <STTable className="table  ">
                <thead>
                  <tr>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Title
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Organiser
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Date
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Duration
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Associated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {meetings &&
                    meetings.map((meet, index) => {
                      const startDate = new Date(meet.start);
                      const endDate = new Date(meet.end);
                      return (
                        <React.Fragment key={`meet-row-${index}`}>
                          <tr className="table-row-hover">
                            <td
                              className={sharedStyles.tableItem}
                              style={{ overflow: "hidden" }}
                            >
                              <button
                                onClick={() => {
                                  setShowBodyIndex(
                                    showBodyIndex === index ? undefined : index
                                  );
                                }}
                              >
                                {meet.name}
                              </button>
                            </td>
                            <td
                              className={sharedStyles.tableItem}
                              style={{ overflow: "hidden" }}
                            >
                              <div className="d-flex align-items-center">
                                <AvatarIcon
                                  name={meet.created_by?.name}
                                  imgUrl={meet.created_by?.avatar}
                                  size={25}
                                  style={{
                                    marginRight: "10px",
                                  }}
                                />
                                {meet.created_by?.name}
                              </div>
                            </td>
                            <td
                              className={sharedStyles.tableItem}
                              style={{ overflow: "hidden" }}
                            >
                              {spacetime(new Date(meet.start)).format(
                                "{time} {date} {month}, {year}"
                              )}
                            </td>
                            <td
                              className={sharedStyles.tableItem}
                              style={{ overflow: "hidden" }}
                            >
                              {Math.ceil((endDate - startDate) / (60 * 1000))}{" "}
                              minutes
                            </td>
                            <td
                              className={sharedStyles.tableItem}
                              style={{ overflow: "hidden" }}
                            >
                              {meet.source && (
                                <div className="d-flex align-items-center">
                                  <AvatarIcon
                                    name={meet.source.name}
                                    imgUrl={meet.source.avatar}
                                    size={25}
                                    style={{
                                      marginRight: "10px",
                                    }}
                                  />
                                  <OverflowCell
                                    to={
                                      meet.source.type === "candidate"
                                        ? ROUTES.CandidateProfile.url(
                                            store.company.mention_tag,
                                            meet.source.id
                                          )
                                        : meet.source.type === "client"
                                        ? ROUTES.ClientProfile.url(
                                            store.company.mention_tag,
                                            meet.source.id
                                          )
                                        : meet.source.type === "contact"
                                        ? ROUTES.ContactProfile.url(
                                            store.company.mention_tag,
                                            meet.source.id
                                          )
                                        : meet.source.type === "deal"
                                        ? ROUTES.DealProfile.url(
                                            store.company.mention_tag,
                                            meet.source.id
                                          )
                                        : ROUTES.ClientManager.url(
                                            store.company.mention_tag
                                          )
                                    }
                                    style={{ color: "#1e1e1e" }}
                                  >
                                    {meet.source.name}
                                  </OverflowCell>
                                </div>
                              )}
                            </td>
                          </tr>
                          {showBodyIndex === index && (
                            <tr>
                              <td
                                colSpan="12"
                                className={sharedStyles.tableItem}
                                style={{ overflow: "hidden" }}
                              >
                                {meet.description}
                                <CategoryWrapper>
                                  <span className="category-span">
                                    Attendees:
                                  </span>
                                  {meet.attendees?.length > 0 &&
                                    meet.attendees.map((att, ix) => (
                                      <OverlayTrigger
                                        key={`top-${ix}`}
                                        placement={"top"}
                                        overlay={
                                          <Tooltip id={`tooltip-top`}>
                                            <TooltipContainer>
                                              <AvatarIcon
                                                name={att.name}
                                                imgUrl={att.avatar}
                                                size={30}
                                              />
                                              <div className="text-container">
                                                <span>{att.name}</span>
                                                <span>{att.email}</span>
                                              </div>
                                            </TooltipContainer>
                                          </Tooltip>
                                        }
                                      >
                                        <span className="category-name">
                                          {`${att.name}${
                                            ix !== meet.attendees.length - 1
                                              ? ","
                                              : ""
                                          }`}
                                        </span>
                                      </OverlayTrigger>
                                    ))}
                                </CategoryWrapper>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                </tbody>
              </STTable>
            </div>
          </STContainer>
        </InfiniteScroller>
      )}
    </>
  );
};

const CategoryWrapper = styled.div`
  display: flex;
  font-size: 14px;
  // margin: 10px 0px;
  flex-wrap: wrap;

  &:not(:last-child) {
    margin-bottom: 5px;
  }

  span {
    margin-right: 5px;
  }

  .category-span {
    color: #74767b;
  }

  .category-name {
    cursor: pointer;
  }
`;

const TooltipContainer = styled.div`
  display: flex;
  padding: 10px 5px;

  .text-container {
    margin-left: 15px;
  }
`;

export default MeetingsTable;
