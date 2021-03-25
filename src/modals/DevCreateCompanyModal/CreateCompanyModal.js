import React, { useState, useContext } from "react";
// import styled from "styled-components";
import notify from "notifications";
import snake from "snakecase-keys";
import UniversalModal, {
  ModalFooter,
  ModalBody,
  ModalHeaderClassic,
} from "modals/UniversalModal/UniversalModal";
import GlobalContext from "contexts/globalContext/GlobalContext";
import AgencyForm from "./AgencyForm";
import EmployerForm from "./EmployerForm";
import { createNewCompany } from "helpersV2/company";
import { getAllMyCompanies } from "contexts/globalContext/GlobalMethods";
import { AWS_CDN_URL } from "constants/api";

const CreateCompanyModal = ({ hide }) => {
  const store = useContext(GlobalContext);
  const [stage, setStage] = useState("companyType");
  const [companyType, setCompanyType] = useState(undefined);
  const [state, setState] = useState({
    company: {
      name: "",
      tagLine: "",
      description: "",
      mentionTag: "",
      type: companyType,
      categorizationsAttributes: [],
      localizationsAttributes: [],
      competenciesAttributes: [],
      percentage: "",
    },
    other_percentage: "",
    categoriesTags: [],
    locationsTags: [],
    chosenSkills: [],
    currentSelectedLocation: "",
  });

  const createCompany = () => {
    const company = {
      ...state.company,
      categorizationsAttributes: undefined,
      localizationsAttributes: undefined,
      competenciesAttributes: undefined,
    };
    createNewCompany(
      store.session,
      snake({ ...company, type: companyType })
    ).then((res) => {
      if (!res.err) {
        getAllMyCompanies(store.dispatch, store.session);
        hide();
      } else {
        notify("danger", res);
      }
    });
  };
  return (
    <UniversalModal
      show={true}
      hide={hide}
      id={"assign-contact-modal"}
      width={900}
    >
      <ModalHeaderClassic title="Create Company" closeModal={hide} />
      <ModalBody>
        {stage === "companyType" && (
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-sm-6">
                    <div
                      onClick={() => setCompanyType("Agency")}
                      className={`create-company__option ${
                        companyType === "Agency"
                          ? "create-company__option--active"
                          : ""
                      }`}
                    >
                      <div className="company-option">
                        <div>
                          <div className="company-option__icon">
                            <img
                              src={`${AWS_CDN_URL}/icons/AgencyIcon.svg`}
                              alt=""
                            />
                          </div>
                          <h3 className="company-option__title">
                            Recruitment Agency
                          </h3>
                          <p className="company-option__text">
                            Use Leo to attract business, scale reputation and
                            deliver quality placements.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div
                      onClick={() => setCompanyType("Employer")}
                      className={`create-company__option ${
                        companyType === "Employer"
                          ? "create-company__option--active"
                          : ""
                      }`}
                    >
                      <div
                        className="company-option"
                        href="/company/employer/new"
                      >
                        <div>
                          <div className="company-option__icon">
                            <img
                              src={`${AWS_CDN_URL}/icons/EmployerIcon.svg`}
                              alt=""
                            />
                          </div>
                          <h3 className="company-option__title">Employer</h3>
                          <p className="company-option__text">
                            Use Leo to hire smarter, scale outsourcing and
                            hiring processes with ease.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {stage === "companyForm" && companyType && (
          <div className="container page-wrapper">
            <div className="onboarding-container">
              <div className="row">
                <div className="col-md-3">
                  <div className="onboarding__menu">
                    <h5 className="menu__header">Lets get started</h5>
                  </div>
                </div>
                <div className="col-md-9">
                  {companyType === "Agency" && (
                    <AgencyForm
                      categoriesSuggestions={store.industries}
                      skillSuggestions={store.skills}
                      locationsSuggestions={store.locations}
                      state={state}
                      setState={(newProps) =>
                        setState({ ...state, ...newProps })
                      }
                    />
                  )}
                  {companyType === "Employer" && (
                    <EmployerForm
                      categoriesSuggestions={store.industries}
                      skillSuggestions={store.skills}
                      locationsSuggestions={store.locations}
                      state={state}
                      setState={(newProps) =>
                        setState({ ...state, ...newProps })
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter hide={hide}>
        <button
          style={{ width: "auto" }}
          type="button"
          className="button button--default button--blue-dark button--full"
          onClick={() => {
            if (stage === "companyType") {
              setStage("companyForm");
            } else {
              createCompany();
            }
          }}
        >
          {stage === "companyType" ? "Next" : "Confirm"}
        </button>
      </ModalFooter>
    </UniversalModal>
  );
};

export default CreateCompanyModal;
