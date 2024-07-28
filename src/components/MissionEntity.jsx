import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Paper, Typography } from "@mui/material";

export default function MissionEntity({
  data,
  disabled = false,
  brokenIDs = [],
  onModifyItem,
}) {
  const [entityItem, setEntityItem] = useState(data);

  function modifyText(value) {
    let modified = { ...entityItem };
    modified.mainText = value;
    setEntityItem(modified);
    onModifyItem("mapEntities", modified);
  }

  function modifyButton(btnIndex, value) {
    let modified = { ...entityItem };
    modified.buttonList[btnIndex].theText = value;
    setEntityItem(modified);
    onModifyItem("mapEntities", modified);
  }

  return (
    <>
      {!disabled ? (
        <div
          style={{
            marginBottom: "1rem",
            color:
              !disabled && brokenIDs.includes(entityItem.GUID) ? "red" : "white",
          }}
        >
          <Typography>Map Entity - {entityItem.entityName}</Typography>
        </div>
      ) : (
        <div style={{ marginBottom: "1rem", color: "#6dcaf2" }}>
          <Typography variant="button">Source</Typography>
        </div>
      )}

      <TextField
        value={entityItem.mainText || ""}
        label={"Entity Text"}
        onChange={(e) => modifyText(e.target.value)}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        fullWidth
        multiline={true}
        sx={{
          backgroundColor:
            !disabled && brokenIDs.includes(entityItem.GUID)
              ? "rgba(255, 0, 0, 0.2)"
              : "",
          borderRadius: "5px",
        }}
      />

      {entityItem.buttonList === undefined && (
        <Typography variant="p" sx={{ color: "#6dcaf2" }}>
          This item should not be undefined. Please contact me through GitHub
          about this issue.
        </Typography>
      )}

      {entityItem.buttonList?.length > 0 && (
        <div>
          <div className="spacer" />

          <Paper sx={{ padding: "1rem", marginBottom: "1rem" }} elevation={3}>
            <Typography
              variant="button"
              sx={{
                color: "#6dcaf2",
              }}
            >
              {`${entityItem.buttonList.length} Button(s)`}
            </Typography>

            {entityItem.buttonList.map((btn, btnIndex) => (
              <div key={btnIndex}>
                <div className="spacer1" />
                <TextField
                  key={btnIndex}
                  value={btn.theText || ""}
                  label={"Button Text"}
                  onChange={(e) => modifyButton(btnIndex, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  disabled={disabled}
                  fullWidth
                  multiline={true}
                  sx={{
                    backgroundColor:
                      !disabled && brokenIDs.includes(btn.GUID)
                        ? "rgba(255, 0, 0, 0.2)"
                        : "",
                    borderRadius: "5px",
                  }}
                />
              </div>
            ))}
          </Paper>
        </div>
      )}
    </>
  );
}

MissionEntity.propTypes = {
  data: PropTypes.object,
  disabled: PropTypes.bool,
  brokenIDs: PropTypes.array,
  onModifyItem: PropTypes.func,
};
