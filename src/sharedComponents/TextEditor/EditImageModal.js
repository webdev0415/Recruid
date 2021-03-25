import React, { useState, useEffect } from "react";
import RadioButton from "sharedComponents/RadioButton";
import UniversalModal, {
  ModalBody,
  MinimalHeader,
} from "modals/UniversalModal/UniversalModal";
import styled from "styled-components";
import AppButton from "styles/AppButton";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import RangeSelector from "sharedComponents/RangeSelector";
import { AWS_CDN_URL } from "constants/api";

const AddCandidatesToJobModal = ({
  hide,
  setImageProps,
  ogProps,
  nodeImage,
}) => {
  const [options, setOptions] = useState({
    size: "leo-full-size",
    alignment: "leo-image-center",
    custom: {
      width: "0",
      height: "0",
    },
  });
  const [openSize, setOpenSize] = useState(false);
  const [ogSize, setOgSize] = useState(undefined);

  useEffect(() => {
    if (nodeImage) {
      let crWidth = nodeImage.current.clientWidth + 0;
      let crHeight = nodeImage.current.clientHeight + 0;
      let crRatio =
        nodeImage.current.naturalHeight / nodeImage.current.naturalWidth;
      setOgSize({
        width: crWidth,
        height: crHeight,
        aspectRatio: crRatio,
      });
    }
  }, [nodeImage]);

  useEffect(() => {
    if (ogProps) {
      setOptions({
        size: ogProps.size || "leo-full-size",
        alignment: ogProps.alignment || "leo-image-center",
        custom: {
          width: ogProps.custom?.width
            ? ogProps.custom?.width.replace("px", "")
            : "0",
          height: ogProps.custom?.height
            ? ogProps.custom?.height.replace("px", "")
            : "0",
        },
      });
    }
  }, [ogProps]);

  const updateImage = () => {
    let toSend = {};
    if (options.alignment) {
      toSend.alignment = options.alignment;
    }
    if (options.size) {
      toSend.size = options.size;
    }
    if (
      options.size === "leo-custom-size" &&
      (options.custom.width !== "0" || options.custom.height !== "0")
    ) {
      toSend.custom = {};
      if (options.custom.width !== "0") {
        toSend.custom.width = options.custom.width + "px";
      }
      if (options.custom.height !== "0") {
        toSend.custom.height = options.custom.height + "px";
      }
    }
    if (
      options.size !== "leo-custom-size" &&
      (ogProps.custom?.width || ogProps.custom?.height)
    ) {
      toSend.custom = {
        height: null,
        width: null,
      };
    }
    setImageProps(toSend);
    hide();
  };
  return (
    <UniversalModal show={true} hide={hide} id="image-editor" width={380}>
      <MinimalHeader title="Edit Image" hide={hide} />
      <STModalBody className="no-footer">
        <Main>
          <ImageContainer>
            <img src={ogProps?.url} alt={ogProps?.alt} />
          </ImageContainer>
          <HeadLabel>Size</HeadLabel>
          <div className="leo-flex leo-align-start">
            <div className="leo-flex leo-align-start">
              <RadioButton
                onClick={() =>
                  setOptions({ ...options, size: "leo-full-size" })
                }
                name={"size-radio-checks"}
                value="leo-full-size"
                active={options.size === "leo-full-size"}
                id={"full-size-radio-check"}
              />
              <RadioLabel
                className={options.size === "leo-full-size" ? "active" : ""}
              >
                Full Width
                <OverlayTrigger
                  key={`top-full`}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`tooltip-top-full`}>
                      <strong>
                        Uses the original size of the image with a max width of
                        500px
                      </strong>
                    </Tooltip>
                  }
                >
                  <span className="info-icon">
                    <i className="fas fa-exclamation-circle"></i>
                  </span>
                </OverlayTrigger>
              </RadioLabel>
            </div>
            <div className="leo-flex leo-align-start">
              <RadioButton
                onClick={() => setOptions({ ...options, size: "leo-med-size" })}
                name={"size-radio-checks"}
                value="leo-med-size"
                active={options.size === "leo-med-size"}
                id={"med-size-radio-check"}
              />
              <RadioLabel
                className={options.size === "leo-med-size" ? "active" : ""}
              >
                Medium
                <OverlayTrigger
                  key={`top-med`}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`tooltip-top-med`}>
                      <strong>250px width</strong>
                    </Tooltip>
                  }
                >
                  <span className="info-icon">
                    <i className="fas fa-exclamation-circle"></i>
                  </span>
                </OverlayTrigger>
              </RadioLabel>
            </div>
            <div className="leo-flex leo-align-start">
              <RadioButton
                onClick={() =>
                  setOptions({ ...options, size: "leo-small-size" })
                }
                name={"size-radio-checks"}
                value="leo-small-size"
                active={options.size === "leo-small-size"}
                id={"small-size-radio-check"}
              />
              <RadioLabel
                className={options.size === "leo-small-size" ? "active" : ""}
              >
                Small
                <OverlayTrigger
                  key={`top-small`}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`tooltip-top-small`}>
                      <strong>100px width</strong>
                    </Tooltip>
                  }
                >
                  <span className="info-icon">
                    <i className="fas fa-exclamation-circle"></i>
                  </span>
                </OverlayTrigger>
              </RadioLabel>
            </div>
            <div className="leo-flex leo-align-start">
              <RadioButton
                onClick={() =>
                  setOptions({ ...options, size: "leo-custom-size" })
                }
                name={"size-radio-checks"}
                value="leo-custom-size"
                active={options.size === "leo-custom-size"}
                id={"custom-size-radio-check"}
              />
              <RadioLabel
                className={options.size === "leo-custom-size" ? "active" : ""}
              >
                Custom Size
              </RadioLabel>
            </div>
          </div>
          {options.size === "leo-custom-size" && (
            <CustomSizeContainer>
              <span>Width (px)</span>
              <RangeSelector
                min="0"
                max="500"
                value={
                  options.custom.width !== "0"
                    ? options.custom.width
                    : ogSize?.width
                }
                onChange={(val) => {
                  if (!openSize && ogSize) {
                    ogSize.aspectRatio;
                    let calculatedHeight = Math.floor(
                      ogSize.aspectRatio *
                        (options.custom.width !== "0"
                          ? options.custom.width
                          : ogSize?.width)
                    );
                    setOptions({
                      ...options,
                      custom: {
                        ...options.custom,
                        width: val,
                        height: calculatedHeight,
                      },
                    });
                  } else {
                    setOptions({
                      ...options,
                      custom: { ...options.custom, width: val },
                    });
                  }
                }}
                style={{ width: "120px" }}
              />
              <span>
                {options.custom.width !== "0"
                  ? options.custom.width
                  : ogSize?.width}{" "}
                px
              </span>
              <LockButton
                onClick={() => {
                  if (openSize) {
                    setOpenSize(false);
                    setOptions({
                      ...options,
                      custom: { ...options.custom, height: "0" },
                    });
                  } else {
                    setOpenSize(true);
                  }
                }}
                className={!openSize ? "disabled" : ""}
              >
                <img src={`${AWS_CDN_URL}/icons/LockSizes.svg`} alt="Lock" />
              </LockButton>
              <div />
              <div />
              <span className={!openSize ? "disabled" : ""}>Height (px)</span>
              <div className={!openSize ? "disabled" : ""}>
                <RangeSelector
                  min="0"
                  max="500"
                  value={
                    options.custom.height !== "0"
                      ? options.custom.height
                      : ogSize?.height
                  }
                  onChange={(val) =>
                    setOptions({
                      ...options,
                      custom: { ...options.custom, height: val },
                    })
                  }
                  style={{ width: "120px" }}
                  disabled={!openSize}
                />
              </div>
              <span className={!openSize ? "disabled" : ""}>
                {options.custom.height !== "0"
                  ? options.custom.height
                  : ogSize?.height}{" "}
                px
              </span>
            </CustomSizeContainer>
          )}
          <Separator />
          <HeadLabel>Alignment</HeadLabel>
          <div className="leo-flex leo-align-start leo-justify-between">
            <Cell
              className={
                options.alignment !== "leo-image-left" ? "not-active" : ""
              }
              onClick={() =>
                setOptions({ ...options, alignment: "leo-image-left" })
              }
            >
              <img
                src={`${AWS_CDN_URL}/icons/AlignLeft.svg`}
                alt="Align Left"
              />
              <span>Left</span>
            </Cell>
            <Cell
              className={
                options.alignment !== "leo-image-center" ? "not-active" : ""
              }
              onClick={() =>
                setOptions({ ...options, alignment: "leo-image-center" })
              }
            >
              <img
                src={`${AWS_CDN_URL}/icons/AlignCenter.svg`}
                alt="AlignCenter"
              />
              <span>Center</span>
            </Cell>
            <Cell
              className={
                options.alignment !== "leo-image-right" ? "not-active" : ""
              }
              onClick={() =>
                setOptions({ ...options, alignment: "leo-image-right" })
              }
            >
              <img
                src={`${AWS_CDN_URL}/icons/AlignRight.svg`}
                alt="AlignRight"
              />
              <span>Right</span>
            </Cell>
            <Cell
              className={
                options.alignment !== "leo-image-float-left" ? "not-active" : ""
              }
              onClick={() =>
                setOptions({ ...options, alignment: "leo-image-float-left" })
              }
            >
              <img
                src={`${AWS_CDN_URL}/icons/AlignFloatLeft.svg`}
                alt="AlignFloatLeft"
              />
              <span>Wrap Left</span>
            </Cell>
            <Cell
              className={
                options.alignment !== "leo-image-float-right"
                  ? "not-active"
                  : ""
              }
              onClick={() =>
                setOptions({ ...options, alignment: "leo-image-float-right" })
              }
            >
              <img
                src={`${AWS_CDN_URL}/icons/AlignFloatRight.svg`}
                alt="AlignFloatRight"
              />
              <span>Wrap Right</span>
            </Cell>
          </div>
        </Main>
        <Footer className="leo-flex leo-justify-end">
          <AppButton
            onClick={() => hide()}
            theme="white"
            style={{ marginRight: "10px" }}
            size="small"
          >
            Cancel
          </AppButton>
          <AppButton onClick={() => updateImage()} size="small">
            Confirm
          </AppButton>
        </Footer>
      </STModalBody>
    </UniversalModal>
  );
};

export default AddCandidatesToJobModal;

const STModalBody = styled(ModalBody)`
  padding: 0px !important;
`;

const Footer = styled.div`
  border-top: solid #eee 1px;
  margin-top: 10px;
  padding: 20px;
`;

const RadioLabel = styled.label`
  margin-right: 20px;
  position: relative;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #b0bdca;
  margin-left: 7px;

  &.active {
    color: #1e1e1e;
  }

  .info-icon {
    font-size: 10px;
    color: #c4c4c4;
    position: absolute;
    right: -12px;
    top: -4px;
    &:hover {
      color: #606060;
    }
  }
`;
const HeadLabel = styled.label`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #1e1e1e;
`;

const ImageContainer = styled.div`
  margin-bottom: 20px;
  img {
    max-width: 100px;
    max-height: 100px;
    border-radius: 4px;
  }
`;

const Separator = styled.div`
  height: 1px;
  width: 100%;
  background: #dfe9f4;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const Cell = styled.button`
  &.not-active {
    opacity: 0.2;
  }
  .span {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: #1e1e1e;
  }
`;
const Main = styled.div`
  padding: 20px;
`;

const CustomSizeContainer = styled.div`
  margin-left: 24px;
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-gap: 20px;
  margin-top: 20px;
  width: max-content;
  align-items: center;

  .title-span {
    font-size: 12px;
    line-height: 15px;
    color: #1e1e1e;
  }

  .disabled {
    opacity: 0.2;
  }
`;

const LockButton = styled.button`
  &.disabled {
    opacity: 0.2;
  }
`;
