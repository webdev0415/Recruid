import styled from "styled-components"

export const OptionMenuWraper = styled.div.attrs({
  className: "row py-4"
})`
	
`
export const SelectWraper = styled.div.attrs({
  className: "form-group"
})`
	
`
export const Select = styled.select.attrs({
  className: "form-control"
})`
	
`
export const BtnGroup = styled.div.attrs({
  className: "btn-group form-control"
})`
	align-items: center;
`
export const BtnGroupItem = styled.button.attrs({
  className: "btn btn-default"
})`
	font-weight: ${(props)=>props.active ? 800 : 400}
`