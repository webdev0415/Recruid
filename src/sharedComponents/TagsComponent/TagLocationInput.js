import React, { useState, useRef } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import SearchDropbox from "sharedComponents/SearchDropbox";

// const searchOptions = { types: ["(cities)"] };

const TagInput = ({ onSelect, value }) => {
  const node = useRef();
  const [val, setVal] = useState(value || "");

  return (
    <div ref={node}>
      <PlacesAutocomplete
        value={val}
        onChange={setVal}
        onSelect={(value) => onSelect({ name: value })}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <SearchDropbox
            list={suggestions}
            onSelect={() => {
              onSelect({ name: value });
            }}
            allowCreation={true}
            displayProp="description"
            getInputProps={getInputProps}
            getSuggestionItemProps={getSuggestionItemProps}
          />
        )}
      </PlacesAutocomplete>
    </div>
  );
};

export default TagInput;
