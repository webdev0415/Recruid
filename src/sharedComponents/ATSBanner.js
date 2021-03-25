import React, { useContext } from "react";
import AvatarIcon from "sharedComponents/AvatarIcon";
import TabsMenu from "sharedComponents/TabsMenu/TabsMenu";
import styled from "styled-components";
import { COLORS } from "constants/style";
import { ATSContainer } from "styles/PageContainers";
import JobHold from "sharedComponents/JobHold";
import SizzlingComponent from "sharedComponents/SizzlingComponent";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { AWS_CDN_URL } from "constants/api";

const ATSBanner = ({
  name,
  avatar,
  page,
  children,
  tabs,
  activeTab,
  setActiveTab,
  tabType,
  clientButton,
  v2theme,
  label,
  job,
  setJob,
  setActiveModal,
}) => {
  const store = useContext(GlobalContext);
  return (
    <>
      <Header className={v2theme ? "v2theme" : ""}>
        <ATSContainer>
          <InnerHeader className="leo-flex leo-justify-between">
            <CompanyContainer>
              <div className="leo-flex leo-justify-end leo-align-end leo-width-full">
                <AvatarContainer>
                  <AvatarIcon name={name} imgUrl={avatar} size={50} />
                </AvatarContainer>
                <div>
                  <CompanyName>{name}</CompanyName>
                  <div
                    className="leo-flex-center-start leo-width-full"
                    style={{
                      alignItems: "baseline",
                    }}
                  >
                    <Title>{page}</Title>
                    {label && <Label>{label}</Label>}
                    {clientButton && (
                      <ClientButton>{clientButton}</ClientButton>
                    )}
                    {job && !job.is_draft && (
                      <div
                        className="leo-flex-center-end"
                        style={{ marginLeft: "20px" }}
                      >
                        <JobHold
                          onHold={job.on_hold}
                          job_id={job.id}
                          job={job}
                          store={store}
                          changeHoldState={(on_hold) =>
                            setJob({ ...job, on_hold })
                          }
                          style={{ marginRight: "14px" }}
                        />
                        <SizzlingComponent
                          hotness={job.sizzle_score}
                          job_id={job.id}
                          job={job}
                          store={store}
                          changeNewSizzlingFactor={(sizzle_score) =>
                            setJob({ ...job, sizzle_score })
                          }
                        />
                        {job?.job_post_type === "public" && (
                          <button
                            style={{ marginLeft: "20px" }}
                            onClick={() => setActiveModal("share-job-social")}
                          >
                            <img
                              src={`${AWS_CDN_URL}/icons/ShareIcon.svg`}
                              alt="ShareIcon"
                            />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CompanyContainer>
            <div className="children-container leo-flex-center-end leo-width-full">
              {children}
            </div>
          </InnerHeader>
          {tabs && tabs.length > 0 && (
            <TabsContainer>
              <TabsMenu
                tabsArr={tabs}
                activeTab={activeTab}
                type={tabType}
                setActiveTab={setActiveTab}
                v2theme={v2theme}
              />
            </TabsContainer>
          )}
        </ATSContainer>
      </Header>
    </>
  );
};

export default ATSBanner;

export const Header = styled.div`
  background: ${COLORS.white};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  height: auto;
  // margin-bottom: 15px;
  padding: 20px 0;
  position: relative;
  width: 100%;
  margin-bottom: 20px !important;
  &.v2theme {
    box-shadow: none;
  }

  @include media-tablet() {
    overflow: visible;
  }

  @media screen and (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const InnerHeader = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex",
}))`
  flex-direction: column;

  @media screen and (min-width: 768px) {
    align-items: center;
    flex-direction: row;
  }
`;
export const AvatarContainer = styled.div`
  margin-right: 15px;
`;

export const CompanyContainer = styled.div`
  @media screen and (min-width: 768px) {
    align-items: center;
    display: flex;
  }

  + div {
    margin-top: 20px;

    @media screen and (min-width: 768px) {
      margin-top: 0;
    }
  }
`;

export const Title = styled.h2`
  color: ${COLORS.dark_1};
  font-size: 20px;
  font-weight: 500;
  width: max-content;
  word-wrap: unset;
  white-space: nowrap;
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: none;
  }
`;

export const CompanyName = styled.span`
  color: ${COLORS.dark_4};
  font-size: 12px;
  margin-bottom: 3px;
  width: max-content;
`;

export const TabsContainer = styled.div`
  margin-bottom: -20px;
  margin-top: 15px;
  overflow-x: auto;
  width: 100%;

  @media screen and (min-width: 768px) {
    margin-top: 30px;
    overflow: hidden;
  }
`;

export const ClientButton = styled.div`
  background: rgba(30, 30, 30, 0.1);
  border-radius: 4px;
  color: #1e1e1e;
  display: inline-block;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  line-height: normal;
  margin-left: 15px;
  padding: 5px 8px;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  top: -2px;
  white-space: nowrap;
`;

export const Label = styled.div`
  background: #00cba7;
  border-radius: 15px;
  color: white;
  display: inline;
  font-size: 12px;
  font-weight: 500;
  padding: 0px 10px;
  margin-left: 10px;
`;
