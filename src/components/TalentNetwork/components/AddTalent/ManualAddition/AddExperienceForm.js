import React from "react";

const AddExperience = ({
  experienceAttributes,
  setExperienceAttributes,
  index,
}) => {
  const handleComapnyNameChange = (event) => {
    const newExp = [...experienceAttributes];
    const value = event.target.value;
    newExp[index].contractor_attributes.name = value;
    setExperienceAttributes(newExp);
  };

  const handleOnChange = (event) => {
    const newExp = [...experienceAttributes];
    const propName = event.target.name;
    const value = event.target.value;
    newExp[index][propName] = value;
    setExperienceAttributes(newExp);
  };

  const handleCheckboxChange = (event) => {
    const newExp = [...experienceAttributes];
    const value = event.target.checked;
    newExp[index].current_job = value;
    setExperienceAttributes(newExp);
  };

  const deleteCurrentExperience = () => {
    const newExp = [...experienceAttributes];
    newExp.splice(index, 1);
    setExperienceAttributes(newExp);
  };

  return (
    <div
      style={{
        borderBottom: "1px solid #eee",
        marginBottom: "20px",
        paddingBottom: "15px",
      }}
    >
      <div className="row">
        <div className="col-sm-6">
          <label className="form-label form-heading">Company Name</label>
          <input
            className="form-control"
            type="text"
            name="name"
            value={experienceAttributes[index].contractor_attributes.name}
            placeholder="Company Name"
            onChange={handleComapnyNameChange}
            required
          />
        </div>
        <div className="col-sm-6">
          <label className="form-label form-heading">Title</label>
          <input
            className="form-control"
            type="text"
            name="title"
            value={experienceAttributes[index].title}
            onChange={handleOnChange}
            placeholder="Title"
            required
          />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-4">
          <label
            htmlFor={`currently-work-${index}`}
            className="form-input experience__item--checkbox"
          >
            <input
              className="form-checkbox"
              id={`currently-work-${index}`}
              onChange={handleCheckboxChange}
              name="current_job"
              checked={experienceAttributes[index].current_job}
              type="checkbox"
            />
            They currently work here
          </label>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <label className="form-label form-heading">
            When did the candidates start this role?
          </label>
          <div className="row">
            <div className="col-sm-6">
              <select
                defaultValue={experienceAttributes[index].start_month}
                name="start_month"
                onChange={handleOnChange}
                className="form-control"
              >
                <option value="" disabled>
                  Month
                </option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div className="col-sm-6">
              <input
                className="form-control"
                type="number"
                name="start_year"
                value={experienceAttributes[index].start_year}
                placeholder="Year"
                onChange={handleOnChange}
                required
              />
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          {!experienceAttributes[index].current_job ? (
            <>
              <label className="form-label form-heading">
                When did the candidate leave this role?
              </label>

              <div className="row">
                <div className="col-sm-6">
                  <select
                    className="form-control"
                    defaultValue={experienceAttributes[index].end_month}
                    name="end_month"
                    onChange={handleOnChange}
                  >
                    <option value="" disabled>
                      Month
                    </option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
                <div className="col-sm-6">
                  <input
                    className="form-control"
                    type="number"
                    name="end_year"
                    value={experienceAttributes[index].end_year}
                    placeholder="Year"
                    onChange={handleOnChange}
                    required
                  />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <textarea
        type="text"
        className="form-control"
        name="description"
        placeholder="Description"
        value={experienceAttributes[index].description}
        onChange={handleOnChange}
        cols={90}
        rows={5}
      />
      <button
        className="experience__delete"
        onClick={deleteCurrentExperience}
        style={{ color: "red" }}
      >
        Delete
      </button>
    </div>
  );
};

export default AddExperience;
