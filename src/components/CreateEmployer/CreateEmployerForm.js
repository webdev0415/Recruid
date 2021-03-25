import React, { useState, useRef } from "react";
import { ROUTES, REDIRECTS } from "routes";
// Components
import { Link } from "react-router-dom";
import { RevealPassword } from "sharedComponents/revealPassword/RevealPassword";
// Styles
import sharedStyles from "assets/stylesheets/scss/collated/outer.module.scss";
import formStyles from "assets/stylesheets/scss/collated/form.module.scss";
// Constants
import { getSession } from "contexts/globalContext/GlobalMethods";
import notify from "notifications";
import { handleResetUpdate } from "helpersV2/user";

const CreateEmployerForm = ({ data, store }) => {
  const [state, setState] = useState({
    password: ``,
  });
  const policyRef = useRef();
  const passwordRef = useRef();
  // Action to perform state change where new state = payload and state to change = target
  const handleInputChange = (prop, value) => {
    setState({ ...state, [prop]: value });
  };

  const validation = () => {
    // eslint-disable-next-line
    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const { password } = state;
    const { name, email, phoneNumber, employerName } = data;
    if (
      name === `` ||
      email === `` ||
      phoneNumber === `` ||
      employerName === `` ||
      password === ``
    ) {
      notify("danger", "All fields are requird!");
      return false;
    }
    if (!password.match(passwordPattern)) {
      notify(
        "danger",
        "Password must contain minimum 8 characters with numbers and letters presented!"
      );
      return false;
    } else if (!email.match(emailPattern)) {
      notify("danger", "Invalid email format!");
      return false;
    }
    if (!policyRef.current.checked) {
      notify("danger", "Please, get familiar with our privacy policy");
      return false;
    }
    return true;
  };

  const confirmEmployerRequest = async () => {
    handleResetUpdate({
      password: state.password,
      password_confirmation: state.password,
      email: data.email,
    }).then((res) => {
      if (res.success) {
        let loginData = {
          email: data.email,
          password: state.password,
        };
        getSession(store.dispatch, loginData);
      } else {
        return notify(
          "danger",
          "Failed to update your password. Please, try again later"
        );
      }
    });
  };
  const onSubmit = (event) => {
    event.preventDefault();
    if (validation()) {
      confirmEmployerRequest();
    } else return false;
  };
  return (
    <div style={{ maxWidth: "350px", margin: "0 auto" }}>
      <h3 className={sharedStyles.header}>Create an Employer</h3>
      <div className={sharedStyles.link}>
        Already have an account?{" "}
        <Link to={ROUTES.ProfessionalSignin.url()}>Sign in here.</Link>
      </div>
      <div>
        <label className={formStyles.label}>Name</label>
        <input
          className={formStyles.inputDisabled}
          value={data.name}
          placeholder="Jane Doe"
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
      </div>
      <div>
        <label className={formStyles.label}>Email</label>
        <input
          className={formStyles.inputDisabled}
          value={data.email}
          placeholder="janedoe@domain.com"
          onChange={(e) => handleInputChange("email", e.target.value)}
          readOnly={true}
        />
      </div>
      <div>
        <label className={formStyles.label}>Company Name</label>
        <input
          className={formStyles.inputDisabled}
          value={data.employerName}
          placeholder="Doe Agency"
          onChange={(e) => handleInputChange("employerName", e.target.value)}
          readOnly={true}
        />
      </div>
      <div>
        <label className={formStyles.label}>Password</label>
        <input
          className={formStyles.input}
          value={state.password}
          type="password"
          name="password"
          placeholder="•••••••••••••••••"
          ref={passwordRef}
          onChange={(e) => handleInputChange("password", e.target.value)}
        />
        <RevealPassword target={passwordRef} />
      </div>
      <div className={formStyles.terms}>
        <input type="checkbox" className="signup__checkbox" ref={policyRef} />
        <p>
          Creating an account means you have read and accept our{" "}
          <a
            href={REDIRECTS.Privacy.to}
            title="Privacy Policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href={REDIRECTS.Terms.to}
            title="Terms of Use"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Use
          </a>
          .
        </p>
      </div>
      <div>
        <button
          onClick={onSubmit}
          style={{ width: "100%" }}
          className="button button--default button--primary"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default CreateEmployerForm;
