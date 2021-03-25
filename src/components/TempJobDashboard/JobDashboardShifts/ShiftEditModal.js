import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import CandidateSelect from "components/TempJobDashboard/JobDashboardShifts/CandidateSelect";
import useDropdown from "hooks/useDropdown";
import CustomCalendar from "sharedComponents/CustomCalendar";
import AppButton from "styles/AppButton";
// import Checkbox from "sharedComponents/Checkbox";
import sharedHelpers from "helpers/sharedHelpers";
import { Subtitle } from "components/Profiles/components/ProfileComponents";
// "create-shift"
// "edit-shift"
// "assign-candidate"

const ShiftEditModal = ({
  closeModal,
  type,
  activeDate,
  activeShift,

  createShift,
  updateShift,
  store,
  jobId,
  jobData,
}) => {
  const node = useRef();
  const [breakValue, setBreakValue] = useState(activeShift?.break || "");
  const [startValue, setStartValue] = useState(
    activeDate.start.format("{hour-24-pad}:{minute-pad}")
  );
  const [endValue, setEndValue] = useState(
    activeDate.end.format("{hour-24-pad}:{minute-pad}")
  );
  const [daySelected, setDaySelected] = useState(activeDate.start);
  const [selectedCandidate, setSelectedCandidate] = useState(
    activeShift?.applicant || undefined
  );
  const [rates, setRates] = useState({
    interval: "hourly",
    pay_rate: undefined,
    charge_rate: undefined,
  });

  const handleClick = (e) => {
    if (!node.current.contains(e.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const updateBreakValue = (val) => {
    let numVal = Number(val);

    if (numVal === numVal) {
      if (numVal > 240) {
        setBreakValue(240);
      } else if (numVal < 0) {
        setBreakValue(0);
      } else {
        setBreakValue(numVal);
      }
    }
  };

  useEffect(() => {
    if (jobData && activeShift) {
      let pay_interval =
        activeShift.pay_interval || jobData.pay_interval || "hourly";
      setRates({
        pay_interval: pay_interval,
        pay_rate: activeShift.pay_rate || jobData.pay_rate || "",
        charge_rate: activeShift.charge_rate || jobData.charge_rate || "",
      });
    }
  }, [jobData, activeShift]);

  const saveShift = async () => {
    let body = {
      start_time: new Date(
        daySelected
          .hour(startValue.split(":")[0])
          .minute(startValue.split(":")[1]).epoch
      ),
      end_time: new Date(
        daySelected
          .hour(endValue.split(":")[0])
          .minute(endValue.split(":")[1]).epoch
      ),

      // rate: integer (shift rate in cents so $1 = 100),
      job_post_id: jobId,
      applicant_id: selectedCandidate?.applicant_id,
      team_member_id: store.role.team_member.team_member_id,
      // notes: string
      break: breakValue === "" ? 0 : breakValue,
    };
    if (selectedCandidate && type === "assign-candidate") {
      body = { ...body, ...rates };
    }
    if (selectedCandidate && !selectedCandidate?.applicant_id) {
      const postBody = {
        company_id: jobData.company.id,
        job_id: jobId,
        candidate_ids: [selectedCandidate.professional_id],
        recruiter_id: store.role.team_member.team_member_id,
      };
      if (store.company.id !== jobData.company.id) {
        postBody.agency_id = store.company.id;
      }
      let res = await sharedHelpers.inviteProfessionalsToJob(
        postBody,
        store.session
      );
      if (res && res !== "err") {
        if (res.created_candidates.length > 0) {
          body.applicant_id = res.created_candidates[0].applicant_id;
        } else if (res.existing_applicants.length > 0) {
          body.applicant_id = res.created_candidates[0].applicant_id;
        }
      }
    }
    if (type === "create-shift") {
      //save new shift
      createShift(body);
    } else {
      updateShift(body);
      //edit shift
    }
  };

  return (
    <Wrapper>
      <Container ref={node}>
        <Header>
          {type === "create-shift"
            ? "Create Shift"
            : type === "edit-shift"
            ? "Edit"
            : "Assign"}
          <button onClick={() => closeModal()}>
            <i className="fas fa-times"></i>
          </button>
        </Header>
        {type !== "assign-candidate" && (
          <CategoriesGrid>
            <>
              <div className="section-title">Date</div>
              <i className="far fa-calendar-alt" />
              <DaySelect
                daySelected={daySelected}
                setDaySelected={setDaySelected}
              />
              <div className="section-title">Time</div>
              <i className="far fa-clock"></i>
              <TimeSelect>
                <div className="time-box">
                  <span>Start</span>
                  <input
                    type="time"
                    step="300"
                    value={startValue}
                    onChange={(e) => setStartValue(e.target.value)}
                  />
                </div>
                <div className="time-box">
                  <span>End</span>
                  <input
                    type="time"
                    step="300"
                    value={endValue}
                    onChange={(e) => setEndValue(e.target.value)}
                  />
                </div>
                <div className="time-box leo-flex">
                  <span>Break</span>
                  <input
                    type="number"
                    step="5"
                    max="240"
                    min="0"
                    value={breakValue}
                    onChange={(e) => updateBreakValue(e.target.value)}
                    style={{ width: "43%" }}
                  />
                  <span>min</span>
                </div>
              </TimeSelect>
              {/*type === "create-shift" && (
                <>
                  <div className="section-title">Repeat</div>
                  <RepeatSvg />
                  <WeekRepeatCheckboxes />
                </>
              )*/}
            </>
            {/*type === "edit-shift" && (
              <>
                <div className="section-title">Candidate</div>
                <i className="far fa-user"></i>
                <CandidateSelect
                  selectedCandidate={selectedCandidate}
                  setSelectedCandidate={setSelectedCandidate}
                  store={store}
                  jobId={jobId}
                  type={type}
                  shiftId={activeShift.id}
                />
              </>
            )*/}
          </CategoriesGrid>
        )}
        {type === "assign-candidate" && (
          <>
            <CandidateSelect
              selectedCandidate={selectedCandidate}
              setSelectedCandidate={setSelectedCandidate}
              store={store}
              jobId={jobId}
              type={type}
              shiftId={activeShift.id}
              rateDisplay={rates.pay_interval}
            />
            <RateSelector
              store={store}
              activeShift={activeShift}
              setRates={setRates}
              rates={rates}
            />
          </>
        )}
        {selectedCandidate?.blacklisted && (
          <BlacklistedSpan>
            You are trying to add blacklisted candidate to a shift, if you
            proceed the candidate will no longer be blacklisted
          </BlacklistedSpan>
        )}
        <Footer>
          <div>
            {type !== "assign-candidate" && (
              <AppButton
                theme="dark-blue"
                size="small"
                onClick={() => saveShift()}
              >
                {type === "create-shift" ? "Create" : "Save"}
              </AppButton>
            )}
            {type === "assign-candidate" && (
              <AppButton
                theme="dark-blue"
                size="small"
                onClick={() => saveShift()}
              >
                Assign
              </AppButton>
            )}
          </div>
        </Footer>
      </Container>
    </Wrapper>
  );
};

const DaySelect = ({ daySelected, setDaySelected }) => {
  const { node, showSelect, setShowSelect } = useDropdown();

  return (
    <DateContainer ref={node}>
      <span onClick={() => setShowSelect(true)}>
        {days[daySelected.day()]} {daySelected.date()}{" "}
        {months[daySelected.month()]}
      </span>
      {showSelect && (
        <CalendarContainer>
          <CustomCalendar
            type="day"
            initialValue={daySelected}
            returnValue={(val) => {
              setDaySelected(val);
              setShowSelect(false);
            }}
          />
        </CalendarContainer>
      )}
    </DateContainer>
  );
};

// const WeekRepeatCheckboxes = () => {
//   return (
//     <CheckboxesContainer>
//       {shortDays.map((day, index) => (
//         <div className="flexer" key={`checkboxes-${index}`}>
//           <Checkbox onClick={() => console.log("")} active={index === 1} />
//           <span>{day}</span>
//         </div>
//       ))}
//     </CheckboxesContainer>
//   );
// };

const RateSelector = ({ store, rates, setRates }) => {
  return (
    <RateContainer>
      <div className="cell-container">
        <Subtitle>Interval</Subtitle>
        <select
          className="form-control form-control-select"
          value={rates.pay_interval}
          onChange={(e) => setRates({ ...rates, pay_interval: e.target.value })}
        >
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
        </select>
      </div>
      <div className="cell-container" />
      <div className="cell-container">
        <Subtitle>Pay Rate</Subtitle>
        <RatesContainer>
          <div className="flex">
            <CurrencyIcon>{store.company.currency?.currency_name}</CurrencyIcon>
            <input
              type="number"
              className="form-control"
              style={{
                borderRadius: "0 4px 4px 0",
                width: "calc(100% - 40px)",
              }}
              value={rates.pay_rate / 100 || ""}
              onChange={(e) =>
                setRates({ ...rates, pay_rate: e.target.value * 100 })
              }
            />
          </div>
        </RatesContainer>
      </div>
      <div className="cell-container">
        <Subtitle>Charge Rate</Subtitle>
        <RatesContainer>
          <div className="flex">
            <CurrencyIcon>{store.company.currency?.currency_name}</CurrencyIcon>
            <input
              type="number"
              className="form-control"
              style={{
                borderRadius: "0 4px 4px 0",
                width: "calc(100% - 40px)",
              }}
              value={rates.charge_rate / 100 || ""}
              onChange={(e) =>
                setRates({ ...rates, charge_rate: e.target.value * 100 })
              }
            />
          </div>
        </RatesContainer>
      </div>
    </RateContainer>
  );
};

export default ShiftEditModal;

const Container = styled.div`
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 24px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  min-width: 350px;
`;

const DateContainer = styled.div`
  position: relative;
  padding: 5px;
  text-align: left;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #53585f;
`;

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #00000030;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
`;

const Header = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #2a3744;
  padding: 15px;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  align-items: center;
  justify-content: space-between;

  button {
    color: grey;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  grid-gap: 15px;
  padding: 20px 0px;
  margin: 0px 15px;
  align-items: center;

  .section-title {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    text-align: right;
    color: #74767b;
  }

  i {
    color: #74767b;
    font-size: 16px;
  }
`;

const TimeSelect = styled.div`
  display: flex;

  .time-box {
    border: 1px solid #eeeeee;
    border-radius: 4px;
    display: grid;
    grid-gap: 5px;
    grid-template-columns: auto 1fr;
    align-items: center;
    width: 120px;

    padding: 0px 4px;

    &:not(:last-child) {
      margin-right: 10px;
    }

    input {
      width: 100%;
      border: none;
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      color: #53585f;
    }

    span {
      font-weight: 500;
      font-size: 12px;
      line-height: 15px;
      color: #c4c4c4;
    }
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 20px 0px;
  margin: 0px 20px;
  border-top: solid #eee 1px;

  div button {
    margin-left: 10px;
  }
`;

const CalendarContainer = styled.div`
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.78);
  position: absolute;
  background: #ffffff;
  top: 35px;
  left: -2px;
  z-index: 10;
`;

// const CheckboxesContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(5, 1fr);
//
//   div.flexer {
//     display: flex;
//     align-items: center;
//     margin-bottom: 10px;
//     width: min-content;
//
//     span {
//       font-size: 14px;
//       line-height: 16px;
//       color: #53585f;
//       margin-left: 10px;
//     }
//   }
// `;

const RateContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 25px 0px 0px 0px;
  border-top: solid #eee 1px;
  margin: 0px 15px;
  max-width: 350px;
  grid-gap: 10px;

  .cell-container {
    height: min-content;
  }

  select,
  input {
    margin: 0px !important;
    font-size: 12px !important;
    height: 30px !important;
  }
`;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// const shortDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// const RepeatSvg = () => (
//   <svg width="17" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path
//       d="M6.453 1l3.636 3.637-3.636 3.636M10.09 21l-3.637-3.637 3.637-3.636"
//       stroke="#74767B"
//       stroke-miterlimit="10"
//       stroke-linecap="round"
//       stroke-linejoin="round"
//     />
//     <path
//       d="M.5 12.819a.5.5 0 101 0h-1zm9.59-8.682H4v1h6.09v-1zM.5 7.637v5.182h1V7.636h-1zm3.5-3.5a3.5 3.5 0 00-3.5 3.5h1a2.5 2.5 0 012.5-2.5v-1zM16.047 9.181a.5.5 0 00-1 0h1zm-9.591 8.682h6.09v-1h-6.09v1zm9.59-3.5V9.181h-1v5.182h1zm-3.5 3.5a3.5 3.5 0 003.5-3.5h-1a2.5 2.5 0 01-2.5 2.5v1z"
//       fill="#74767B"
//     />
//   </svg>
// );

const RatesContainer = styled.div`
  display: block;
  align-items: baseline;
  margin-bottom: 10px;
  input {
    margin-right: 10px;
  }
`;

const CurrencyIcon = styled.span`
  background: #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px 0px 0px 6px;
  width: 40px;
  height: 30px;
  padding: 12px;
`;

const BlacklistedSpan = styled.span`
  max-width: 350px;
  padding: 10px 20px;
  font-size: 12px;
  color: #717171;
`;
