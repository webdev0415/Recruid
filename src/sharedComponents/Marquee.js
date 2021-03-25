import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";

const Marquee = ({ children, width, height }) => {
  const node = useRef();
  const containerNode = useRef();
  const [overflows, setOverflows] = useState("");
  const [duration, setDuration] = useState(undefined);

  useEffect(() => {
    if (node.current?.scrollWidth && containerNode.current?.offsetWidth) {
      setDuration(node.current.scrollWidth * 5);
      setOverflows(
        node.current?.scrollWidth > containerNode.current?.offsetWidth
          ? "scroller-text"
          : ""
      );
    }
  }, []);

  return (
    <Container
      size={width}
      height={height}
      ref={containerNode}
      className={overflows}
    >
      <Text size={width} ref={node} className={overflows} duration={duration}>
        {children}
      </Text>
    </Container>
  );
};

export default Marquee;

const Container = styled.div.attrs((props) => ({
  className: (props.className || "") +" leo-flex-center leo-relative",
}))`
  min-height: ${(props) => props.height}px;
  overflow: hidden;
  max-width: ${(props) => props.size.xl}px;

  &.scroller-text {
    width: ${(props) => props.size.xl}px;
    max-width: ${(props) => props.size.xl}px;

    @media screen and (max-width: 1024px) {
      width: ${(props) => props.size.l}px;
      max-width: ${(props) => props.size.l}px;
    }
    @media screen and (max-width: 768px) {
      width: ${(props) => props.size.m}px;
      max-width: ${(props) => props.size.m}px;
    }
    @media screen and (max-width: 480px) {
      width: ${(props) => props.size.s}px;
      max-width: ${(props) => props.size.s}px;
    }
  }
`;

const Text = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  transition: all ${(props) => props.duration}ms;
  max-width: ${(props) => props.size.xl}px;

  @media screen and (max-width: 1024px) {
    max-width: ${(props) => props.size.l}px;
  }
  @media screen and (max-width: 768px) {
    max-width: ${(props) => props.size.m}px;
  }
  @media screen and (max-width: 480px) {
    max-width: ${(props) => props.size.s}px;
  }

  &.scroller-text {
    position: absolute;
    &:hover {
      overflow: visible;
      max-width: none;
      width: auto;
      transform: translate(
        calc(-100% + ${(props) => props.size.xl}px - 10px),
        0
      );
      @media screen and (max-width: 1024px) {
        transform: translate(
          calc(-100% + ${(props) => props.size.l}px - 10px),
          0
        );
      }
      @media screen and (max-width: 768px) {
        transform: translate(
          calc(-100% + ${(props) => props.size.m}px - 10px),
          0
        );
      }
      @media screen and (max-width: 480px) {
        transform: translate(
          calc(-100% + ${(props) => props.size.s}px - 10px),
          0
        );
      }
    }
  }
`;
