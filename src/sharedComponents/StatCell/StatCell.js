import React from "react";
import styled from "styled-components";

import { device } from "helpers/device";

const Stat = styled.div`
  flex-direction: column;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  height: 100%;
  padding: 15px;

  &.button-hover {
    cursor: pointer;
  }

  @media ${device.tablet} {
    padding: 25px;
  }

  h3 {
    color: #1e1e1e;
    font-size: 30px;
    font-weight: 500;
    line-height: normal;
    margin-bottom: 7px;

    @media ${device.tablet} {
      font-size: 50px;
    }
  }

  h5 {
    color: #9a9ca1;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.2px;
    line-height: normal;
    margin-bottom: 8px;
    text-transform: uppercase;

    @media ${device.tablet} {
      margin-bottom: 10px;
    }
  }

  span {
    color: #00cba7;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
    margin-top: 10px;

    svg {
      margin-right: 5px;
    }

    &.negative {
      color: #ff3159;
    }

    @media ${device.tablet} {
      font-size: 15px;
    }
  }
`;

export default function StatCell({
  metric,
  value,
  increase,
  children,
  onClick,
}) {
  let stringIncrease = `${increase}`;
  const updown = parseInt(increase) >= 0 ? "up" : "down";
  const increaseFinal =
    stringIncrease[0] === "-" ? stringIncrease.substr(1) : stringIncrease;
  return (
    <Stat
      onClick={() => (onClick && value > 0 ? onClick() : {})}
      className={`${
        onClick && value > 0 ? "button-hover" : ""
      } leo-flex leo-justify-between`}
    >
      <div>
        <h3>{value}</h3>
        <h5>{metric}</h5>
        {children}
      </div>
      {increase !== undefined && (
        <div>
          <span
            className={`${
              stringIncrease[0] === "-" ? "negative" : ""
            } leo-flex-center`}
          >
            {updown === "up" ? (
              <svg
                width="12"
                height="8"
                xmlns="http://www.w3.org/2000/svg"
                xlinkHref="http://www.w3.org/1999/xlink"
              >
                <path d="M6 0l6 8H0z" fill="#00cba7" fill-role="evenodd" />
              </svg>
            ) : (
              <svg
                width="12"
                height="8"
                xmlns="http://www.w3.org/2000/svg"
                xlinkHref="http://www.w3.org/1999/xlink"
              >
                <path d="M6 8l6-8H0z" fill="#FF3159" fill-role="evenodd" />
              </svg>
            )}
            {increaseFinal}%
          </span>
        </div>
      )}
    </Stat>
  );
}
