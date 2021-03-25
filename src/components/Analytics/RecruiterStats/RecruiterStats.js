import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FilterSelector from "../FilterSelector";
import {
  StatContainer,
  StatContainerSingle,
  StatContainerDouble,
} from "../shared/components";

import analyticsStyles from "assets/stylesheets/scss/collated/analytics.module.scss";

import { receivedReviews, recruiterAnalytics } from "./helpers";

import AvatarIcon from "sharedComponents/AvatarIcon";
import ProfileRating from "sharedComponents/profile/ProfileRating";
import StatCell from "sharedComponents/StatCell";

import Doughnut from "../shared/Doughnut";
import Bar from "../shared/Bar";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";
import {
  permissionExchanger,
  rolesExchanger,
} from "constants/permissionHelpers";

const RecruiterStats = (props) => {
  const [selectedTeamMember, setSelectedTeamMember] = useState(undefined);
  const [dateBoundary, setDateBoundary] = useState("this month");
  const [sourceDisplay, setSourceDisplay] = useState("%");
  const [analytics, setAnalytics] = useState(undefined);
  const [reviews, setReviews] = useState(undefined);

  useEffect(() => {
    if (
      props.session &&
      props.company &&
      props.teamMembers &&
      props.teamMembers.length &&
      props.role
    ) {
      if (!props.role?.role_permissions?.is_member) return;
      let member = undefined;
      member = props.teamMembers.filter(
        (member) => member.professional_id === props.session.id
      )[0];
      setSelectedTeamMember({
        label: member ? member.name : undefined,
        value: 0,
        pro_id: member ? member.professional_id : undefined,
        member: member ? member : undefined,
      });
      receivedReviews("professionals", props.session.id, props.session).then(
        (reviews) => {
          if (reviews !== "err") {
            setReviews(reviews[0]);
          }
        }
      );
      recruiterAnalytics(
        props.company.id,
        props.session.id,
        "this month",
        props.session
      ).then((analytics) => {
        setAnalytics(analytics);
      });
    }
  }, [props.company, props.session, props.teamMembers, props.role]);

  const setDateBoundaryFunction = (option) => {
    setDateBoundary(option);
    // call for newly scoped analytics data
    recruiterAnalytics(
      props.company.id,
      selectedTeamMember.pro_id,
      option
    ).then((analytics) => {
      setAnalytics(analytics);
    });
  };

  const setSourceDisplayFunction = (option) => {
    setSourceDisplay(option);
  };

  if (analytics) {
    return (
      <ATSContainer>
        <FiltersContainer
          dateBoundary={dateBoundary}
          setDateBoundary={setDateBoundaryFunction}
        />
        <StatContainer>
          <StatContainerSingle>
            <RecruiterOverviewBox
              selectedMember={selectedTeamMember?.member}
              memberReview={reviews}
              company={props.company}
            />
          </StatContainerSingle>
          <StatContainerDouble></StatContainerDouble>
          <CellsContainer analytics={analytics} />
          <StatContainerSingle>
            <BarContainer analytics={analytics} />
          </StatContainerSingle>
          <StatContainerSingle>
            <DoughnutContainer
              analytics={analytics}
              sourceDisplay={sourceDisplay}
              setSourceDisplay={setSourceDisplayFunction}
            />
          </StatContainerSingle>
        </StatContainer>
      </ATSContainer>
    );
  } else {
    return <Spinner />;
  }
};

const FiltersContainer = ({ dateBoundary, setDateBoundary }) => {
  return (
    <div
      className="leo-flex"
      style={{
        justifyContent: "space-between",
        marginBottom: "10px",
      }}
    >
      <div />
      <FilterSelector
        dateBoundary={dateBoundary}
        setDateBoundary={setDateBoundary}
        boundaryMap={{
          today: "Today",
          "7": "Last 7 Days",
          "14": "Last 14 Days",
          "30": "Last 30 Days",
          "90": "Last 90 Days",
          "this week": "This Week",
          "this month": "This Month",
          "this quarter": "This Quarter",
          "this year": "This Year",
        }}
      />
    </div>
  );
};

const RecruiterOverviewBox = ({ selectedMember, memberReview, company }) => {
  return (
    <div className={analyticsStyles.statsContainer}>
      <div
        className="leo-flex"
        style={{
          alignItems: "center",
        }}
      >
        <div style={{ marginRight: "15px", width: "50px" }}>
          <AvatarIcon
            name={selectedMember?.name}
            imgUrl={selectedMember?.avatar}
            size="medium"
          />
        </div>
        <div
          className="leo-flex"
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div>
            <div style={{ fontWeight: "500" }}>{selectedMember?.name}</div>
            <div style={{ fontSize: "12px" }}>
              {permissionExchanger[company.id]
                ? permissionExchanger[company.id][selectedMember?.permission]
                : permissionExchanger.default[selectedMember?.permission]}
              <FlexCont className="leo-flex">
                {selectedMember.roles?.includes("recruiter") && (
                  <Tag>
                    {rolesExchanger[company.id]
                      ? rolesExchanger[company.id].recruiter
                      : rolesExchanger.default.recruiter}
                  </Tag>
                )}
                {selectedMember.roles?.includes("hiring_manager") && (
                  <Tag>
                    {rolesExchanger[company.id]
                      ? rolesExchanger[company.id].hiring_manager
                      : rolesExchanger.default.hiring_manager}
                  </Tag>
                )}
                {selectedMember.roles?.includes("business") && (
                  <Tag>
                    {rolesExchanger[company.id]
                      ? rolesExchanger[company.id].business
                      : rolesExchanger.default.business}
                  </Tag>
                )}
                {selectedMember.roles?.includes("marketer") && (
                  <Tag>
                    {rolesExchanger[company.id]
                      ? rolesExchanger[company.id].marketer
                      : rolesExchanger.default.marketer}
                  </Tag>
                )}
              </FlexCont>
            </div>
            {selectedMember?.average_rating > 1 && (
              <ProfileRating
                averageRating={
                  selectedMember?.average_rating > 1
                    ? selectedMember?.average_rating
                    : 1
                }
              />
            )}
          </div>
        </div>
      </div>
      {memberReview && (
        <div
          style={{
            borderTop: "1px solid #eee",
            marginTop: "15px",
            paddingTop: "15px",
          }}
        >
          <React.Fragment>
            <div
              className="leo-flex"
              style={{
                justifyContent: "center",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                }}
              >
                <AvatarIcon
                  name={memberReview.author.name}
                  imgUrl={memberReview.author.avatar_url}
                  size="medium"
                />
              </div>
              <div
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                }}
              >
                <AvatarIcon
                  name={memberReview.reviewable.name}
                  imgUrl={memberReview.reviewable.avatar_url}
                  size="medium"
                />
              </div>
            </div>
            <div
              className="leo-flex"
              style={{
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div
                className="leo-flex"
                style={{
                  justifyContent: "center",
                }}
              >
                <p
                  style={{
                    fontWeight: "500",
                    marginBottom: "10px",
                    marginRight: "4px",
                  }}
                >
                  {memberReview.author.name}
                </p>
                reviewed
                <p
                  style={{
                    fontWeight: "500",
                    marginBottom: "10px",
                    marginLeft: "4px",
                  }}
                >
                  {memberReview.reviewable.name}
                </p>
              </div>
              <ProfileRating
                averageRating={
                  memberReview.rating > 1 ? memberReview.rating : 1
                }
              />
              <p
                style={{
                  borderTop: "1px solid #eee",
                  marginTop: "15px",
                  paddingTop: "15px",
                }}
              >
                {`"{memberReview.body}"`}
              </p>
            </div>
          </React.Fragment>
        </div>
      )}
    </div>
  );
};

const CellsContainer = ({ analytics }) => {
  const {
    average_time_to_fill,
    average_time_to_hire,
    total_number_submissions,
    total_jobs_hiring_for,
  } = analytics;
  return (
    <>
      <StatContainerDouble>
        <StatCell
          value={
            average_time_to_fill ? average_time_to_fill.current_time_period : 0
          }
          metric={"Average Time To Fill"}
          increase={
            average_time_to_fill ? average_time_to_fill.percentage_change : 0
          }
        />
        <StatCell
          value={
            average_time_to_hire ? average_time_to_hire.current_time_period : 0
          }
          metric={"Average Time To Hire"}
          increase={
            average_time_to_hire ? average_time_to_hire.percentage_change : 0
          }
        />
      </StatContainerDouble>
      <StatContainerDouble>
        <StatCell
          value={
            total_number_submissions
              ? total_number_submissions.current_time_period
              : 0
          }
          metric={"Total Number Of Submissions"}
          increase={
            total_number_submissions
              ? total_number_submissions.percentage_change
              : 0
          }
        />
        <StatCell
          value={
            total_jobs_hiring_for
              ? total_jobs_hiring_for.current_time_period
              : 0
          }
          metric={"Total number of active jobs"}
          increase={
            total_jobs_hiring_for ? total_jobs_hiring_for.percentage_change : 0
          }
        />
      </StatContainerDouble>
    </>
  );
};

const DoughnutContainer = ({ analytics, sourceDisplay, setSourceDisplay }) => {
  return (
    <Doughnut
      data={analytics.rec_source_mix}
      sourceDisplay={sourceDisplay}
      setSourceDisplay={setSourceDisplay}
    />
  );
};

const BarContainer = ({ analytics }) => {
  return <Bar barData={analytics.average_conversion_rate_at_stage} />;
};

export default RecruiterStats;

const Tag = styled.span.attrs((props) => ({
  className: (props.className || "") + " leo-relative leo-width-max",
}))`
  background: gray;
  padding: 5px 10px 5px 10px;
  color: white;
  border-radius: 4px;
  word-break: break-all;
  margin-right: 5px;
  color: white !important;
`;

const FlexCont = styled.div`
  align-items: center;
  margin-top: 5px;
`;
