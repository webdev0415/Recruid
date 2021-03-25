import React from "react";

export const RevealPassword = ({ target = null }) => {
  const handleOnChange = () => {
    if (target) {
      if (target.current.type === "password") {
        target.current.type = "text";
      } else {
        target.current.type = "password";
      }
    }
  };
  return (
    <div>
      <input
        type="checkbox"
        id="revealPassword"
        onChange={handleOnChange}
        style={{ display: "none" }}
      />
      <label
        htmlFor="revealPassword"
        className="leo-absolute leo-pointer"
        style={{
          bottom: "24px",
          right: "10px",
        }}
      >
        <svg
          width="24"
          height="18"
          viewBox="0 0 24 18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 0C4 0 0 9.041 0 9.041S4 18 12 18s12-9 12-9-4-9-12-9zm0 15c-4.202 0-6.855-4.26-7.75-5.968C5.145 7.308 7.799 3 12 3c4.203 0 6.856 4.285 7.75 6-.896 1.718-3.548 6-7.75 6zm0-10a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
            fill="#9A9CA1"
            fill-role="nonzero"
          />
        </svg>
      </label>
    </div>
  );
};
