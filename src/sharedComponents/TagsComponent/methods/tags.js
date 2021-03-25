export const generateSkillCompetencies = (tags, originalTags, companyId) => {
  //
  let competencies_attributes = [];
  tags.map((skill) => {
    //if skill is from list of skills
    if (skill.id) {
      let skillMatch = -1;
      if (originalTags) {
        originalTags.map((og, index) =>
          og.id === skill.id ? (skillMatch = index) : null
        );
      }

      // if skill was original and is being destroyed
      if (skill._destroy && skillMatch >= 0) {
        competencies_attributes.push({
          id: originalTags[skillMatch].competency_id,
          rating: 5,
          skill_id: skill.id,
          skill_attributes: {
            name: skill.name,
            id: skill.id,
            company_id: companyId,
          },
          _destroy: true,
        });
        //if the skill is a new one
      } else if (!skill._destroy && skillMatch < 0) {
        competencies_attributes.push({
          rating: 5,
          skill_id: skill.id,
          skill_attributes: {
            name: skill.name,
            id: skill.id,
            company_id: companyId,
          },
        });
      }
      //if skill is a custom written one and has no destroy property
    } else if (!skill._destroy) {
      competencies_attributes.push({
        skill_attributes: { name: skill.name, company_id: companyId },
      });
    }
    return null;
  });
  return competencies_attributes;
};

export const generateIndustryCategories = (tags, originalTags, companyId) => {
  let categorizations_attributes = [];
  tags.map((industry) => {
    if (industry.id) {
      let industryMatch = -1;
      if (originalTags) {
        originalTags.map((og, index) =>
          og.id === industry.id ? (industryMatch = index) : null
        );
      }

      //if original tags industry is being destroyed
      if (industry._destroy && industryMatch >= 0) {
        categorizations_attributes.push({
          id: originalTags[industryMatch].categorization_id,
          category_id: industry.id,
          category_attributes: {
            name: industry.name,
            id: industry.id,
            company_id: companyId,
          },
          _destroy: true,
        });
        //if industry is being added from the list dropdown
      } else if (!industry._destroy && industryMatch < 0) {
        categorizations_attributes.push({
          category_id: industry.id,
          category_attributes: {
            name: industry.name,
            id: industry.id,
            company_id: companyId,
          },
        });
      }
      //if new industry and no destroy property
    } else if (!industry._destroy) {
      categorizations_attributes.push({
        category_attributes: { name: industry.name, company_id: companyId },
      });
    }
    return null;
  });
  return categorizations_attributes;
};

export const generateLocalizations = (tags, originalTags, companyId) => {
  let localizations_attributes = [];
  tags.map((location) => {
    if (location.id) {
      let locationMatch = -1;
      if (originalTags) {
        originalTags.map((og, index) =>
          og.id === location.id ? (locationMatch = index) : null
        );
      }

      //if original tags location is being destroyed
      if (location._destroy && locationMatch >= 0) {
        localizations_attributes.push({
          id: originalTags[locationMatch].localization_id,
          location_id: location.id,
          location_attributes: {
            name: location.name,
            id: location.id,
            company_id: companyId,
          },
          _destroy: true,
        });
        //if location is being added from the list dropdown
      } else if (!location._destroy && locationMatch < 0) {
        localizations_attributes.push({
          location_id: location.id,
          location_attributes: {
            name: location.name,
            id: location.id,
            company_id: companyId,
          },
        });
      }
      //if new industry and no destroy property
    } else if (!location._destroy) {
      localizations_attributes.push({
        location_attributes: { name: location.name, company_id: companyId },
      });
    }
    return null;
  });
  return localizations_attributes;
};

export const generateBusinessAreaCategories = (
  tags,
  originalTags,
  companyId
) => {
  //
  let areas_attributes = [];
  tags.map((area) => {
    //if area is from list of areas
    if (area.id) {
      let areaMatch = -1;
      if (originalTags) {
        originalTags.map((og, index) =>
          og.id === area.id ? (areaMatch = index) : null
        );
      }

      // if area was original and is being destroyed
      if (area._destroy && areaMatch >= 0) {
        areas_attributes.push({
          id: originalTags[areaMatch].area_id,
          rating: 5,
          business_area_id: area.id,
          business_area_attributes: {
            name: area.name,
            id: area.id,
            company_id: companyId,
          },
          _destroy: true,
        });
        //if the area is a new one
      } else if (!area._destroy && areaMatch < 0) {
        areas_attributes.push({
          rating: 5,
          business_area_id: area.id,
          business_area_attributes: {
            name: area.name,
            id: area.id,
            company_id: companyId,
          },
        });
      }
      //if area is a custom written one and has no destroy property
    } else if (!area._destroy) {
      areas_attributes.push({
        business_area_attributes: { name: area.name, company_id: companyId },
      });
    }
    return null;
  });
  return areas_attributes;
};

export const generateDepartmentCategories = (tags, originalTags, companyId) => {
  //
  let sectors_attributes = [];
  tags.map((department) => {
    //if department is from list of departments
    if (department.id) {
      let departmentMatch = -1;
      if (originalTags) {
        originalTags.map((og, index) =>
          og.id === department.id ? (departmentMatch = index) : null
        );
      }

      // if department was original and is being destroyed
      if (department._destroy && departmentMatch >= 0) {
        sectors_attributes.push({
          id: originalTags[departmentMatch].department_id,
          rating: 5,
          department_id: department.id,
          department_attributes: {
            name: department.name,
            id: department.id,
            company_id: companyId,
          },
          _destroy: true,
        });
        //if the skill is a new one
      } else if (!department._destroy && departmentMatch < 0) {
        sectors_attributes.push({
          rating: 5,
          department_id: department.id,
          department_attributes: {
            name: department.name,
            id: department.id,
            company_id: companyId,
          },
        });
      }
      //if department is a custom written one and has no destroy property
    } else if (!department._destroy) {
      sectors_attributes.push({
        department_attributes: { name: department.name, company_id: companyId },
      });
    }
    return null;
  });
  return sectors_attributes;
};

export const flattenIndustries = (categorizations) =>
  categorizations.map((industry) => {
    return {
      id: industry.category.id,
      name: industry.category.name,
      categorization_id: industry.id,
    };
  });
export const flattenLocations = (locations) =>
  locations.map((location) => {
    return {
      id: location.location.id,
      name: location.location.name,
      localization_id: location.id,
    };
  });

export const flattenSkills = (competencies) =>
  competencies.map((skill) => {
    return {
      id: skill.skill.id,
      name: skill.skill.name,
      competency_id: skill.id,
    };
  });
export const flattenDepartment = (departments) =>
  departments.map((dep) => {
    return {
      id: dep.department.id,
      name: dep.department.name,
      department_id: dep.id,
    };
  });
export const flattenBusinessArea = (businessAreas) =>
  businessAreas.map((area) => {
    return {
      id: area.business_area.id,
      name: area.business_area.name,
      area_id: area.id,
    };
  });
