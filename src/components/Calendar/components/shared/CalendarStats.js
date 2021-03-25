import React, { useEffect, useState } from "react";
import styled from "styled-components";

export const Wrapper = styled.div`
  border-bottom: 1px solid #eee;
  border-top: 1px solid #eee;
  margin: 0;
  padding: 0;
  padding-bottom: 20px;
  padding-top: 20px;
`;

export const Item = styled.div`
  padding-left: 50px;
  padding-right: 50px;
  text-align: center;

  &:not(:last-child) {
    border-right: 1px solid #eee;
  }
`;

export const Name = styled.div`
  color: #74767b;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.54px;
  line-height: 1;
  margin-bottom: 10px;
  text-align: center;
  text-transform: uppercase;
`;

export const Value = styled.div`
  font-size: 25px;
  font-weight: 500;
  line-height: 1;
  text-align: center;
`;

const CalendarStats = (props) => {
  const [analyticsArr, setAnalyticsArr] = useState(undefined);

  useEffect(() => {
    if (props.analytics) {
      setAnalyticsArr(Object.entries(props.analytics));
    }
  }, [props.analytics]);

  if (props.analytics) {
    return (
      <Wrapper>
        <div className="leo-flex-center">
          {analyticsArr &&
            analyticsArr.map((ats, index) => {
              return (
                <Item key={index}>
                  <Name>{ats[0]}</Name>
                  <Value>{ats[1]}</Value>
                </Item>
              );
            })}
        </div>
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default CalendarStats;
