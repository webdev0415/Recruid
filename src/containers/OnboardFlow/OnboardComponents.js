import styled from "styled-components";

export const PageContainer = styled.div`
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 560px 1fr;
  }
`;

export const PageLeft = styled.div`
  background: #2a3744;
  color: #fff;
  display: none;
  min-height: 100vh;
  padding: 50px 40px;
  position: relative;

  @media screen and (min-width: 768px) {
    display: block;
  }

  p {
    font-family: Gelion-Light;
    font-size: 18px;
    letter-spacing: 0.3px;
  }

  a {
    color: #fff;
    text-decoration: underline;
  }
`;

export const PageRight = styled.div`
  align-items: center;
  background: #fff;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 0;

  @media screen and (min-width: 768px) {
    padding: 50px 40px;
  }
`;

export const LogoContainer = styled.div`
  margin-bottom: 60px;
`;

export const PageLeftHeader = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  margin-bottom: 45px;
  padding-bottom: 30px;

  h3 {
    font-family: Gelion-Regular;
    font-size: 28px;
    letter-spacing: 0.47px;
    line-height: 1.2;

    &:not(:last-child) {
      margin-bottom: 40px;
    }
  }
`;

export const PageLeftList = styled.div`
  font-family: Gelion-Light;
  font-size: 16px;
  letter-spacing: 0.27px;

  li {
    display: flex;
    flex-direction: row;
    margin-bottom: 30px;

    svg {
      margin-right: 10px;
      min-width: 12px;
      position: relative;
      top: 4px;
    }
  }
`;

export const PageLeftFooter = styled.div`
  bottom: 50px;
  left: 40px;
  position: absolute;
`;

export const PageRightContainer = styled.div`
  max-width: 300px;

  @media screen and (min-width: 768px) {
    max-width: 500px;
  }
`;

export const PageRightHeader = styled.div`
  margin-bottom: 50px;

  h2 {
    font-family: Gelion-Bold;
    color: #2a3944;
    font-size: 38px;
    letter-spacing: 0.63px;
    line-height: 45px;

    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }

  p {
    font-family: Gelion-Regular;
    font-size: 16px;
    letter-spacing: 0.23px;
  }
`;

export const PagePlan = styled.div`
  margin-bottom: 40px;
  margin-top: 50px;

  h4 {
    font-family: Gelion-Regular;
    font-size: 20px;
    letter-spacing: 0.33px;
    margin-bottom: 10px;
  }
`;

export const Plan = styled.div`
  display: flex;
  position: relative;

  svg {
    margin-right: 10px;
    position: relative;
    top: 5px;
  }
`;

export const PlanDetails = styled.div`
  font-family: Gelion-light;
  font-size: 20px;
  letter-spacing: 0.33px;
  line-height: 22px;

  strong {
    font-family: Gelion-Medium;
  }

  span {
    color: #74767b;
    font-family: Gelion-Light;
    font-size: 16px;
    letter-spacing: 0.27px;
    line-height: 22px;
    text-transform: capitalize;
  }
`;

export const OnboardingForm = styled.form`
  max-width: 300px;

  @media screen and (min-width: 768px) {
    max-width: none;
    min-width: 500px;
  }
`;

export const FormGroup = styled.div`
  max-width: 320px;
  position: relative;

  &:not(:last-child) {
    margin-bottom: 30px;
  }

  label {
    color: rgba(42, 55, 68, 0.75);
    font-family: Gelion-Regular;
    font-size: 12px;
    letter-spacing: 0.17px;
    margin-bottom: 5px;
  }

  .button {
    font-family: Gelion-Regular;
    font-size: 16px;
    padding-bottom: 8px;
    padding-top: 12px;
    width: 180px;

    + p {
      font-family: Gelion-Light;
      font-size: 12px;
      letter-spacing: 0.17px;
      margin-top: 10px;
    }
  }

  input,
  select,
  .card-input {
    border: 0;
    border-radius: 0;
    border-bottom: 1px solid rgba(42, 55, 68, 0.2);
    box-shadow: none;
    font-family: Gelion-Regular;
    font-size: 16px;
    letter-spacing: 0.23px;
    width: 100%;
  }

  &.terms {
    display: flex;
    flex-direction: row;
    font-family: Gelion-Light;
    font-size: 11px;
    font-style: italic;
    letter-spacing: 0.18px;
    max-width: 500px;

    a {
      color: #2a3744;
      font-family: Gelion-Regular;
      text-decoration: underline;
    }

    input {
      max-width: 10px;
      position: relative;
      top: 5px;
    }
  }
`;
