import React, { useState, useEffect } from "react";
import ActivateCareersPortal from "components/MarketingEmails/components/ActivateCareersPortal";
import CareersOptions from "components/MarketingEmails/CareersOptions";
import TagsComponent from "sharedComponents/TagsComponent";
import { PermissionChecker } from "constants/permissionHelpers";
import companyHelpers from "helpers/company/company.helpers";
import notify from "notifications";
import { updateCompanyData } from "helpersV2/company";
import { updateCompany } from "contexts/globalContext/GlobalMethods";
import { fetchFullCompanyData } from "helpersV2/company";
import {
  flattenSkills,
  flattenIndustries,
  flattenLocations,
} from "sharedComponents/TagsComponent/methods/tags";
import Spinner from "sharedComponents/Spinner";

const MarketingCareersPortalTab = ({ store, permission }) => {
  const [companyData, setCompanyData] = useState(undefined);
  const [company, setCompany] = useState(undefined);
  const [originalSkills, setOriginalSkills] = useState(undefined);
  const [originalIndustries, setOriginalIndustries] = useState(undefined);
  const [originalLocations, setOriginalLocations] = useState(undefined);
  const [showLoader, setLoader] = useState(false);
  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    if (store.company && store.session && permission.view) {
      fetchFullCompanyData(
        store.session,
        store.company.mention_tag,
        signal
      ).then((res) => {
        if (!res.err) {
          setCompanyData(res);
          setCompany(res);
        } else if (!signal.aborted) {
          notify("danger", res);
        }
      });
    }
    return () => controller.abort();
     
  }, [store.company, store.session, permission]);

  useEffect(() => {
    if (companyData) {
      setOriginalSkills(flattenSkills(companyData.competencies));
      setOriginalIndustries(flattenIndustries(companyData.categorizations));
      setOriginalLocations(flattenLocations(companyData.localizations));
    }
  }, [companyData]);

  //========================FORM SUBMISSION=============================

  const handleCompanySave = (e) => {
    e.preventDefault();
    setLoader(true);
    const nextCompany = { ...company };
    nextCompany.company_id = company.id;
    updateCompanyData(store.session, company.id, nextCompany).then((res) => {
      if (!res.err) {
        notify("info", "Company successfully updated");
        updateCompany(store, company.mention_tag);
        setCompanyData(res);
        setCompany({
          ...company,
          localizations_attributes: undefined,
          competencies_attributes: undefined,
          categorizations_attributes: undefined,
        });
        setLoader(false);
      } else {
        notify("danger", res);
      }
    });
    if (company.career_portal) {
      updateCareersSettings();
    }
  };

  //==================== CAREERS PORTAL FUNCTION =============================

  const updateCompanyPortal = () => {
    let newCompany = { ...company };
    newCompany.career_portal = !newCompany.career_portal;
    companyHelpers
      .toggleCareersPortal(company.id, store.session)
      .then((res) => {
        if (res.message === "Updated career portal property") {
          if (newCompany.career_portal !== res.career_portal) {
            newCompany.career_portal = !newCompany.career_portal;
          }
          updateCompany(store, company.mention_tag);
        } else {
          newCompany.career_portal = !newCompany.career_portal;
        }
      });
    setCompany(newCompany);
  };

  const updateCareersSettings = () => {
    let body = {
      color_theme: company.careers_portal.color_theme,
      career_portal_description: company.careers_portal.description,
    };
    // if (company.careers_portal.logo === null) {
    //   body.logo = company.careers_portal.logo;
    //   body.logo_data = company.careers_portal.logo_data;
    // } else
    if (
      company.careers_portal.logo === null ||
      !company.careers_portal.logo.startsWith("https")
    ) {
      body.logo = company.careers_portal.logo;
      body.logo_name = company.careers_portal.logo_name;
      body.logo_data = company.careers_portal.logo_data;
      body.logo_url = company.careers_portal.logo_url;
    }
    // if (company.careers_portal.header === null) {
    //   body.header = company.careers_portal.header;
    //   body.header_data = company.careers_portal.header_data;
    // } else
    if (
      company.careers_portal.header !== null &&
      !company.careers_portal.header.startsWith("https")
    ) {
      body.header = company.careers_portal.header;
      body.header_name = company.careers_portal.header_name;
      body.header_data = company.careers_portal.header_data;
      body.header_url = company.careers_portal.header_url;
    }
    companyHelpers.changeCareersPortalSettings(company.id, store.session, body);
  };

  const setDescription = (e) => {
    let newCompany = { ...company };
    newCompany.careers_portal.description = e.target.value;
    setCompany(newCompany);
  };

  const setLogo = (logo) => {
    let newCompany = { ...company };
    if (logo !== null) {
      let imageBase64 = "";
      let imageName = "";
      let fileReader = new FileReader();

      fileReader.addEventListener("load", (fileReaderEvent) => {
        imageName = logo.name;
        imageBase64 = fileReaderEvent.target.result;

        newCompany.careers_portal.logo = imageBase64;
        newCompany.careers_portal.logo_name = imageName;
        newCompany.careers_portal.logo_data = imageBase64;
        newCompany.careers_portal.logo_url = imageBase64;
        setCompany(newCompany);
      });
      fileReader.readAsDataURL(logo);
    } else {
      newCompany.careers_portal.logo = logo;
      newCompany.careers_portal.logo_data = logo;
      setCompany(newCompany);
    }
  };

  const setHeader = (header) => {
    let newCompany = { ...company };
    if (header !== null) {
      let imageBase64 = "";
      let imageName = "";
      let fileReader = new FileReader();

      fileReader.addEventListener("load", (fileReaderEvent) => {
        imageName = header.name;
        imageBase64 = fileReaderEvent.target.result;

        newCompany.careers_portal.header = imageBase64;
        newCompany.careers_portal.header_name = imageName;
        newCompany.careers_portal.header_data = imageBase64;
        newCompany.careers_portal.header_url = imageBase64;
        setCompany(newCompany);
      });
      fileReader.readAsDataURL(header);
    } else {
      newCompany.careers_portal.header_data = header;
      newCompany.careers_portal.header = header;
      setCompany(newCompany);
    }
  };

  const setColor = (color) => {
    let newCompany = { ...company };
    newCompany.careers_portal.color_theme = color;
    setCompany(newCompany);
  };
  return (
    <>
      {company && companyData ? (
        <div>
          <div className="profile-settings__container container block-box-wrapper">
            {showLoader ? <Spinner /> : ""}
            <div className="col-md-12">
              <PermissionChecker type="edit" valid={{ marketer: true }}>
                <ActivateCareersPortal
                  portalStatus={company.career_portal}
                  session={store.session}
                  onCallAction={updateCompanyPortal}
                />
              </PermissionChecker>
              {company.career_portal && (
                <CareersOptions
                  session={store.session}
                  company={company}
                  setCompany={setCompany}
                  companyData={companyData}
                  setDescription={setDescription}
                  setLogo={setLogo}
                  setHeader={setHeader}
                  setColor={setColor}
                  permission={permission}
                />
              )}
            </div>
            <div className="col-md-12">
              <hr />
            </div>
            <div className="col-md-12">
              <div className="row">
                <div className="col-sm-12">
                  <label className="form-label form-heading form-heading-small">
                    Locations you work in
                  </label>
                  <TagsComponent
                    type="locations"
                    originalTags={originalLocations}
                    returnTags={(localizations_attributes) =>
                      setCompany({
                        ...company,
                        localizations_attributes,
                      })
                    }
                  />
                  <div className="row">
                    <div className="col-sm-12">
                      <label className="form-label form-heading form-heading-small">
                        Tell us the industries you work in
                      </label>
                      <TagsComponent
                        type="industries"
                        originalTags={originalIndustries}
                        returnTags={(categorizations_attributes) =>
                          setCompany({
                            ...company,
                            categorizations_attributes,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <label className="form-label form-heading form-heading-small">
                        Tell us the skills you hire for
                      </label>
                      <TagsComponent
                        type="skills"
                        originalTags={originalSkills}
                        returnTags={(competencies_attributes) =>
                          setCompany({ ...company, competencies_attributes })
                        }
                      />
                    </div>
                    <hr />
                    <div className="col-md-12">
                      <div className="right">
                        <PermissionChecker
                          type="edit"
                          valid={{ marketer: true }}
                        >
                          <button
                            className="button button--default button--primary"
                            onClick={handleCompanySave}
                          >
                            {showLoader ? "Saving.." : "Save"}
                          </button>
                        </PermissionChecker>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default MarketingCareersPortalTab;
