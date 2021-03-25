import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Table, TableRow, TableCell } from "styles/Table";
import { ROUTES } from "routes";
import { Link, Redirect } from "react-router-dom";
import AvatarIcon from "sharedComponents/AvatarIcon";
import { COLORS } from "constants/style";
import AppButton from "styles/AppButton";
// import sharedHelpers from "helpers/sharedHelpers";
import notify from "notifications";
import { fetchLatestApplicants } from "helpersV2/tempPlus/job";

const TopApplicants = ({ store, jobId }) => {
  const [network, setNetwork] = useState(undefined);
  const [redirect, setRedirect] = useState(undefined);
  //
  // const addSelectedProfessionalsToJob = (candidate) => {
  //   const postBody = {
  //     company_id: store.company.id,
  //     job_id: jobId,
  //     candidate_ids: [candidate.professional_id],
  //     recruiter_id: store.role.team_member.team_member_id,
  //   };
  //   if (store.company?.id !== jobData.company?.id) {
  //     postBody.agency_id = store.company.id;
  //   }
  //
  //   sharedHelpers
  //     .inviteProfessionalsToJob(postBody, store.session)
  //     .then((response) => {
  //       if (response?.message === "Done") {
  //         // set candidate as invited?
  //         let networkCopy = [...network];
  //         networkCopy = networkCopy.map((cand, index) => {
  //           if (candidate.professional_id === cand.professional_id) {
  //             return { ...cand, invited_ui: true };
  //           }
  //           return cand;
  //         });
  //         setNetwork(networkCopy);
  //         notify("info", "Candidate successfully added");
  //       } else {
  //         notify("danger", "Unable to add candidate to job");
  //       }
  //     });
  // };

  useEffect(() => {
    if (store.company && store.role) {
      fetchLatestApplicants(store.session, store.company.id, jobId).then(
        (talentNetwork) => {
          if (!talentNetwork.err) {
            setNetwork(talentNetwork);
          } else {
            notify("danger", talentNetwork);
          }
        }
      );
    }
     
  }, [store.company, store.role, store.session]);

  return (
    <div>
      <Title>Latest Applicants</Title>
      {redirect && <Redirect to={redirect} />}
      <STTable>
        <tbody>
          {network &&
            network.length > 0 &&
            network.map((candidate, index) => {
              return (
                <TableRow key={`candidate_${index}`}>
                  <TableCell>
                    <AvatarIcon
                      name={candidate.name}
                      imgUrl={candidate.source?.avatar}
                      size={25}
                    />
                  </TableCell>
                  <TableCell>
                    <UnstyledLink
                      to={ROUTES.CandidateProfile.url(
                        store.company.mention_tag,
                        candidate.professional_id
                      )}
                    >
                      {candidate.name || candidate.email}
                      {candidate.current_job_title && <Separator>•</Separator>}
                      <LocationSpan>{candidate.current_job_title}</LocationSpan>
                    </UnstyledLink>
                  </TableCell>
                  {/*}<TableCell>
                    <MatchBox className="high">80% match</MatchBox>
                  </TableCell>*/}
                  <TableCell>
                    <STAppButton
                      theme="primary"
                      size="small"
                      style={{ width: "100%" }}
                      onClick={() =>
                        setRedirect(
                          ROUTES.CandidateProfile.url(
                            store.company.mention_tag,
                            candidate.professional_id
                          )
                        )
                      }
                    >
                      View Profile
                    </STAppButton>
                    {/*candidate.invited_ui ? (
                      <STAppButton
                        theme="primary"
                        size="small"
                        style={{ width: "100%" }}
                      >
                        Added
                      </STAppButton>
                    ) : (
                      <STAppButton
                        theme="dark-blue"
                        size="small"
                        onClick={() => addSelectedProfessionalsToJob(candidate)}
                      >
                        Add to job
                      </STAppButton>
                    )*/}
                  </TableCell>
                </TableRow>
              );
            })}
        </tbody>
      </STTable>
    </div>
  );
};

const Title = styled.h3`
  font-size: 18px;
  line-height: 22px;
  color: #1e1e1e;
  margin-bottom: 30px;
`;

const UnstyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  display: flex;

  &:hover {
    color: inherit;
    text-decoration: none;
  }
`;

const LocationSpan = styled.span`
  color: ${COLORS.dark_4};
`;

const Separator = styled.span`
  margin: 0px 5px;
`;

const STAppButton = styled(AppButton)`
  border-radius: 20px;
  font-size: 12px;
`;

const STTable = styled(Table)`
  max-width: 500px;
`;

// const MatchBox = styled.div`
//   font-weight: 600;
//   font-size: 12px;
//   line-height: 15px;
//
//   &.high {
//     color: #35c3ae;
//   }
//   &.med {
//     color: #ffa076;
//   }
//   &.low {
//     color: #f4d16e;
//   }
// `;

export default TopApplicants;
