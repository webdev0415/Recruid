import React from "react";
import {ModalWraper, ModalContent, Button, RowContent} from "./styles";

const TimesheetModal = ({show, activeTab, checkedCount}) => {
	return(

	    <ModalWraper show={show}>
			       <ModalContent> 
				        <RowContent>
					        <div>  
						        <div className="form-check">
						    		<label className="form-check-label"> 
						    		<input type="checkbox"  className="form-check-input" width="20" height="20" checked={true} /> {checkedCount} Employee Selected </label>
						  		</div>
					  		</div>
							<div> 
								{
									(activeTab === "pending" || activeTab === "completed") && <Button bgcolor="#8CD4ED">Send Email</Button>
								}
								  
								{
									activeTab === "completed" && <Button bgcolor="#F27881">Reject</Button>
								}
								{
									activeTab === "completed" && <Button bgcolor="#00CBA7">Approve and submit to client</Button>
								}
								{
									activeTab === "approved" && <Button bgcolor="#00CBA7">Create new invoice</Button>
								}
							</div>  
						</RowContent>
		        	</ModalContent>
  		</ModalWraper>

		)
	
}
export default TimesheetModal
