import styled from "styled-components";

const FadeWrapper = styled.div`
  position: relative;
  &.in {
    animation: fadein 0.5s;
  }
  &.out {
    animation: fadeout 0.5s;
  }
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fadeout {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

export default FadeWrapper;
