import React, { useState, useEffect } from "react";
import {
  Link,
  // Redirect
} from "react-router-dom";
// import Dropdown from "react-bootstrap/Dropdown";
import styled from "styled-components";
// import { COLORS } from "constants/style";
// import AvatarIcon from "sharedComponents/AvatarIcon";
import { ROUTES } from "routes";
// import PercentageBar from "sharedComponents/PercentageBar";
// import notify from "notifications";
// import sharedHelpers from "helpers/sharedHelpers";
// import ConfirmModalV2 from "modals/ConfirmModalV2";

const AvailableCandidateSubmenu = ({ candidate, store }) => {
  // const [selectedJob, setSelectedJob] = useState(undefined);
  // const [activeModal, setActiveModal] = useState(undefined);
  const [redirect, setRedirect] = useState(undefined);

  useEffect(() => {
    if (redirect) {
      setRedirect(undefined);
    }
  }, [redirect]);
  //
  // const addSelectedProfessionalsToJob = (job) => {
  //   setSelectedJob(job);
  //   const postBody = {
  //     company_id: store.company.id,
  //     job_id: job.id,
  //     candidate_ids: [candidate.professional_id],
  //     recruiter_id: store.role.team_member.team_member_id,
  //   };
  //   if (store.company?.id !== job.company?.id) {
  //     postBody.agency_id = store.company.id;
  //   }
  //
  //   sharedHelpers
  //     .inviteProfessionalsToJob(postBody, store.session)
  //     .then((response) => {
  //       if (response?.message === "Done") {
  //         // set job as applied
  //         setActiveModal("invite-confirmation");
  //       } else {
  //         notify("danger", "Unable to add candidates to job");
  //       }
  //     });
  // };

  return (
    <ViewButton
      to={ROUTES.CandidateProfile.url(
        store.company.mention_tag,
        candidate.professional_id
      )}
    >
      View Profile
    </ViewButton>
  );
  //
  // return (
  //   <>
  //     <Dropdown>
  //       <Dropdown.Toggle as={DropButton} disabled={disabled}>
  //         Add to Job
  //         {!disabled && (
  //           <span>
  //             <li className="fas fa-caret-down" />
  //           </span>
  //         )}
  //       </Dropdown.Toggle>
  //       <Dropdown.Menu>
  //         <SubMenuOption>
  //           <div className="d-flex">
  //             <AvatarIcon
  //               name={candidate.name}
  //               imgUrl={candidate.source?.avatar}
  //               size={45}
  //             />
  //             <div className="body-container">
  //               <span>
  //                 <strong>{candidate.name || candidate.email}</strong>
  //               </span>
  //               <span>{candidate.current_job_title}</span>
  //               <LocationSpan>
  //                 {candidate.localizations && candidate.localizations.length > 0
  //                   ? candidate.localizations.length !== 1
  //                     ? `${candidate.localizations[0].location.name} + ${
  //                         candidate.localizations.length - 1
  //                       }`
  //                     : `${candidate.localizations[0].location.name}`
  //                   : ""}
  //               </LocationSpan>
  //               {candidate.hourly_rate && (
  //                 <LocationSpan>
  //                   {store.company?.currency?.currency_name}
  //                   {candidate.hourly_rate}/hour
  //                 </LocationSpan>
  //               )}
  //             </div>
  //           </div>
  //           <ViewButton
  //             to={ROUTES.CandidateProfile.url(
  //               store.company.mention_tag,
  //               candidate.professional_id
  //             )}
  //           >
  //             View Profile
  //           </ViewButton>
  //         </SubMenuOption>
  //         <SubMenuOption>
  //           <div className="d-flex">
  //             <AvatarIcon
  //               name={store.company.name}
  //               imgUrl={store.company.avatar_url}
  //               size={45}
  //             />
  //             <div className="body-container">
  //               <span>
  //                 <strong>
  //                   {store.company.name}
  //                   {"Software Engineer"}
  //                 </strong>
  //               </span>
  //               <span>{"London, UK"}</span>
  //               <JobInfoSpan>
  //                 <span className="green">£15/hour</span> • 2.3 miles away • 4
  //                 days to fill
  //               </JobInfoSpan>
  //               <PercentageBar total={100} completed={90} totalText="MATCH" />
  //             </div>
  //           </div>
  //           <ButtonContainer>
  //             <AddToJobButton onClick={() => addSelectedProfessionalsToJob({})}>
  //               + Add to Job
  //             </AddToJobButton>
  //           </ButtonContainer>
  //         </SubMenuOption>
  //       </Dropdown.Menu>
  //     </Dropdown>
  //     {activeModal === "invite-confirmation" && selectedJob && (
  //       <ConfirmModalV2
  //         show={true}
  //         hide={() => {
  //           setActiveModal(undefined);
  //           setSelectedJob(undefined);
  //         }}
  //         header={"Candidate Added"}
  //         text={`Candidate was added successfully to ${selectedJob?.title}.`}
  //         actionText="Manage Applicants"
  //         cancelText="Back to Talent"
  //         actionFunction={() => {
  //           setActiveModal(undefined);
  //           setRedirect(
  //             `/${store.company.mention_tag}/jobs/${selectedJob.title_slug}`
  //           );
  //         }}
  //         id="remove-candidate"
  //       />
  //     )}
  //     {redirect && <Redirect to={redirect} />}
  //   </>
  // );
};
export default AvailableCandidateSubmenu;

// const DropButton = styled.button`
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border-radius: 13px;
//   font-size: 12px;
//   font-weight: 500;
//   background: #35c3ae;
//   padding: 2px 15px !important;
//   color: ${COLORS.white};
//   min-width: 100px;
//
//   span {
//     margin-left: 10px;
//     position: relative;
//     top: -1px;
//   }
// `;
//
// const SubMenuOption = styled.div`
//   padding: 10px;
//   display: flex;
//   align-items: flex-start;
//   justify-content: space-between;
//
//   &:not(:last-child) {
//     border-bottom: solid 1px #eeeeee;
//   }
//
//   .body-container {
//     margin-left: 10px;
//     font-size: 14px;
//     color: #1e1e1e;
//   }
// `;

// const LocationSpan = styled.span`
//   color: #b0bdca;
// `;
//
// const JobInfoSpan = styled.div`
//   font-size: 12px;
//   line-height: 15px;
//   color: #b0bdca;
//   width: max-content;
//   margin-top: 5px;
//   margin-bottom: 15px;
//
//   span {
//     display: inline;
//   }
//
//   span.green {
//     color: #35c3ae;
//   }
//   span.yellow {
//     color: #f4d16e;
//   }
//   span.red {
//     color: #f27881;
//   }
// `;

const ViewButton = styled(Link)`
  background: #35c3ae;
  border-radius: 46px;
  padding: 5px 10px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;

  &:hover,
  &:active {
    color: white;
    text-decoration: none;
  }
`;

// const AddToJobButton = styled.button`
//   background: #35c3ae;
//   border-radius: 46px;
//   padding: 5px 10px;
//   color: white;
//   text-decoration: none;
//   font-weight: 500;
//   font-size: 12px;
//   line-height: 15px;
//   width: 110px;
// `;

// const ButtonContainer = styled.div`
//   margin-left: 5px;
//   align-self: flex-end;
// `;
