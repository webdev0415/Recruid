import styled from "styled-components";

export const PipelineWrapper = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  min-height: 178px;
  /* max-width: 100%;
  overflow-x: auto; */

  /* * {
    max-width: 100%;
    overflow-x: auto;
  } */

  &.client {
    // background: red;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: 1px solid #eee;
    box-shadow: none;
  }

  &.crm {
    border-radius: 4px;
    border: 1px solid #eee;
    box-shadow: none;
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 0px 0px;
  }
`;

export const PipelineSC = {
  Wrapper: styled.ul`
    align-items: center;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    padding: 20px 10px;
    position: relative;
    max-width: 1140px;
    overflow-x: auto;

    svg,
    img {
      bottom: -12px;
      position: relative;
      min-width: 20px;
    }

    li {
      /* border: 1px solid red; */
      min-width: 80px;
      text-align: center;
      font-weight: 500;
      cursor: pointer;

      &.active {
        span {
          color: #00cba7;
        }
      }
    }
  `,

  StageName: styled.span`
    color: #74767b;
    font-size: 10px;
    letter-spacing: 0.32px;
    margin-bottom: 10px;
    text-transform: uppercase;
  `,

  Value: styled.span`
    color: #1f1f1f;
    font-size: 22px;
  `,
};

export const TableSC = {
  TableWrapper: styled.table`
    background: #ffffff;
    border-radius: 4px;
    // box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    width: 100%;

    &.candidates {
      box-shadow: none;
    }

    &.client {
    }
  `,

  THead: styled.thead`
    tr {
      border-bottom: 1px solid #eee;

      th {
        color: #9a9ca1;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1.67px;
        padding: 10px 0;
        text-transform: uppercase;

        button {
          display: inline-block;

          &:first-of-type {
            margin-right: 10px;
          }
          &.disabled {
            opacity: 0.4;
          }
        }

        &:first-of-type {
          padding-left: 20px;
        }

        &:last-of-type {
          padding-right: 20px;
        }
      }
    }
  `,
  TableRow: styled.tr`
    position: relative;

    & {
      &:not(:last-of-type) {
        border-bottom: 1px solid #eee;
      }

      .pipeline-overview {
        padding: 0;

        table {
          border-radius: 0;
          box-shadow: none;
        }

        .candidates {
          background: transparent;
          border-radius: 0;
          box-shadow: none;
        }
      }

      &:hover:not(.pipeline-overview-row) {
        background-color: #f9f9f9;
        opacity: 1;
      }

      td:not(.pipeline-overview) {
        span {
          color: #000000;
          font-size: 15px;
          font-weight: 500;
          &:hover {
            text-decoration: underline;
          }
        }
        /* color: #1e1e1e; */
        cursor: pointer;
        font-size: 15px;
        font-weight: 400;
        padding: 10px 0;

        a {
          color: #000000;
          font-size: 15px;
          font-weight: 500;
        }

        &:first-of-type {
          padding-left: 20px;
        }

        &:last-of-type {
          padding-right: 20px;
        }
      }

      &.inactive-row {
        background-color: #dddddd;
        border-bottom: none;
        opacity: 0.2;

        &:hover:not(.pipeline-overview-row) {
          background-color: #ffffff;
        }
      }
    }
  `,
};
