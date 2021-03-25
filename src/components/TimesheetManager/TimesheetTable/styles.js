import styled from "styled-components"

export const TimesheetTableWrapper = styled.table.attrs({
  className: "table table-borderless"
})`
	font-family: 'Inter';
	& > thead > th:last-child {
		color: #74767B;
		font-weight: 800;
	}
	& td {
		padding: .75rem;
	}
`
export const TH = styled.th`
	font-size: 12px;
	font-weight: 500;
	color: #74767B;
`
export const THead = styled.thead`
	border-bottom: 1px solid lightgray;
`
export const Badge = styled.div`
	border-radius: 10px;
	padding: 7px 15px;
	color: ${(props)=>props.color};
	background-color: ${(props)=>props.bgcolor};
	text-align: center;
`
export const B = styled.b`

`
export const JobDesc = styled.span`
	font-size: 14px;
	color: #74767B;
	font-family: 'Inter';
	font-weight: 600;
`
export const NameDesc = styled.span`
	font-size: 14px;
	color: #1E1E1E;
	font-family: Inter;
	margin-bottom: 5px;
	font-weight: 600;
`
export const ScheduledDesc = styled.span`
	color: gray;
	font-weight: 600;
`
export const SubmittedDesc = styled.span`
	font-weight: 600;
`
export const ScheduledTd = styled.td`
	font-family: Inter;
	font-style: normal;
	font-weight: 600;
	font-size: 12px;
	line-height: 15px;
	color: #B0BDCA;
	border-right: 1px solid #C4C4C4 !important;
	& > tr {
		display: flex;
		align-items: center;
		padding: .25rem;
	}
`
export const SubmittedTd = styled.td`
	font-family: Inter;
	font-style: normal;
	font-weight: 600;
	font-size: 12px;
	line-height: 15px;
	color: #1E1E1E;
	padding-left: 10px !important;
	& > tr {
		display: flex;
		align-items: center;
		padding: .25rem;
	}
`
export const TitleTd = styled.td`
	font-weight: 500;
	color: #74767B;
	font-size: 12px;
	line-height: 15px;
	font-style: normal;
	padding: 7px !important;
`
export const HeadTr = styled.tr`
	
	& > td:first-child {
		display:flex;
		align-items: center;
	}
	& > td:first-child > img {
		float: left;
		margin-right: 10px;
	}
`
export const HoverTable = styled.table`
	& td {
		padding: 0;
	}
	& > tr {
		padding: .5rem;
	}
`