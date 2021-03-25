import React, { Fragment, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
// import styled from "styled-components";

export default function VendorContacts({
  contacts,
  setContacts,
  newContact,
  setNewContact,
  initialContact,
  setMainEmail,
  setMainPhone,
  mainPhone,
  mainEmail,
}) {
  useEffect(() => {
    (function converNull() {
      const newContacts = [...contacts];
      for (let n in newContacts) {
        if (typeof newContacts[n].title === `object`) newContacts[n].title = ``;
      }
      setContacts(newContacts);
    })();
  }, [contacts, setContacts]);
  function handleInputChange(event, index) {
    const newContacts = [...contacts];
    const name = event.target.name;
    newContacts[index][name] = event.target.value;
    setContacts(newContacts);
  }
  function handleContactDelete(index) {
    const newContacts = [...contacts];
    newContacts[index]["_destroy"] = true;
    document.getElementById(`contact-#${index + 1}`).style.display = `none`;
    setContacts(newContacts);
  }
  function handleNewContactChange(event) {
    const newProp = { ...newContact };
    const propName = event.target.name;
    newProp[propName] = event.target.value;
    setNewContact(newProp);
  }
  function handleContactAddition() {
    if (newContact.name !== ``) {
      const newContacts = [...contacts];
      newContacts.push(newContact);
      setContacts(newContacts);
      setNewContact(initialContact);
    }
  }
  function handleMainContactSet(contact) {
    setMainEmail(contact.email);
    setMainPhone(contact.phone);
  }
  return (
    <Fragment>
      {contacts && contacts.map.length > 0 && (
        <Row style={{ marginBottom: "10px" }}>
          <Col md={2}>
            <label
              htmlFor="name"
              className="form-label form-heading form-heading-small"
            >
              Full Name
            </label>
          </Col>
          <Col md={2}>
            <label
              htmlFor="email"
              className="form-label form-heading form-heading-small"
            >
              Email
            </label>
          </Col>
          <Col md={2}>
            <label
              htmlFor="title"
              className="form-label form-heading form-heading-small"
            >
              Job Title
            </label>
          </Col>
          <Col md={2}>
            <label
              htmlFor="phone"
              className="form-label form-heading form-heading-small"
            >
              Phone
            </label>
          </Col>
        </Row>
      )}
      {!!contacts &&
        contacts.map((contact, index) => (
          <Row key={`contact-#${index + 1}`} id={`contact-#${index + 1}`}>
            <Col md={2}>
              <input
                className="form-control"
                name={`name`}
                value={contact.name}
                onChange={(event) => handleInputChange(event, index)}
              />
            </Col>
            <Col md={2}>
              <input
                className="form-control"
                name={`email`}
                value={contact.email}
                onChange={(event) => handleInputChange(event, index)}
              />
            </Col>
            <Col md={2}>
              <input
                className="form-control"
                name={`title`}
                value={contact.title}
                onChange={(event) => handleInputChange(event, index)}
              />
            </Col>
            <Col md={2}>
              <input
                className="form-control"
                name={`phone`}
                value={contact.phone}
                onChange={(event) => handleInputChange(event, index)}
              />
            </Col>
            <Col md={2}>
              {mainEmail === contact.email || mainPhone === contact.phone ? (
                <span
                  className={`button button--default button--primary`}
                  style={{ marginBottom: `30px` }}
                >
                  Main Contact
                </span>
              ) : (
                <button
                  className={`button button--default button--primary`}
                  style={{ marginBottom: `30px` }}
                  onClick={() => handleMainContactSet(contact)}
                >
                  Set as Main
                </button>
              )}
            </Col>
            <Col md={2}>
              {" "}
              <button
                className={`button button--default button--grey-light`}
                style={{ marginBottom: `30px` }}
                onClick={() => handleContactDelete(index)}
              >
                Delete
              </button>
            </Col>
          </Row>
        ))}
      <h4 style={{ marginBottom: "10px" }}>Add a new contact</h4>
      <Row>
        <Col md={2}>
          <input
            style={{ maxWidth: `180px` }}
            className="form-control"
            name={`name`}
            value={newContact.name}
            placeholder={`New contact name`}
            onChange={(event) => handleNewContactChange(event)}
          />
        </Col>
        <Col md={2}>
          <input
            style={{ maxWidth: `180px` }}
            className="form-control"
            name={`email`}
            value={newContact.email}
            placeholder={`New contact email`}
            onChange={(event) => handleNewContactChange(event)}
          />
        </Col>
        <Col md={2}>
          <input
            style={{ maxWidth: `180px` }}
            className="form-control"
            name={`title`}
            value={newContact.title}
            placeholder={`New contact title`}
            onChange={(event) => handleNewContactChange(event)}
          />
        </Col>
        <Col md={2}>
          <input
            style={{ maxWidth: `180px` }}
            className="form-control"
            name={`phone`}
            value={newContact.phone}
            placeholder={`New conatct phone`}
            onChange={(event) => handleNewContactChange(event)}
          />
        </Col>
        <Col md={4}>
          <button
            className={`button button--default button--blue-dark`}
            style={{ marginBottom: `30px`, minWidth: `80px` }}
            onClick={(event) => handleContactAddition(event)}
          >
            Add
          </button>
        </Col>
      </Row>
    </Fragment>
  );
}
