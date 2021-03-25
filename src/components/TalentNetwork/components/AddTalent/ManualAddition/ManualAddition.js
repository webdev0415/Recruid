import React, { useState, useEffect } from "react";
import styled from "styled-components";

import Form from "./Form";
import Experiences from "./Experiences";

const FormContainer = styled.div`
  margin: 0px auto;
  max-width: 800px;
  padding-top: 50px;
  padding-bottom: 50px;
`;

const ManualAddition = ({
  closeModal,
  session,
  company,
  setParentsViewMode,
  setShouldUpdate,
}) => {
  const initialForm = {
    name: ``,
    email: ``,
    custom_source_id: ``,
    description: ``,
    consent: false,
    localizations_attributes: [],
    competencies_attributes: [],
    categorizations_attributes: [],
    rds_skills: [],
  };

  const initialExperience = {
    contractor_attributes: { name: `` },
    title: ``,
    contractor_type: `OuterEmployer`,
    description: ``,
    end_month: undefined,
    end_year: undefined,
    start_month: undefined,
    start_year: undefined,
    current_job: false,
  };
  const [formControl, setFormControl] = useState(initialForm);
  const [experienceAttributes, setExperienceAttributes] = useState([
    initialExperience,
  ]);
  const [viewMode, setViewMode] = useState(`talent-info`);
  // RDS -->
  const [talentRdsData, setTalentRdsData] = useState(null);
  const [importRdsData, setImportRdsData] = useState(undefined);
  const [rdsImportPreview, setRdsImportPreview] = useState(null);
  const [defaultLocations, setDefaultLocations] = useState([]);

  const handleRdsDataImport = (rdsData) => {
    setFormControl((form) => ({
      ...form,
      name: rdsData.name,
      // email: rdsData.email
    }));
    if (rdsData.locations)
      setDefaultLocations(
        rdsData.locations.map((loc) => {
          return { name: loc, value: loc };
        })
      );
    if (rdsData.experience) setExperienceAttributes([...rdsData.experience]);
  };

  useEffect(() => {
    if (talentRdsData) {
      handleRdsDataImport(talentRdsData);
    }
  }, [talentRdsData]);

  return (
    <FormContainer>
      {viewMode === `talent-info` && (
        <Form
          formControl={formControl}
          setFormControl={setFormControl}
          setViewMode={setViewMode}
          setParentsViewMode={setParentsViewMode}
          setTalentRdsData={setTalentRdsData}
          importRdsData={importRdsData}
          setImportRdsData={setImportRdsData}
          defaultLocations={defaultLocations}
          rdsImportPreview={rdsImportPreview}
          setRdsImportPreview={setRdsImportPreview}
        />
      )}
      {viewMode === `talent-experience` && (
        <Experiences
          experienceAttributes={experienceAttributes}
          setExperienceAttributes={setExperienceAttributes}
          initialExperience={initialExperience}
          companyId={company.id}
          session={session}
          formControl={formControl}
          closeModal={closeModal}
          setViewMode={setViewMode}
          setShouldUpdate={setShouldUpdate}
          talentRdsData={talentRdsData}
        />
      )}
    </FormContainer>
  );
};

export default ManualAddition;
