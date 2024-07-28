import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Typography } from "@mui/material";

export default function MissionInitialGroups({
  data,
  disabled = false,
  brokenIDs = [],
  onModifyItem,
}) {
  const [groupItem, setGroupItem] = useState(data);

  function modifyText(value) {
    let modified = { ...groupItem };
    modified.customInstructions = value;
    setGroupItem(modified);
    onModifyItem("initialGroups", modified);
  }

  return (
    <>
      {!disabled ? (
        <div style={{ marginBottom: "1rem", color: "white" }}>
          <Typography>Initial Group - {groupItem.cardName}</Typography>
        </div>
      ) : (
        <div style={{ marginBottom: "1rem", color: "#6dcaf2" }}>
          <Typography variant="button">Source</Typography>
        </div>
      )}

      <TextField
        value={groupItem.customInstructions || ""}
        label={"Custom Instructions"}
        onChange={(e) => modifyText(e.target.value)}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        fullWidth
        multiline={true}
        sx={{
          backgroundColor:
            !disabled &&
            brokenIDs.filter((x) => x === groupItem.cardName).length > 0
              ? "rgba(255, 0, 0, 0.2)"
              : "",
          borderRadius: "5px",
        }}
      />
    </>
  );
}

MissionInitialGroups.propTypes = {
  data: PropTypes.object,
  disabled: PropTypes.bool,
  brokenIDs: PropTypes.array,
  onModifyItem: PropTypes.func,
};
