import PropTypes from "prop-types";
import { TextField } from "@mui/material";
import { useState } from "react";
import set from "lodash/set";
import get from "lodash/get";

//dataSet is the source object this component directly modifies
//dataPath is the dot notation path (string) of the property that gets changed by lodash
export default function TextInput({
  label,
  disabled = false,
  dataSet,
  dataPath,
  onTextUpdated,
  multiline = false,
}) {
  const [data, setData] = useState(get(dataSet, dataPath));

  // console.log("🚀 ~ dataSet:", dataSet);
  // console.log("🚀 ~ dataPath:", dataPath);
  //console.log("🚀 ~ GET:", get(dataSet, dataPath));

  function onKeyUp(ev) {
    if (!multiline)
      if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function onChange(ev) {
    //set the dataSet property value using its path
    set(dataSet, dataPath, ev.target.value);
    setData(ev.target.value);
    onTextUpdated(ev.target.value);
  }

  //filled
  //outlined
  return (
    <div style={{ marginBottom: "1rem" }}>
      <TextField
        label={label}
        variant="filled"
        value={data}
        onChange={onChange}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        onKeyUp={onKeyUp}
        multiline={multiline}
        fullWidth
      />
    </div>
  );
}

TextInput.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  dataSet: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  dataPath: PropTypes.string,
  onTextUpdated: PropTypes.func,
};
