import React from "react"
import styled from "styled-components"
import {CalendarOutlined, ClockCircleOutlined} from "@ant-design/icons";
import {ScheduledTd, SubmittedTd, TitleTd, HoverTable} from "./styles"
import {CalendarSVG} from "assets/svg/icons/CalendarSVG"
import {ClockBreakSVG} from "assets/svg/icons/ClockBreakSVG"
const HoverMenu = () => {
	return (
		<HoverWraper>
			<HoverTable>
				<tr>
					<TitleTd colSpan={2}>  
						<CalendarSVG />&nbsp; Mon, 07 Oct
					</TitleTd>
				</tr>
				<tr>
					<ScheduledTd>Scheduled <br/>
						<tr><ClockCircleOutlined style={{fontSize: '16px'}}/>&nbsp; 09:00 - 17:30 </tr>
						<tr><ClockBreakSVG color="#B0BDCA" />&nbsp; 1hr break </tr>
					</ScheduledTd> 
					<SubmittedTd>Submitted <br/>
						<tr><ClockCircleOutlined style={{fontSize: '16px'}} />&nbsp; 09:00 - 17:30 </tr>
						<tr><ClockBreakSVG color="#2A3744"/>&nbsp; 1hr break </tr>
					</SubmittedTd>
				</tr>
			</HoverTable> 
		</HoverWraper>
		)
}

export const HoverWraper = styled.div.attrs({
  className: "dropdown-content"
})`
	position: absolute;
	bottom: 70px;
	left: -45px;
	background-color: #f9f9f9;
	width: 260px;
	height: 120px;
	box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
	padding: 12px 12px;
	z-index: 1;
	border-radius: 8px;
`
export default HoverMenu