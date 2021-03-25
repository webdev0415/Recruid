import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import styled from "styled-components";

import "react-datepicker/dist/react-datepicker.css";
import "components/Profiles/components/datepicker.scss";

export const CardContainer = styled.div`
  &:not(:last-child) {
    margin-bottom: 30px;
  }
`;

export const TabTitle = styled.h4`
  font-size: 14px;
  font-weight: 500;
`;

export const SectionContainer = styled.div`
  margin-bottom: 50px;
`;

export const DetailContainer = styled.div`
  margin-bottom: 20px;
`;

export const Subtitle = styled.h5`
  color: #74767b;
  font-size: 12px;
  margin-bottom: 10px;
`;

export const AllLink = styled(Link)`
  color: #74767b;
  display: block;
  font-size: 12px;
  text-align: right;
  text-decoration: none;
  width: 100%;

  &:hover {
    color: #74767b;
  }
`;

export const Content = styled.div`
  font-size: 14px;
  white-space: pre-wrap;

  &:not(:last-child) {
    margin-bottom: 20px;
  }

  ul {
    display: flex;
    list-style: none;
    flex-wrap: wrap;
    padding: 0;

    li {
      &:not(:last-child) {
        margin-right: 3px;

        &:after {
          content: ", ";
        }
      }
    }
  }
`;

export const HeaderWrapper = styled.div`
  background: #fff;
  width: 100%;

  &.grey {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  }
`;

export const HeaderContainer = styled.div`
  border-bottom: 1px solid #e1e1e1;
  display: flex;
  justify-content: space-between;
  padding: 20px 0;

  @media screen and (min-width: 768px) {
    align-items: center;
  }

  &.grey {
    border-bottom: 0;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  position: relative;

  .company-name {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const HeaderRight = styled.div``;

export const TitleContainer = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 5px !important;
`;

export const SectionTitleContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const CandidateDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 15px;
`;

export const CandidateName = styled.h2`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 4px;

  @media screen and (min-width: 768px) {
    font-size: 22px;
  }
`;

export const CandidateTitle = styled.span`
  color: #74767b;
  font-size: 12px;

  span {
    display: inline-flex;
  }
`;

export const BodyWrapper = styled.div`
  background: #eee;
  border-top: 1px solid rgba(0, 0, 0, 0.01);
  padding: 20px;
  min-height: calc(100vh - 139px);
  position: relative;

  @media screen and (min-width: 768px) {
    padding: 40px 40px;
  }

  &.overview {
    background: #fff;
    border-top: none;
  }
`;

export const CandidateWrapper = styled.div`
  background: #fff;
  width: 100%;
`;

export const BodyContainer = styled.div`
  display: flex;

  @media screen and (min-width: 768px) {
    // grid-column-gap: 50px;
    grid-template-columns: 1fr 520px;
    height: calc(100vh - 200px);
    // position: absolute;
  }

  &.full {
    display: none;
  }

  .react-datepicker-wrapper {
    width: 100%;
  }

  .form-control-select,
  textarea {
    margin-bottom: 10px;
  }
`;

export const BodyLeft = styled.div`
  margin-bottom: 30px;
  padding: 20px 0;
  padding-right: 40px;
  width: 100%;
  z-index: 2;
  background: white;

  @media screen and (min-width: 768px) {
    margin: 0;
    overflow-y: auto;
  }

  &.full {
    padding: 20px 0;
  }
`;

export const BodyRight = styled.div`
  background: #f6f6f6;
  border-left: 1px solid #e1e1e1;
  border-top: 1px solid #e1e1e1;
  height: 100%;
  margin-top: -1px;
  max-height: calc(100vh - 201px);
  max-width: 520px;
  min-width: 520px;
  padding: 20px;
  /* position: absolute; */
  right: 0;
  z-index: 1;

  @media screen and (min-width: 768px) {
    overflow-y: auto;
  }

  @media screen and (min-width: 1367px) {
    position: relative;
  }
`;

export const ActionBackground = styled.div`
  // background: #f6f6f6;
  border-top: 1px solid #e1e1e1;
  bottom: 0;
  position: absolute;
  right: 0;
  top: 201px;
  width: 100%;
  max-height: calc(100vh - 201px);
  z-index: 0;
  display: flex;
  div {
    width: 100%;
    height: 100%;
    // background: red;
  }
  .grey-background {
    background: #f6f6f6;
  }

  @media screen and (max-width: 1366px) {
    /* display: none; */
  }
`;

export const TabsMenuContainer = styled.div`
  margin: 0 20px;
  position: relative;

  @media screen and (min-width: 768px) {
    margin: 0 40px;
  }

  &.overview {
    border-bottom: 1px solid #eee;
  }
`;

export const StyledDatePicker = styled(DatePicker)`
  background: #fff;
  border-radius: 0px 6px 6px 0px;
  box-shadow: none;
  margin: 0;
  width: 100%;

  &.profile {
    border-radius: 4px;
    font-size: 14px;
    height: 30px;
    margin-bottom: 12px;
    min-width: 200px;
    padding-left: 10px;
  }
`;

export const ActivityItem = styled.div`
  // align-items: center;
  background: #fff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  font-size: 14px;
  // justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px 15px;
`;

export const ActivityDetails = styled.div`
  // align-items: center;
  display: flex;
  flex-direction: column;
  margin-left: 15px;

  h5 {
    max-width: 245px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 290px;
  }

  p {
    font-size: 14px;
    line-height: 22px;
    white-space: pre-wrap;

    span,
    a {
      display: inline;
    }

    span {
      margin-left: 3px;
    }

    &:last-of-type {
      margin: 0;
    }
  }
`;

export const ActivityDate = styled.div`
  color: #74767b;
  font-size: 12px;
`;
