import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Paper, Typography } from "@mui/material";

export default function MissionCardItem({ item, disabled, onMissionUpdated }) {
  const [missionItem, setMissionItem] = useState(item);

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function onTextChanged(ev, propName) {
    item[propName] = ev.target.value;
    setMissionItem({ ...item });
    onMissionUpdated(item);
  }

  function tagChanged(ev, index) {
    item.tagsText[index] = ev.target.value;
    setMissionItem({ ...item });
    onMissionUpdated(item);
  }

  return (
    <>
      {disabled && (
        <div style={{ marginBottom: "1rem" }}>
          <Typography>Source</Typography>
        </div>
      )}
      {!disabled && (
        <div style={{ marginBottom: "1rem" }}>
          <Typography>{missionItem.id}</Typography>
        </div>
      )}

      <TextField
        label={"name"}
        variant="filled"
        value={missionItem.name}
        onChange={(e) => onTextChanged(e, "name")}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        onKeyUp={onKeyUp}
        fullWidth
        sx={{ marginBottom: "1rem" }}
      />
      <TextField
        label={"descriptionText"}
        variant="filled"
        value={missionItem.descriptionText}
        onChange={(e) => onTextChanged(e, "descriptionText")}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        onKeyUp={onKeyUp}
        fullWidth
        multiline
        sx={{ marginBottom: "1rem" }}
      />
      <TextField
        label={"bonusText"}
        variant="filled"
        value={missionItem.bonusText}
        onChange={(e) => onTextChanged(e, "bonusText")}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        onKeyUp={onKeyUp}
        fullWidth
        multiline
        sx={{ marginBottom: "1rem" }}
      />
      <TextField
        label={"heroText"}
        variant="filled"
        value={missionItem.heroText}
        onChange={(e) => onTextChanged(e, "heroText")}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        onKeyUp={onKeyUp}
        fullWidth
        sx={{ marginBottom: "1rem" }}
      />
      <TextField
        label={"allyText"}
        variant="filled"
        value={missionItem.allyText}
        onChange={(e) => onTextChanged(e, "allyText")}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        onKeyUp={onKeyUp}
        fullWidth
        sx={{ marginBottom: "1rem" }}
      />
      <TextField
        label={"villainText"}
        variant="filled"
        value={missionItem.villainText}
        onChange={(e) => onTextChanged(e, "villainText")}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        onKeyUp={onKeyUp}
        fullWidth
        sx={{ marginBottom: "1rem" }}
      />
      {item.tagsText.length > 0 && (
        <Paper sx={{ padding: "1rem", marginBottom: "1rem" }}>
          <Typography variant="button" style={{ color: "#6dcaf2" }}>
            Tags
          </Typography>
          {missionItem.tagsText.map((tag, index) => (
            <TextField
              key={index}
              label={`Tag ${index + 1} of ${missionItem.tagsText.length}`}
              variant="filled"
              value={tag}
              onChange={(e) => tagChanged(e, index)}
              onFocus={(e) => e.target.select()}
              disabled={disabled}
              onKeyUp={onKeyUp}
              fullWidth
              sx={{ marginBottom: "1rem" }}
            />
          ))}
        </Paper>
      )}
      <TextField
        label={"expansionText"}
        variant="filled"
        value={missionItem.expansionText}
        onChange={(e) => onTextChanged(e, "expansionText")}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        onKeyUp={onKeyUp}
        fullWidth
        sx={{ marginBottom: "1rem" }}
      />
      <TextField
        label={"rebelRewardText"}
        variant="filled"
        value={missionItem.rebelRewardText}
        onChange={(e) => onTextChanged(e, "rebelRewardText")}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        onKeyUp={onKeyUp}
        fullWidth
        sx={{ marginBottom: "1rem" }}
      />
      <TextField
        label={"imperialRewardText"}
        variant="filled"
        value={missionItem.imperialRewardText}
        onChange={(e) => onTextChanged(e, "imperialRewardText")}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        onKeyUp={onKeyUp}
        fullWidth
        sx={{ marginBottom: "1rem" }}
      />
    </>
  );
}

MissionCardItem.propTypes = {
  item: PropTypes.object,
  onMissionUpdated: PropTypes.func,
  disabled: PropTypes.bool,
};
