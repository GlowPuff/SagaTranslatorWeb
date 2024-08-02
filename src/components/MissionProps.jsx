import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Paper, Typography } from "@mui/material";

export default function MissionProps({
  data,
  disabled = false,
  brokenIDs = [],
  onModifyItem,
}) {
  const [missionItemArray, setMissionItemArray] = useState(
    Object.entries(data.data).sort((a, b) =>
      a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0
    )
  );

  function modifyProps(index, key, value) {
    let modified = [...missionItemArray];
    modified[index] = [key, value];
    setMissionItemArray(modified);
    onModifyItem(key, value);
  }

  return (
    <>
      {!disabled ? (
        <div style={{ marginBottom: "1rem", color: "white" }}>
          <Typography>Mission Properties</Typography>
        </div>
      ) : (
        <div style={{ marginBottom: "1rem" }}>
          <Typography>Source</Typography>
        </div>
      )}

      {missionItemArray.map((item, index) => (
        <Paper
          key={index}
          sx={{
            padding: "1rem",
            marginBottom: "1rem",
            backgroundColor:
              !disabled && brokenIDs.includes(item[0])
                ? "rgba(255, 0, 0, 0.2)"
                : "",
          }}
        >
          <Typography
            sx={{
              color:
                !disabled && brokenIDs.includes(item[0]) ? "red" : "#6dcaf2",
            }}
          >
            {item[0]}
          </Typography>
          <TextField
            value={item[1] || ""}
            onChange={(e) => modifyProps(index, item[0], e.target.value)}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            fullWidth
            multiline={true}
          />
        </Paper>
      ))}
    </>
  );
}

MissionProps.propTypes = {
  data: PropTypes.object,
  disabled: PropTypes.bool,
  brokenIDs: PropTypes.array,
  onModifyItem: PropTypes.func,
};
