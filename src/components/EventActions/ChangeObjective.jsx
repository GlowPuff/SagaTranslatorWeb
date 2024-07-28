import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Paper, Typography } from "@mui/material";

export default function ChangeObjective({
  eaItem,
  disabled,
  brokenIDs = [],
  eaGUID,
  eaIndex,
  onModifyItem,
}) {
  const [entityItem, setEntityItem] = useState(eaItem);

  function modifyItem(key, value) {
    let modified = { ...entityItem };
    modified[key] = value;
    console.log("🚀 ~ modifyItem ~ modified:", modified);
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
          value={entityItem.shortText || ""}
          label={"Short Text"}
          onChange={(e) => modifyItem("shortText", e.target.value)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          fullWidth
          multiline={true}
        />

        <div className="spacer" />

        <TextField
          value={entityItem.longText || ""}
          label={"Long Text"}
          onChange={(e) => modifyItem("longText", e.target.value)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          fullWidth
          multiline={true}
        />
      </Paper>
    </>
  );
}

ChangeObjective.propTypes = {
  eaItem: PropTypes.object,
  disabled: PropTypes.bool,
  brokenIDs: PropTypes.array,
  eaGUID: PropTypes.string,
  onModifyItem: PropTypes.func,
  eaIndex: PropTypes.number,
};
