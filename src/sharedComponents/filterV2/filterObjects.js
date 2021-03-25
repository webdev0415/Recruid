import React from "react";
import {
  // boolean,
  calendar,
  coin,
  distance,
  email,
  experience,
  id,
  industry,
  job,
  lastContacted,
  location,
  notes,
  phone,
  sex,
  skill,
  stageReached,
  status,
  turnover,
  userCandidate,
} from "sharedComponents/filterV2/icons/index";

import {
  availabilityOptions,
  genderOptions,
  statusOptions,
  typeOptions,
  taskTypes,
  taskPriority,
  taskSource,
  workplaceOptions,
  hireOptions,
  workingHoursOptions,
  advertisedOptions,
  clientStatusOptions,
} from "sharedComponents/filterV2/staticOptions";

const PROTO = {
  job_title: {
    filter_title: "Job title",
    icon: job,
    filter_type: "text",
    keyword: "contains",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  name: {
    filter_title: "Name",
    icon: id,
    filter_type: "text",
    keyword: "is",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  surname: {
    filter_title: "Surname",
    icon: id,
    filter_type: "text",
    keyword: "contains",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  phone: {
    filter_title: "Mobile number",
    icon: phone,
    filter_type: "text",
    keyword: "contains",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  email_address: {
    filter_title: "Email address",
    icon: email,
    filter_type: "text",
    keyword: "contains",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  company_last_worked_for: {
    filter_title: "Company last worked for",
    icon: job,
    filter_type: "text",
    keyword: "is",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  //
  industry: {
    filter_title: "Industry",
    icon: industry,
    filter_type: "attribute",
    keyword: "is",
    master_type: "industries",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  location: {
    filter_title: "Location",
    icon: location,
    filter_type: "location",
    keyword: "is",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  skill: {
    filter_title: "Skill",
    icon: skill,
    filter_type: "attribute",
    keyword: "is",
    master_type: "skills",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  created: {
    filter_title: "Date added",
    icon: calendar,
    filter_type: "date",
    keyword: "is",
    text_constructor: function (modifier, textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${modifier} ${textValue}`}
        </>
      );
    },
  },
  last_contacted: {
    filter_title: "Last contacted",
    icon: lastContacted,
    filter_type: "date",
    keyword: "is",
    text_constructor: function (modifier, textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${modifier} ${textValue}`}
        </>
      );
    },
  },
  last_note_created: {
    filter_title: "Last note created",
    icon: notes,
    filter_type: "date",
    keyword: "is",
    text_constructor: function (modifier, textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${modifier} ${textValue}`}
        </>
      );
    },
  },
  last_stage_change: {
    filter_title: "Last stage change",
    icon: stageReached,
    filter_type: "date",
    keyword: "is",
    text_constructor: function (modifier, textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${modifier} ${textValue}`}
        </>
      );
    },
  },
  age: {
    filter_title: "Age",
    icon: id,
    filter_type: "numeric",
    keyword: "is",
    text_constructor: function (modifier, textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${modifier} ${textValue}`}
        </>
      );
    },
  },
  day_rate: {
    filter_title: "Day rate",
    icon: coin,
    filter_type: "numeric",
    keyword: "is",
    text_constructor: function (modifier, textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${modifier} ${textValue}`}
        </>
      );
    },
  },
  salary: {
    filter_title: "Salary",
    icon: coin,
    filter_type: "numeric",
    keyword: "is",
    text_constructor: function (modifier, textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${modifier} ${textValue}`}
        </>
      );
    },
  },
  years_experience: {
    filter_title: "Years experience",
    icon: experience,
    filter_type: "numeric",
    keyword: "are",
    text_constructor: function (modifier, textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${modifier} ${textValue}`}
        </>
      );
    },
  },
  company_headcount: {
    filter_title: "Company headcount",
    icon: userCandidate,
    filter_type: "numeric",
    keyword: "is",
    text_constructor: function (modifier, textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${modifier} ${textValue}`}
        </>
      );
    },
  },
  by_spend: {
    filter_title: "By spend",
    icon: coin,
    filter_type: "numeric",
    keyword: "is",
    text_constructor: function (modifier, textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${modifier} ${textValue}`}
        </>
      );
    },
  },
  turnover: {
    filter_title: "Turnover",
    icon: turnover,
    filter_type: "numeric",
    keyword: "is",
    text_constructor: function (modifier, textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${modifier} ${textValue}`}
        </>
      );
    },
  },
  deal_value: {
    filter_title: "Deal value",
    icon: coin,
    filter_type: "numeric",
    keyword: "is",
    text_constructor: function (modifier, textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${modifier} ${textValue}`}
        </>
      );
    },
  },
  //
  availability: {
    filter_title: "Availability",
    icon: calendar,
    filter_type: "simple_select",
    keyword: "is",
    static_options: availabilityOptions,
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  by_stage: {
    filter_title: "By stage",
    icon: stageReached,
    filter_type: "by_stage",
    keyword: "is",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  by_status: {
    filter_title: "By job status",
    icon: status,
    filter_type: "by_status",
    keyword: "is",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  gender: {
    filter_title: "Gender",
    icon: sex,
    filter_type: "simple_select",
    keyword: "is",
    static_options: genderOptions,
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  job_type: {
    filter_title: "Job type",
    icon: job,
    filter_type: "simple_select",
    keyword: "is",
    static_options: typeOptions,
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  workplace_preference: {
    filter_title: "Workplace preference",
    icon: location,
    filter_type: "simple_select",
    filter_prop: "workplace_preference",
    keyword: "is",
    static_options: workplaceOptions,
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  job_status: {
    filter_title: "Job status",
    icon: status,
    filter_type: "simple_select",
    static_options: statusOptions,
    keyword: "is",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  team_member: {
    filter_title: "Team member",
    icon: userCandidate,
    filter_type: "team_member",
    keyword: "is",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  active_on_deals: {
    filter_title: "Active on deals",
    icon: coin,
    filter_type: "active_on_deals",
    keyword: "",
    single_value: true,
    prop_value: true,
    text_constructor: function () {
      return (
        <>
          <span>Is {this.filter_title}</span>
        </>
      );
    },
  },
  activity: {
    filter_title: "Activity",
    icon: status,
    filter_type: "activity",
    keyword: "",
    single_value: true,
    prop_value: true,
    text_constructor: function () {
      return (
        <>
          <span>Has {this.filter_title}</span>
        </>
      );
    },
  },
  travel_willingness: {
    filter_title: "Travel willingness",
    icon: location,
    keyword: "is",
    filter_type: "boolean",
    text_constructor: function (bool) {
      return (
        <>
          <span>Is {bool === false ? "not" : ""} Willing to travel</span>
        </>
      );
    },
  },
  immediate_start: {
    filter_title: "Immediately available",
    icon: calendar,
    keyword: "is",
    filter_type: "boolean",
    text_constructor: function (bool) {
      return (
        <>
          <span>
            Is {bool === false ? "not" : ""} {this.filter_title}
          </span>
        </>
      );
    },
  },
  contracted_until: {
    filter_title: "Contracted until",
    icon: calendar,
    keyword: "until",
    filter_type: "until",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${textValue}`}
        </>
      );
    },
  },
  notice_periods: {
    filter_title: "Notice period",
    icon: calendar,
    filter_type: "notice",
    keyword: "is",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  qualifications: {
    filter_title: "Qualifications",
    icon: experience,
    filter_type: "qualification",
    keyword: "are",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  task_type: {
    filter_title: "Type",
    icon: calendar,
    filter_type: "simple_select",
    keyword: "is",
    static_options: taskTypes,
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  task_priority: {
    filter_title: "Priority",
    icon: calendar,
    filter_type: "simple_select",
    keyword: "is",
    static_options: taskPriority,
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  company: {
    filter_title: "Company",
    icon: calendar,
    filter_type: "company_select",
    keyword: "is",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  source: {
    filter_title: "Source",
    icon: calendar,
    filter_type: "simple_select",
    keyword: "is",
    static_options: taskSource,
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  distance_from: {
    filter_title: "Distance from",
    icon: distance,
    filter_type: "distance_from",
    keyword: "is within",
    text_constructor: function (distance, location) {
      return (
        <>
          <span>Is within</span>
          {` ${distance || 0} miles of ${location}`}
        </>
      );
    },
  },
  rating: {
    filter_title: "Rating",
    icon: skill,
    filter_type: "rating",
    keyword: "is",
    text_constructor: function (arr) {
      let sorted = arr.sort().join(", ");
      let lastComa = sorted.lastIndexOf(",");
      if (lastComa !== -1) {
        sorted =
          sorted.substring(0, lastComa) +
          " and" +
          sorted.substring(lastComa + 1);
      }
      return (
        <>
          <span>Rating is</span>
          {` ${arr.length > 0 ? sorted : ""} ${arr.length > 0 ? "stars" : ""}`}
        </>
      );
    },
  },
  blacklisted: {
    filter_title: "Blacklisted",
    icon: userCandidate,
    keyword: "is blacklisted",
    filter_type: "boolean",
    text_constructor: function (bool) {
      return (
        <>
          <span>Is {bool === false ? "not" : ""} Blacklisted</span>
        </>
      );
    },
  },
  commute: {
    filter_title: "Commute",
    icon: distance,
    filter_type: "commute",
    filter_prop: "commute_time",
    keyword: "is",
    text_constructor: function (modifier, time, location, transport) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${modifier} ${
            time !== undefined ? `${time} minutes` : ""
          } ${location ? `from ${location}` : ""} ${
            transport ? `by ${transport}` : ""
          }`}
        </>
      );
    },
  },
  last_email_response: {
    filter_title: "Last Email response",
    icon: email,
    filter_type: "date",
    keyword: "is",
    text_constructor: function (modifier, textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${modifier} ${textValue}`}
        </>
      );
    },
  },
  sizzle_factor: {
    filter_title: "Sizzle Factor",
    icon: skill,
    filter_type: "sizzle",
    filter_prop: "sizzle_score",
    keyword: "is",
    text_constructor: function (arr) {
      let sorted = arr.sort().join(", ");
      let lastComa = sorted.lastIndexOf(",");
      if (lastComa !== -1) {
        sorted =
          sorted.substring(0, lastComa) +
          " and" +
          sorted.substring(lastComa + 1);
      }
      return (
        <>
          <span>Sizzle Factor is</span>
          {` ${arr.length > 0 ? sorted : ""} ${arr.length > 0 ? "stars" : ""}`}
        </>
      );
    },
  },
  on_hold: {
    filter_title: "On Hold",
    filter_prop: "on_hold",
    icon: calendar,
    keyword: "is on hold",
    filter_type: "boolean",
    text_constructor: function (bool) {
      return (
        <>
          <span>Is {bool === false ? "not" : ""} on hold</span>
        </>
      );
    },
  },
  advertised: {
    filter_title: "Advertised",
    icon: coin,
    filter_type: "simple_select",
    keyword: "is",
    static_options: advertisedOptions,
    text_constructor: function (textValue) {
      return (
        <>
          <span>Advertised status</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  budgeted: {
    filter_title: "Budgeted",
    icon: coin,
    keyword: "is",
    filter_type: "boolean",
    text_constructor: function (bool) {
      return (
        <>
          <span>Is {bool === false ? "not" : ""} Budgeted</span>
        </>
      );
    },
  },
  business_area: {
    filter_title: "Business Area",
    icon: skill,
    filter_type: "attribute",
    keyword: "is",
    master_type: "business_areas",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  department: {
    filter_title: "Department",
    icon: skill,
    filter_type: "attribute",
    keyword: "is",
    master_type: "departments",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  hire_type: {
    filter_title: "Hire Type",
    icon: coin,
    filter_type: "simple_select",
    keyword: "is",
    static_options: hireOptions,

    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  po_reference: {
    filter_title: "PO. Reference",
    icon: id,
    filter_type: "text",
    keyword: "is",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  working_hours: {
    filter_title: "Working hours",
    icon: coin,
    filter_type: "simple_select",
    keyword: "are",
    static_options: workingHoursOptions,
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
  client_status: {
    filter_title: "Client status",
    icon: status,
    filter_type: "simple_select",
    static_options: clientStatusOptions,
    keyword: "is",
    text_constructor: function (textValue) {
      return (
        <>
          <span>{this.filter_title}</span>
          {` ${this.keyword} ${textValue}`}
        </>
      );
    },
  },
};

// active_on_job_in_a_date_range = {
//   filter_title: "Active on job in a date rate",
//   icon: job,
//   filter_type: "active_on_job_in_a_date_range",
// , keyword: "is"},

// on_high_priority_notes = {
//   filter_title: "On high priority notes",
//   icon: notes,
//   filter_type: "on_high_priority_notes",
// , keyword: "is"},
// qualifications = { filter_title: "Qualifications", icon: experience, filter_type: "qualifications" , keyword: "is"},
// stages_reached_jobs = {
//   filter_title: "Stages reached jobs",
//   icon: stageReached,
//   filter_type: "stages_reached_jobs",
// , keyword: "is"},
// seniority = { filter_title: "Seniority", icon: experience, filter_type: "seniority" , keyword: "is"},

export const CANDIDATE_FILTERS = () => [
  {
    ...PROTO.team_member,
    filter_prop: "owner",
    filter_title: "Added by",
  },
  { ...PROTO.age, filter_prop: "age" },
  { ...PROTO.availability, filter_prop: "tn_status" },
  { ...PROTO.blacklisted, filter_prop: "blacklisted" },
  { ...PROTO.by_stage, filter_prop: "stage" },
  { ...PROTO.by_status, filter_prop: "status" },
  {
    ...PROTO.team_member,
    filter_prop: "owner_id",
    filter_title: "Candidate Owner",
  },
  { ...PROTO.company_last_worked_for, filter_prop: "company_last_worked_for" },
  { ...PROTO.commute },
  { ...PROTO.contracted_until, filter_prop: "contracted_until" },
  { ...PROTO.created, filter_prop: "created_at" },
  { ...PROTO.day_rate, filter_prop: "day_rate" },
  { ...PROTO.distance_from, filter_prop: "location_within" },
  { ...PROTO.email_address, filter_prop: "tn_email" },
  { ...PROTO.gender, filter_prop: "sex" },
  { ...PROTO.immediate_start, filter_prop: "immediate_start" },
  { ...PROTO.industry, filter_prop: "category_id" },
  { ...PROTO.job_title, filter_prop: "job_title" },
  { ...PROTO.last_contacted, filter_prop: "last_contacted" },
  { ...PROTO.last_email_response, filter_prop: "last_responded" },
  { ...PROTO.last_note_created, filter_prop: "last_note_created" },
  { ...PROTO.last_stage_change, filter_prop: "last_stage_change" },
  { ...PROTO.location, filter_prop: "locations" },
  { ...PROTO.name, filter_prop: "name" },
  { ...PROTO.rating, filter_prop: "rating" },
  { ...PROTO.phone, filter_prop: "phone" },
  {
    ...PROTO.salary,
    filter_prop: "salary_expectation",
    filter_title: "Salary expectations",
    keyword: "are",
  },
  { ...PROTO.skill, filter_prop: "skill_id" },
  { ...PROTO.surname, filter_prop: "surname" },
  { ...PROTO.travel_willingness, filter_prop: "travel_willingness" },
  {
    ...PROTO.job_type,
    filter_prop: "work_interest",
    filter_title: "Work interested in",
  },
  {
    ...PROTO.workplace_preference,
  },
  { ...PROTO.years_experience, filter_prop: "years_experience" },
  // // - Qualifications:
  // // - Stages reached jobs:

  // // - Active on job in a date rate:
  // { ...PROTO.qualifications, filter_prop: "qualifications" }
];

export const JOB_FILTERS = (store) => [
  { ...PROTO.job_title, filter_prop: "title" },
  { ...PROTO.salary, filter_prop: "salary" },
  { ...PROTO.location, filter_prop: "locations" },
  { ...PROTO.job_type, filter_prop: "job_type" },
  { ...PROTO.job_status, filter_prop: "job_status" },
  { ...PROTO.by_stage, filter_prop: "job_stages", filter_title: "Job stage" },
  { ...PROTO.skill, filter_prop: "skill_id" },
  { ...PROTO.industry, filter_prop: "category_id" },
  { ...PROTO.on_hold },
  { ...PROTO.sizzle_factor },
  {
    ...PROTO.team_member,
    filter_prop: "owner",
    filter_title: "Added by",
  },
  ...(store.job_extra_fields && store.job_extra_fields?.advertised_visible
    ? [{ ...PROTO.advertised, filter_prop: "advertised" }]
    : []),
  ...(store.job_extra_fields && store.job_extra_fields?.budgeted_visible
    ? [{ ...PROTO.budgeted, filter_prop: "budgeted" }]
    : []),
  ...(store.job_extra_fields && store.job_extra_fields?.business_area_visible
    ? [{ ...PROTO.business_area, filter_prop: "business_area_id" }]
    : []),
  ...(store.job_extra_fields && store.job_extra_fields?.department_visible
    ? [{ ...PROTO.department, filter_prop: "department_id" }]
    : []),
  ...(store.job_extra_fields && store.job_extra_fields?.po_reference_visible
    ? [{ ...PROTO.po_reference, filter_prop: "po_reference" }]
    : []),
  ...(store.job_extra_fields && store.job_extra_fields?.hire_type_visible
    ? [{ ...PROTO.hire_type, filter_prop: "hire_type" }]
    : []),
  ...(store.job_extra_fields && store.job_extra_fields?.working_hours_visible
    ? [{ ...PROTO.working_hours, filter_prop: "working_hours" }]
    : []),
];

export const CONTACT_FILTERS = () => [
  { ...PROTO.active_on_deals, filter_prop: "active_on_deals" },
  { ...PROTO.company_headcount, filter_prop: "size" },
  {
    ...PROTO.team_member,
    filter_prop: "owner",
    filter_title: "Contact owner",
  },
  { ...PROTO.created, filter_title: "Date added", filter_prop: "created_at" },

  { ...PROTO.industry, filter_prop: "category_id" },
  { ...PROTO.job_title, filter_prop: "title" },
  { ...PROTO.last_email_response, filter_prop: "last_responded" },
  { ...PROTO.last_note_created, filter_prop: "last_note_created" },
  { ...PROTO.location, filter_prop: "locations" },
  { ...PROTO.name, filter_prop: "name" },
  {
    ...PROTO.skill,
    filter_prop: "skill_id",
    filter_title: "Skills hiring for",
  },
  // - Seniority:
  // - On high priority notes:
];

export const DEAL_FILTERS = () => [
  { ...PROTO.activity, filter_prop: "activity" },
  { ...PROTO.created, filter_prop: "created_at" },
  {
    ...PROTO.team_member,
    filter_prop: "owner",
    filter_title: "Deal owner",
  },
  { ...PROTO.deal_value, filter_prop: "value" },
  { ...PROTO.last_note_created, filter_prop: "last_note_created" },
  { ...PROTO.name, filter_prop: "name" },
];

export const CLIENT_FILTERS = () => [
  { ...PROTO.active_on_deals, filter_prop: "active_on_deals" },
  {
    ...PROTO.team_member,
    filter_prop: "owner",
    filter_title: "Company owner",
  },
  { ...PROTO.created, filter_prop: "created_at" },
  {
    ...PROTO.client_status,
    filter_prop: "status",
    filter_title: "Client Status",
  },
  {
    ...PROTO.company_headcount,
    filter_prop: "size",
    filter_title: "Headcount",
  },
  { ...PROTO.industry, filter_prop: "category_id" },
  { ...PROTO.last_note_created, filter_prop: "last_note_created" },
  { ...PROTO.location, filter_prop: "locations" },
  { ...PROTO.name, filter_prop: "name" },
  {
    ...PROTO.skill,
    filter_prop: "skill_id",
    filter_title: "Skills hiring for",
  },
  {
    ...PROTO.turnover,
    filter_prop: "annual_revenue",
  },
  // - On high priority notes:
  // { ...PROTO.by_spend, filter_prop: "total_spent_by_agency" },
];

const TASK_FILTER = () => [
  { ...PROTO.company, filter_prop: "company_id" },
  { ...PROTO.task_priority, filter_prop: "priority" },
  { ...PROTO.source, filter_prop: "source" },
  // {
  //   ...PROTO.team_member,
  //   filter_prop: "team_member_id",
  //   filter_title: "Team member",
  // },
  { ...PROTO.task_type, filter_prop: "task_type" },
];

const TASK_COMPANY_FILTER = () => [
  { ...PROTO.task_priority, filter_prop: "priority" },
  { ...PROTO.source, filter_prop: "source" },
  {
    ...PROTO.team_member,
    filter_prop: "team_member_id",
    filter_title: "Team member",
  },
  { ...PROTO.task_type, filter_prop: "task_type" },
];

export const SOURCE_FILTERS = {
  candidate: CANDIDATE_FILTERS,
  deal: DEAL_FILTERS,
  contact: CONTACT_FILTERS,
  client: CLIENT_FILTERS,
  job: JOB_FILTERS,
  task: TASK_FILTER,
  companyTask: TASK_COMPANY_FILTER,
};
