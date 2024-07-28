import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Paper, Typography } from "@mui/material";

export default function EnemyDeployment({
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
          value={entityItem.enemyName || ""}
          label={"Enemy Name"}
          onChange={(e) => modifyItem("enemyName", e.target.value)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          fullWidth
          multiline={true}
        />

        <div className="spacer1" />

        <TextField
          value={entityItem.customText || ""}
          label={"Custom Instructions"}
          onChange={(e) => modifyItem("customText", e.target.value)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          fullWidth
          multiline={true}
        />

        <div className="spacer1" />

        <TextField
          value={entityItem.modification || ""}
          label={"Modification"}
          onChange={(e) => modifyItem("modification", e.target.value)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          fullWidth
          multiline={true}
        />

        <div className="spacer1" />

        <TextField
          value={entityItem.repositionInstructions || ""}
          label={"Reposition Instructions"}
          onChange={(e) => modifyItem("repositionInstructions", e.target.value)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          fullWidth
          multiline={true}
        />
      </Paper>
    </>
  );
}

EnemyDeployment.propTypes = {
  eaItem: PropTypes.object,
  disabled: PropTypes.bool,
  brokenIDs: PropTypes.array,
  eaGUID: PropTypes.string,
  onModifyItem: PropTypes.func,
  eaIndex: PropTypes.number,
};
