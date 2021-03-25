import React from "react";
import {
  Header,
  InnerHeader,
  CompanyContainer,
  AvatarContainer,
  CompanyName,
  Title,
} from "sharedComponents/ATSBanner";
import styled from "styled-components";
import { PermissionChecker } from "constants/permissionHelpers";
import styles from "./style/talentNetworkBanner.module.scss";
import AvatarIcon from "sharedComponents/AvatarIcon";
import { ATSContainer } from "styles/PageContainers";
import SimpleDelayedInput from "sharedComponents/SimpleDelayedInput";
import { AWS_CDN_URL } from "constants/api";

const TalentNetworkBanner = ({
  company,
  search,
  setSearch,
  network,
  openModal,
  totalResults,
}) => {
  return (
    <>
      <Header>
        <ATSContainer>
          <InnerHeader>
            <CompanyContainer>
              <div className="leo-flex-center-end leo-width-full">
                <AvatarContainer>
                  <AvatarIcon
                    name={company?.name}
                    imgUrl={company?.avatar_url}
                    size={50}
                  />
                </AvatarContainer>
                <div>
                  <CompanyName>{company?.name}</CompanyName>
                  <div className="leo-flex-center-end leo-width-full">
                    <Title>
                      {" "}
                      {totalResults ? `${totalResults} ` : ""}Candidates
                    </Title>
                  </div>
                </div>
              </div>
            </CompanyContainer>
            <div className="children-container leo-flex-center-end leo-width-full">
              <InputContainer>
                {network?.length >= 0 && (
                  <div className="input-container">
                    <SimpleDelayedInput
                      className={styles.form}
                      placeholder="Search candidates by keywords or boolean values"
                      value={search}
                      onChange={(val) => setSearch(val)}
                    />
                    <img src={`${AWS_CDN_URL}/icons/Magnifier.svg`} alt="" />
                  </div>
                )}
                <PermissionChecker type="edit" valid={{ recruiter: true }}>
                  <div className={styles.buttons}>
                    <button
                      className="button button--default button--blue-dark"
                      onClick={() => openModal("addTalent")}
                    >
                      Add Talent
                    </button>
                  </div>
                </PermissionChecker>
              </InputContainer>
            </div>
          </InnerHeader>
        </ATSContainer>
      </Header>
    </>
  );
};

export default TalentNetworkBanner;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: flex-end;

  div {
    position: relative;
  }

  .input-container {
    width: 331px;
    margin-right: 15px;
    border-bottom: solid 1px #c4c4c4;

    input {
      max-width: unset !important;
      border: none;
      border-radius: 0px;
      background: none;
      height: initial;
      padding-bottom: 5px;
      color: #2a3744;
      padding-left: 5px;
      padding-right: 20px;
      font-size: 12px;
      line-height: 15px;
    }
    li {
      right: 0px;
      // color: #eee;
      bottom: 5px;
      color: #2a3744;
    }
  }

  svg,
  img {
    position: absolute;
    right: 0;
    top: 4px;
  }

  li {
    align-items: center;
    color: #9a9ca1;
    display: flex;
    font-size: 14px;
    padding: 0;
    position: absolute;
    bottom: 0;
    left: 15px;
    top: 0;
  }
`;
