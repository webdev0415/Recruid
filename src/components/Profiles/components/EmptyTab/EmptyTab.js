import React from "react";
import styled from "styled-components";

import Spinner from "sharedComponents/Spinner";

const EmptyTab = ({
  children,
  data,
  copy,
  action,
  actionText,
  title,
  image,
  marginTop,
}) => {
  return (
    <>
      {data === undefined ? (
        <Spinner />
      ) : (Array.isArray(data) && data.length === 0) || data === true ? (
        <EmptyContainer style={marginTop && { marginTop: marginTop }}>
          <Image>{image}</Image>
          {title && <h2>{title}</h2>}
          {copy && <p>{copy}</p>}
          {action && (
            <button
              className="button button--default button--blue-dark "
              onClick={action}
            >
              {actionText}
            </button>
          )}
        </EmptyContainer>
      ) : (
        children
      )}
    </>
  );
};

export default EmptyTab;

const EmptyContainer = styled.div`
  text-align: center;
  width: 100%;

  h2 {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 5px;
  }

  p {
    font-size: 16px;
  }
`;

const Image = styled.div`
  min-height: 230px;
  margin-bottom: 30px;
`;
