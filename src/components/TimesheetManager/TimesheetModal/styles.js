import styled from "styled-components"

export const ModalWraper = styled.div`
	position: fixed;
	bottom: 200px;
	left: 0;
	display: ${(props)=>props.show ? "flex" : "none"};
	width: 100%;
	height: 90px;
	max-wi
	align-items: center;
	background-color: #444;
	color: gray;
`
export const ModalContent = styled.div`
	width: 1170px;
	padding: 30px;
	margin: 0 auto;
`
export const Button = styled.button.attrs({
	className: "btn"
})`
	background-color: ${(props)=>props.bgcolor};
	border: 1px solid #2A3744;
	box-sizing: border-box;
	border-radius: 4px;
	color: white;
	font-family: Inter;
	font-style: normal;
	font-weight: 600;
	font-size: 14px;
	line-height: 17px;
	margin-left: 15px;
	padding: 10px 20px;
`
export const RowContent = styled.div.attrs({
	className: "row"
})`
	justify-content: space-between;
`