import styled from "styled-components";

export const JobDescriptionContainer = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  height: 142px;
  margin-bottom: 30px;
  overflow: hidden;
  padding: 20px;

  p {
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const ManageTeamTitle = styled.div`
  border-bottom: 1px solid rgb(238, 238, 238);
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h5 {
    font-weight: 700;
  }
`;

export const JobDescriptionTitle = styled.div`
  display: flex;
  font-size: 15px;
  font-weight: 500;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const ActivityContainer = styled.div`
  background: #fff;
  border-radius: 4px !important;
  margin: 0 !important;
`;

export const ActivityCell = styled.div`
  border-bottom: 1px solid #eee !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  margin: 0 !important;

  &:last-child {
    border-bottom: 0 !important;
  }
`;
