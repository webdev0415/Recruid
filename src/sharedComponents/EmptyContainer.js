import React from "react";
import styled from "styled-components";

const Container = styled.div`
  min-height: calc(100vh - 230px);
`;

const Empty = styled.div`
  max-width: 500px;
  text-align: center;

  img {
    margin-bottom: 30px;
    max-height: 300px;
  }

  h2 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 15px;
  }

  p {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 15px;
  }
`;

const EmptyContainer = ({
  buttonAction,
  buttonText,
  image,
  text,
  title,
  children = null,
}) => {
  return (
    <Container className="leo-flex-center-center">
      <Empty>
        {children}
        <img src={image} alt={title} />
        <h2>{title}</h2>
        <p>{text}</p>
        {buttonText && (
          <button
            className="button button--default button--blue-dark"
            onClick={buttonAction}
          >
            {buttonText}
          </button>
        )}
      </Empty>
    </Container>
  );
};

export default EmptyContainer;
