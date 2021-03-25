import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { fetchTempNetwork } from "helpersV2/tempPlus";
import notify from "notifications";
// import StatusSelect from "sharedComponents/StatusSelect";
import { ROUTES } from "routes";
import { Link } from "react-router-dom";
import Marquee from "sharedComponents/Marquee";
import AvatarIcon from "sharedComponents/AvatarIcon";
import { COLORS } from "constants/style";
import AvailableCandidateSubmenu from "components/TempManager/TempDashboard/AvailableCandidateSubmenu";
const AvailableCandidates = ({ store, permission }) => {
  const [network, setNetwork] = useState(undefined);
  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    if (store.company && store.role && permission.view) {
      fetchTempNetwork(
        store.session,
        store.company.id,
        {
          slice: [0, 8],
          operator: "and",
          // team_member_id: store.role.team_member.team_member_id,
        },
        signal
      ).then((talentNetwork) => {
        if (!talentNetwork.err) {
          setNetwork(talentNetwork);
        } else if (!signal.aborted) {
          notify("danger", talentNetwork);
        }
      });
    }
    return () => controller.abort();
     
  }, [store.company, store.role, store.session, permission]);

  return (
    <>
      {network && network.length > 0 && (
        <TitleContainer>
          <Title>Available Candidates</Title>
        </TitleContainer>
      )}
      <TableContainer>
        {network &&
          network.length > 0 &&
          network.map((candidate, index) => (
            <React.Fragment key={`candidate-row-${index}`}>
              <CandidateRow>
                <FlexContainer>
                  <UnstyledLink
                    to={ROUTES.CandidateProfile.url(
                      store.company.mention_tag,
                      candidate.professional_id
                    )}
                  >
                    <AvatarIcon
                      name={candidate.name}
                      imgUrl={candidate.source?.avatar}
                      size={25}
                      style={{
                        marginRight: "10px",
                      }}
                    />
                    <Marquee
                      height="25"
                      width={{
                        s: 150,
                        m: 200,
                        l: 250,
                        xl: 300,
                      }}
                    >
                      {candidate.name || candidate.email}
                    </Marquee>
                    {candidate.current_job_title && <Separator>•</Separator>}
                    <LocationSpan>
                      <Marquee
                        height="25"
                        width={{
                          s: 100,
                          m: 150,
                          l: 200,
                          xl: 250,
                        }}
                      >
                        {candidate.current_job_title}
                      </Marquee>
                    </LocationSpan>
                  </UnstyledLink>
                </FlexContainer>
                <AvailableCandidateSubmenu
                  candidate={candidate}
                  store={store}
                />
              </CandidateRow>
            </React.Fragment>
          ))}
      </TableContainer>
    </>
  );
};

export default AvailableCandidates;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 50px;
`;

const Title = styled.h3`
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
`;

const TableContainer = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
`;

const CandidateRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
  padding: 8px 0px;
  border-bottom: solid #e7e7e7 1px;
`;

const FlexContainer = styled.div``;

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
