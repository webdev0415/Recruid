import React, {useState} from "react";
import ATSBanner from "sharedComponents/ATSBanner";
import { ATSContainer } from "styles/PageContainers";
import TimesheetOptionMenu from "components/TimesheetManager/TimesheetOptionMenu"
import TimesheetTable from "components/TimesheetManager/TimesheetTable"
// import 'react-date-range/dist/styles.css'; // main css file
// import 'react-date-range/dist/theme/default.css';
// import { DateRange } from 'react-date-range';
const PendingArr = {
	"google": [
		{
			"name": "Lucas Gray",
			"job": "Software engineer",
			"checked": false,
		},
		{
			"name": "Amalia Montero",
			"job": "Software engineer",
			"checked": false,
		},
		{
			"name": "Paul Jordan",
			"job": "Software engineer",
			"checked": false,
		},
	],
	"monzo": [
		{
			"name": "Lucas Gray",
			"job": "Software engineer",
			"checked": false,
		},
		{
			"name": "David Smith",
			"job": "Software engineer",
			"checked": false,
		},
		{
			"name": "Paul Jordan",
			"job": "Software engineer",
			"checked": false,
		},
	]
}
const CompletedArr = {
	"google": [
		{
			"name": "Lucas Gray",
			"job": "Software engineer"
		},
		{
			"name": "Amalia Montero",
			"job": "Software engineer"
		},
		{
			"name": "Paul Jordan",
			"job": "Software engineer"
		},
	],
	"monzo": [
		{
			"name": "Lucas Gray",
			"job": "Software engineer"
		},
		{
			"name": "David Smith",
			"job": "Software engineer"
		},
		{
			"name": "Paul Jordan",
			"job": "Software engineer"
		},
	]
}
const ApprovedArr = {
	"google": [
		{
			"name": "Lucas Gray",
			"job": "Software engineer"
		},
		{
			"name": "Amalia Montero",
			"job": "Software engineer"
		},
		{
			"name": "Paul Jordan",
			"job": "Software engineer"
		},
	],
	"monzo": [
		{
			"name": "Lucas Gray",
			"job": "Software engineer"
		},
		{
			"name": "David Smith",
			"job": "Software engineer"
		},
		{
			"name": "Paul Jordan",
			"job": "Software engineer"
		},
	]
}
// const PedingContext = React.createContext(PendingArr)
const TimesheetPending = ({
	store,
	permission,
	activeTab,
	tabsArr,
}) => {
	return (
		<>
		<ATSBanner name={store.company?.name} avatar={store.company?.avatar_url} page="Temp + Timesheet" tabs={tabsArr} activeTab={activeTab} tabType="link" v2theme={true}/>
	    <ATSContainer>
	    	<TimesheetOptionMenu
	    		allMyCompanies={store.allMyCompanies}
	    	 />
	    	{
	    		activeTab === "pending" && <TimesheetTable data={PendingArr} activeTab={activeTab}/>
	    	}
	      	{
	    		activeTab === "completed" && <TimesheetTable data={CompletedArr} activeTab={activeTab}/>
	    	}
	    	{
	    		activeTab === "approved" && <TimesheetTable data={ApprovedArr} activeTab={activeTab}/>
	    	}
		   
	   </ATSContainer>
		</>
		)
}
export default TimesheetPending