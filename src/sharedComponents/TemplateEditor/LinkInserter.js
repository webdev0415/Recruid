import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { COLORS } from "constants/style";
import notify from "notifications";
import validUrl from "valid-url";
import { StylingButton } from "sharedComponents/TemplateEditor/components";
import useDropdown from "hooks/useDropdown";

const LinkInserter = ({ createLink }) => {
  const { node, showSelect, setShowSelect } = useDropdown();

  return (
    <Wrapper ref={node} className="leo-flex-center-center leo-relative">
      <SelectionButton
        onClick={() => setShowSelect(!showSelect)}
        className="leo-flex-center-end"
      >
        <div className="leo-flex-center-center leo-pointer">
          <i className="fas fa-link"></i>
        </div>
      </SelectionButton>
      {showSelect && (
        <LinkMenu setShowSelect={setShowSelect} createLink={createLink} />
      )}
    </Wrapper>
  );
};

export default LinkInserter;

const LinkMenu = ({ setShowSelect, createLink }) => {
  const [link, setLink] = useState({
    text: "",
    href: "",
  });
  const [linkType, setLinkType] = useState("web");
  const [web, setWeb] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const addLink = () => {
    if (link.text.length === 0) {
      return notify("danger", "The link text cannot be empty");
    } else if (link.href.length === 0) {
      return notify("danger", "The link url cannot be empty");
    } else if (linkType === "web" && !validUrl.isUri(link.href)) {
      return notify("danger", "The link ulr is not valid");
    } else {
      createLink(link);
      setShowSelect(false);
    }
  };

  useEffect(() => {
    if (web && web.length > 0) {
      setLink({ ...link, href: web });
    } else if (email && email.length > 0) {
      setLink({ ...link, href: `mailto:${email}` });
    } else if (phone && phone.length > 0) {
      setLink({ ...link, href: `tel:${phone}` });
    }
  }, [web, email, phone]);

  useEffect(() => {
    setWeb("");
    setEmail("");
    setPhone("");
  }, [linkType]);
  return (
    <Menu>
      <h3>Add Hyperlink</h3>
      <div>
        <label className="form-label form-heading form-heading-small">
          Link Text
        </label>
        <input
          className="form-control"
          type="text"
          value={link.text}
          onChange={(e) => setLink({ ...link, text: e.target.value })}
          placeholder={`Type in the link text`}
        />
      </div>
      <div>
        <select
          value={linkType}
          onChange={(e) => setLinkType(e.target.value)}
          className="form-control form-control-select"
        >
          <option value="web">Web Link</option>
          <option value="email">Email Address</option>
          <option value="phone">Phone Number</option>
        </select>
        {linkType === "web" && (
          <>
            <label className="form-label form-heading form-heading-small">
              Link Url
            </label>
            <input
              className="form-control"
              type="text"
              value={web}
              onChange={(e) => setWeb(e.target.value)}
              placeholder={`Type in the link text`}
            />
          </>
        )}
        {linkType === "email" && (
          <>
            <label className="form-label form-heading form-heading-small">
              Link Email
            </label>
            <input
              className="form-control"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`Type in the link text`}
            />
          </>
        )}
        {linkType === "phone" && (
          <>
            <label className="form-label form-heading form-heading-small">
              Link Phone number
            </label>
            <input
              className="form-control"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={`Type in the link text`}
            />
          </>
        )}
      </div>
      <div className="buttons-container">
        <button
          type="button"
          className="button button--default button--primary"
          onClick={() => addLink()}
        >
          Add
        </button>
        <button
          type="button"
          className="button button--default button--grey-light"
          onClick={() => setShowSelect(undefined)}
        >
          Cancel
        </button>
      </div>
    </Menu>
  );
};

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const SelectionButton = styled(StylingButton)`
  color: ${COLORS.dark_4};
  font-weight: 500;
  font-size: 12px;

  div {
    padding: 0;
    width: 100%;
  }
`;

const Menu = styled.div`
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  left: 30px;
  top: -65px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 350px;
  position: absolute;
  padding: 20px;
  z-index: 1;

  h3 {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 15px;
  }

  p {
    color: ${COLORS.dark_4};
    font-weight: normal;
    font-size: 14px;
    margin-bottom: 15px;
    margin-top: 15px;
  }

  input {
    margin-bottom: 10px;
  }

  .buttons-container {
    border-top: 1px solid #e1e1e1;
    margin-top: 15px;
    padding: 0;
    padding-top: 15px;

    button:first-of-type {
      margin-right: 10px;
    }
  }
`;
