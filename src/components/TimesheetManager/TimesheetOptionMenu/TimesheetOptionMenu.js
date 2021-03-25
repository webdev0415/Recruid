import React, {useState} from "react";
import DataRangePicker from "components/TimesheetManager/TimesheetDateRangePicker"
import {OptionMenuWraper, SelectWraper, Select, BtnGroup, BtnGroupItem} from "./styles"

const TimesheetOptionMenu = ({
	allMyCompanies
}) => {
	const [weekFlag, setWeekFlag] = useState(true)
	const [monthFlag, setMonthFlag] = useState(false)

	const handleWeekClick = () => {
		setWeekFlag(true)
		setMonthFlag(false)
	}
	const handleMonthClick = () => {
		setMonthFlag(true)
		setWeekFlag(false)
	}
	return (
		<OptionMenuWraper>
	        <div className="col-md-2">
	          <SelectWraper>
	            <Select>
	              <option>All Companies</option>
              		{
              			allMyCompanies.map((item, idx)=>(
              				
              				<option key={idx} value={item.name}>{item.name}</option>

              			))
              		}
	            </Select>
	          </SelectWraper>
	        </div>
	        <div className="col-md-2">
	          <BtnGroup>
	            <BtnGroupItem active={weekFlag} onClick={handleWeekClick}>Week</BtnGroupItem>
	            <BtnGroupItem active={monthFlag} onClick={handleMonthClick}>Month</BtnGroupItem>
	          </BtnGroup>
	        </div>
	        <div className="col-md-4">
	        	<DataRangePicker />
	        </div>
	    </OptionMenuWraper>
		)
}

export default TimesheetOptionMenu