import PropTypes from "prop-types";
import { TextField } from "@mui/material";
import { useState } from "react";

export default function TextInput({
  label,
  disabled = false,
  intialValue,
  onTextUpdated,
  multiline = false,
}) {
  const [textValue, setTextValue] = useState(intialValue);

  function onKeyUp(ev) {
    if (!multiline)
      if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function onChange(ev) {
		setTextValue(ev.target.value);
    onTextUpdated(ev.target.value);
  }

  //filled
  //outlined
  return (
    <div style={{ marginBottom: "1rem" }}>
      <TextField
        label={label}
        variant="filled"
        value={textValue}
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
  onTextUpdated: PropTypes.func,
  intialValue: PropTypes.string,
};
