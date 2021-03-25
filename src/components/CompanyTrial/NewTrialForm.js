import React, { useState } from "react";
import { REDIRECTS } from "routes";
import notify from "notifications";
import styled from "styled-components";
import { checkEmailExistence, createCompanyBackEnd } from "helpersV2/user";
import Spinner from "sharedComponents/Spinner";
import {
  FormGroup,
  OnboardingForm,
} from "containers/OnboardFlow/OnboardComponents";

const TrialForm = ({ handleLoginRequest, page, setPage }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    type: "",
    password: "",
  });

  const [revealPassword, setRevealPassword] = useState(false);
  const [pending, setPending] = useState(false);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submit = (event) => {
    event.preventDefault();
    setPending(true);

    if (process.env.NODE_ENV === "production") {
      createCompanyHubspot();
    }
    const params = {
      prof_phone_number: formData.phone,
      name: formData.company,
      prof_password: formData.password,
      prof_name: formData.name,
      prof_email: formData.email,
      type: formData.type,
    };

    createCompanyBackEnd(params)
      .then((res) => {
        if (!res.err) {
          handleLoginRequest({
            email: formData.email,
            password: formData.password,
          });
        } else {
          notify(
            "danger",
            res && res[0] ? res[0] : "Unable to create Company Profile"
          );
        }
      })
      .finally(() => setPending(false));
  };
  const createCompanyHubspot = () => {
    const portalId = "4323342";
    const formId = "d2275674-178b-49fc-8c5c-cfe808822a49";

    const url =
      "https://api.hsforms.com/submissions/v3/integration/submit/" +
      portalId +
      "/" +
      formId;

    const payload = {
      fields: [
        {
          name: "firstname",
          value: formData.name.split(" ")[0],
        },
        {
          name: "lastname",
          value: formData.name.split(" ")[1],
        },
        {
          name: "email",
          value: formData.email,
        },
        {
          name: "phone",
          value: formData.phone,
        },
        {
          name: "company",
          value: formData.company,
        },
      ],
    };

    const header = {
      "Content-Type": "application/json",
    };

    fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(payload),
    });
  };

  const togglePasswordReveal = (e) => {
    e.preventDefault();
    return setRevealPassword((bool) => !bool);
  };

  const setPageTwo = (e) => {
    e.preventDefault();

    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.password === ""
    ) {
      notify("danger", "Please complete all fields");
    } else if (formData.password.length < 8) {
      notify("danger", "Password must be at least 8 characters");
    } else if (formData.password.length > 128) {
      notify("danger", "Password is too long");
    } else {
      checkEmailExistence(formData.email).then((res) => {
        if (!res.err) {
          if (res.exists) {
            notify("danger", "A user with that email already exists");
          } else {
            setPage(1);
          }
        } else {
          notify("danger", res);
        }
      });
    }
  };

  return (
    <div>
      <OnboardingForm onSubmit={submit}>
        <input type="hidden" name="bot-field" />
        <input type="hidden" name="form-name" value="contact" />
        {page === 0 ? (
          <>
            <FormGroup>
              <label>Your Name</label>
              <input
                type="text"
                name="name"
                placeholder="Jane Doe"
                onChange={handleInputChange}
                value={formData.name}
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Email address</label>
              <input
                name="email"
                type="email"
                placeholder="janedoe@domain.com"
                onChange={handleInputChange}
                value={formData.email}
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Password</label>
              <input
                name="password"
                type={revealPassword ? "text" : "password"}
                minLength="8"
                maxLength="30"
                placeholder="•••••••••••••••••"
                onChange={handleInputChange}
                required
                value={formData.password}
              />
              <RevealPassword onClick={togglePasswordReveal} type="button">
                {revealPassword ? "Hide" : "Show"}
              </RevealPassword>
            </FormGroup>
            <FormGroup>
              <button
                className="button button--default button--blue-dark"
                onClick={setPageTwo}
              >
                Continue
              </button>
              <p>
                Already have an account? <a href="/signin">Log in</a>
              </p>
            </FormGroup>
          </>
        ) : page === 1 ? (
          <>
            <FormGroup>
              <label>Company Name</label>
              <input
                name="company"
                type="text"
                placeholder="Acme Inc"
                onChange={handleInputChange}
                required
                value={formData.company}
              />
            </FormGroup>
            <FormGroup>
              <label>Company Type</label>
              <select
                type="text"
                name="type"
                placeholder="Company Type"
                onChange={handleInputChange}
                value={formData.type}
                required
              >
                <option value="" disabled hidden>
                  Select a type
                </option>
                <option value="Employer">Employer</option>
                <option value="Agency">Recruitment Agency</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Phone Number</label>
              <input
                name="phone"
                type="tel"
                placeholder="+44 12345 678901"
                onChange={handleInputChange}
                value={formData.phone}
              />
            </FormGroup>
            <FormGroup className="terms">
              <input
                type="checkbox"
                className="signup__checkbox"
                value="1"
                required
              />
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
            </FormGroup>
            <FormGroup>
              <FlexButton
                className="button button--default button--blue-dark"
                type="submit"
                disabled={pending}
              >
                {pending && <Spinner size="sm" inline />}
                {pending ? (
                  <span>Creating Account...</span>
                ) : (
                  "Start free trial"
                )}
              </FlexButton>
              <p>
                Already have an account? <a href="/signin">Log in</a>
              </p>
            </FormGroup>
          </>
        ) : (
          ""
        )}
      </OnboardingForm>
    </div>
  );
};
export default TrialForm;

const RevealPassword = styled.button`
  bottom: 2px;
  font-size: 10px;
  position: absolute;
  right: 0;
  // text-decoration: underline;
`;

const FlexButton = styled.button.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center-around",
}))`
  span {
    margin-left: 5px;
  }
`;
