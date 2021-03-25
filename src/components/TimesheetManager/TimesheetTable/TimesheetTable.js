import React, {useState, useReducer} from "react"
import { TimesheetTableWrapper, TH, THead, Badge, B, NameDesc, JobDesc, HeadTr } from "./styles"
import TimesheetModal from "components/TimesheetManager/TimesheetModal"
import HoverMenu from "./HoverMenu"
import { Modal, Button } from 'antd';
import "antd/dist/antd.css";

const TD = ({ activeTab, disabled}) => {
	const [isShown, setIsShown] = useState(false)
	
	return (
		<td onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)} style={{position: 'relative'}}>
			<input type="text" className="form-control" disabled={disabled}/>
				{activeTab==="completed" && isShown && (
					<HoverMenu />
				)}	
		</td>
		)
}
const CheckboxTD = ({idx, activeTab, edata, setEData, setCheckedCount, param, setModal, modal}) => {
	const handleCheckboxClick = (e, idx, param, activeTab, setEData, edata, setCheckedCount, setModal, modal) => {
		edata[param].filter((item, index)=> index === idx)[0].checked = !edata[param].filter((item, index)=> index === idx)[0].checked
		setEData(edata)
		setModal(!modal)
	}
	return (
		<td>
			<input type="checkbox" className="form-control" style={{width: '30px', margin: '0 auto'}} onChange={(e)=>handleCheckboxClick(e, idx, param, activeTab, setEData, edata, setCheckedCount, setModal, modal)}/>
		</td>
		
		)
}
const TR = ({item, activeTab, idx, setEData, edata, setCheckedCount, param, setModal, modal}) => {
	
	return (
		<tr style={{borderBottom: '1px solid lightgray'}}>
	        <td>
				<NameDesc>{item.name}</NameDesc>
				<JobDesc>{item.job}</JobDesc>
			</td>
				<TD activeTab={activeTab}/>
				<TD activeTab={activeTab}/>
				<TD activeTab={activeTab}/>
				<TD activeTab={activeTab}/>
				<TD activeTab={activeTab}/>
				<TD activeTab={activeTab} disabled={true}/>
				<TD activeTab={activeTab} disabled={true}/>
				<TD activeTab={activeTab}/>
				<CheckboxTD idx={idx} activeTab={activeTab} edata={edata} setEData={setEData} setCheckedCount={setCheckedCount} param={param} setModal={setModal} modal={modal} />
	    </tr>
		)
}

const TimesheetTable = ({data, activeTab}) => {	
	const [modal, setModal] = useState(false)
	const [edata, setEData] = useState(data)
	let initCount = edata.google.filter(item=>item.checked === true).length + edata.monzo.filter(item=>item.checked === true).length
	const [checkedCount, setCheckedCount] = useState(initCount)
	const [displayModal, setDisplayModal] = useState(false)

	React.useEffect(()=>{
		initCount = edata.google.filter(item=>item.checked === true).length + edata.monzo.filter(item=>item.checked === true).length
		setDisplayModal(initCount > 0)
	}, [modal])
	return (
		<>
		<TimesheetTableWrapper>
	        <THead>
	          <TH width="220" style={{borderBottom: '1px solid transparent'}}></TH>
	          <TH>MON, OCT 07</TH>
	          <TH>TUE, OCT 08</TH>
	          <TH>WED, OCT 09</TH>
	          <TH>THU, OCT 10</TH>
	          <TH>FRI, OCT 11</TH>
	          <TH>SAT, OCT 12</TH>
	          <TH>SUN, OCT 13</TH>
	          <TH style={{fontWeight: 800}}>TOTAL</TH>
	          <TH width="50">{activeTab==="approved" && <b>INVOICE</b>}</TH>
	        </THead>
	        <HeadTr>
	        	<td><img src={process.env.PUBLIC_URL + '/images/google-logo.png'} width="40" height="40" alt="google"/><B>Google</B></td>
	        	<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
	        	<td>{activeTab==="approved" && <Badge color="#eb8634" bgcolor="#fab882">Pending</Badge>}</td>
	        </HeadTr>
	        {
	        	edata && edata.google.map((item, idx)=> (
	        		<TR key={idx} item={item} activeTab={activeTab} idx={idx} setEData={setEData} edata={edata} param="google" setCheckedCount={setCheckedCount} setModal={setModal} modal={modal}/>
	        		))
	        }
	        <HeadTr>
	        	<td><img src={process.env.PUBLIC_URL + '/images/monzo-logo.png'} width="40" height="40" alt="google" /><B>Monzo</B></td>
	        	<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
	        	<td>{activeTab==="approved" && <Badge color="#369abf" bgcolor="#87dbfa">Sent</Badge>}</td>
	        </HeadTr>
	        {
	        	edata && edata.monzo.map((item, idx)=> (
	        		<TR key={idx} item={item} activeTab={activeTab} idx={idx} setEData={setEData} edata={edata} setCheckedCount={setCheckedCount} param="monzo" setModal={setModal} modal={modal} />
	        		))
	        }
	      </TimesheetTableWrapper>
	      <TimesheetModal show={displayModal} activeTab={activeTab} checkedCount={initCount} />

	      </>
		)
}

export default TimesheetTable