import PropTypes from "prop-types";
import { TextField } from "@mui/material";
import { useState } from "react";

export default function MultilineTextInput({
  label,
  dataText,
  disabled = false,
  onTextChanged,
}) {
  const [data, setData] = useState(dataText);

  function onChange(ev) {
    setData(ev.target.value);
    onTextChanged(ev.target.value);
  }

  return (
    <div style={{ marginBottom: "1rem" }}>
      <TextField
        label={label}
        variant="outlined"
        value={data}
        onChange={onChange}
        disabled={disabled}
        multiline={true}
        fullWidth
      />
    </div>
  );
}

MultilineTextInput.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
  dataText: PropTypes.string,
  onTextChanged: PropTypes.func,
};
