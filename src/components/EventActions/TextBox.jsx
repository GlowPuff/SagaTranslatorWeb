import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Paper, Typography } from "@mui/material";

export default function TextBox({
  eaItem,
  disabled,
  brokenIDs = [],
  eaGUID,
  eaIndex,
  onModifyItem,
}) {
  const [entityItem, setEntityItem] = useState(eaItem);

  function modifyItem(value) {
    let modified = { ...entityItem };
    modified.tbText = value;
    console.log("🚀 ~ modifyItem ~ modified:", modified)
    setEntityItem(modified);
    onModifyItem("eventActions", modified, eaIndex);
  }

  return (
    <>
      <Paper sx={{ padding: "1rem", marginBottom: "1rem" }}>
        <Typography
          variant="button"
          sx={{
            color: !disabled && brokenIDs.includes(eaGUID) ? "red" : "#6dcaf2",
          }}
        >
          {`${entityItem.eaName}`}
        </Typography>

        <div className="spacer" />

        <TextField
          value={entityItem.tbText || ""}
          label={"Main Text"}
          onChange={(e) => modifyItem(e.target.value)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          fullWidth
          multiline={true}
        />
      </Paper>
    </>
  );
}

TextBox.propTypes = {
  eaItem: PropTypes.object,
  disabled: PropTypes.bool,
  brokenIDs: PropTypes.array,
  eaGUID: PropTypes.string,
  onModifyItem: PropTypes.func,
  eaIndex: PropTypes.number,
};
