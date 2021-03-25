import React from "react";

function companyLink(contractor) {
  if (contractor) {
    if (contractor.mentionTag) {
      return (
        <a href={"/company/" + contractor.mentionTag}>{contractor.name}</a>
      );
    } else if (contractor.mention_tag) {
      return (
        <a href={"/company/" + contractor.mention_tag}>{contractor.name}</a>
      );
    } else {
      return contractor.name;
    }
  }
}

export function renderTitle(professional) {
  if (
    professional === undefined ||
    Object.keys(professional).length === 0 ||
    professional.experiences === undefined
  ) {
    return "";
  }

  let currentJob = currentExperience(professional.experiences);

  if (currentJob) {
    let contractor = currentJob.contractor;

    return (
      <span>
        {currentJob.title} at {companyLink(contractor)}
      </span>
    );
  } else if (professional.title) {
    return <span>{professional.title}</span>;
  } else {
    return <span></span>;
  }
}

export function currentExperience(experiences) {
  if (experiences === undefined || experiences.length === 0) {
    return null;
  }

  return experiences.find((experience) => {
    return experience.endYear === null;
  });
}

export function createTotalCompanyList(ownedCompanies, professional) {
  if (ownedCompanies.length > 0) {
    if (Object.keys(professional).length > 0) {
      let expComps = [];
      professional.experiences.forEach((exp) => {
        if (exp.contractor && exp.contractor.role === "recruiter") {
          expComps.push(exp.contractor);
        }
      });
      let totalComps = ownedCompanies.concat(expComps);
      this.setState({ totalCompanies: totalComps });
    }
  } else {
    if (Object.keys(professional).length > 0) {
      let expComps = [];
      professional.experiences.forEach((exp) => {
        if (exp.contractor && exp.contractor.role === "recruiter") {
          expComps.push(exp.contractor);
        }
      });
      let totalComps = expComps;
      this.setState({ totalCompanies: totalComps });
    }
  }
}
