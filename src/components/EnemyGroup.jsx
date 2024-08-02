//react
import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Paper, Typography } from "@mui/material";

export default function EnemyGroup({
  disabled = false,
  groupData,
  onGroupUpdated,
}) {
  const [groupName, setGroupName] = useState(groupData.name);
  const [groupSubName, setGroupSubName] = useState(groupData.subname);
  const [traitArray, setTraitArray] = useState(groupData.traits);
  const [keywordsArray, setKeywordsArray] = useState(groupData.keywords);
  const [surgesArray, setSurgesArray] = useState(groupData.surges);
  const [abilityArray, setAbilityArray] = useState(groupData.abilities);

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function onNameChange(ev) {
    setGroupName(ev.target.value);
    groupData.name = ev.target.value;
    onGroupUpdated(groupData);
  }

  function onSubNameChange(ev) {
    setGroupSubName(ev.target.value);
    groupData.subname = ev.target.value;
    onGroupUpdated(groupData);
  }

  function setTraits(index, value) {
    groupData.traits[index] = value;
    let temp = [...traitArray];
    temp[index] = value;
    setTraitArray(temp);
    onGroupUpdated(groupData);
  }

  function setKeywords(index, value) {
    groupData.keywords[index] = value;
    let temp = [...keywordsArray];
    temp[index] = value;
    setKeywordsArray(temp);
    onGroupUpdated(groupData);
  }

  function setSurges(index, value) {
    groupData.surges[index] = value;
    let temp = [...surgesArray];
    temp[index] = value;
    setSurgesArray(temp);
    onGroupUpdated(groupData);
  }

  function setAbilityName(index, value) {
    groupData.abilities[index].name = value;
    let temp = [...groupData.abilities];
    temp[index].name = value;
    setAbilityArray(temp);
    onGroupUpdated(groupData);
  }

  function setAbilityText(index, value) {
    groupData.abilities[index].text = value;
    let temp = [...groupData.abilities];
    temp[index].text = value;
    setAbilityArray(temp);
    onGroupUpdated(groupData);
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
          <Typography>{groupName}</Typography>
        </div>
      )}

      <TextField
        label={"Name"}
        variant="filled"
        value={groupName}
        onChange={(e) => onNameChange(e)}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        onKeyUp={onKeyUp}
        fullWidth
        sx={{ marginBottom: "1rem" }}
      />
      <TextField
        label={"Subname"}
        variant="filled"
        value={groupSubName}
        onChange={(e) => onSubNameChange(e)}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        onKeyUp={onKeyUp}
        fullWidth
        sx={{ marginBottom: "1rem" }}
      />

      <Paper sx={{ padding: "1rem", marginBottom: "1rem" }}>
        <Typography variant="button" style={{ color: "#6dcaf2" }}>
          Traits
        </Typography>
        {groupData.traits.map((trait, index) => (
          <TextField
            key={index}
            label={""}
            variant="filled"
            value={traitArray[index]}
            onChange={(e) => setTraits(index, e.target.value)}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            onKeyUp={onKeyUp}
            fullWidth
            sx={{ marginBottom: "1rem" }}
          />
        ))}
      </Paper>

      <Paper sx={{ padding: "1rem", marginBottom: "1rem" }}>
        <Typography variant="button" style={{ color: "#6dcaf2" }}>
          Keywords
        </Typography>
        {groupData.keywords.map((trait, index) => (
          <TextField
            key={index}
            label={""}
            variant="filled"
            value={keywordsArray[index]}
            onChange={(e) => setKeywords(index, e.target.value)}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            onKeyUp={onKeyUp}
            fullWidth
            sx={{ marginBottom: "1rem" }}
          />
        ))}
      </Paper>

      <Paper sx={{ padding: "1rem", marginBottom: "1rem" }}>
        <Typography variant="button" style={{ color: "#6dcaf2" }}>
          Surges
        </Typography>
        {groupData.surges.map((trait, index) => (
          <TextField
            key={index}
            label={""}
            variant="filled"
            value={surgesArray[index]}
            onChange={(e) => setSurges(index, e.target.value)}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            onKeyUp={onKeyUp}
            fullWidth
            sx={{ marginBottom: "1rem" }}
          />
        ))}
      </Paper>

      {abilityArray.map((mItem, index) => (
        <Paper key={index} sx={{ padding: "1rem", marginBottom: "1rem" }}>
          <div style={{ marginBottom: "1rem", color: "#6dcaf2" }}>
            <Typography variant="button">{`Ability ${index + 1}`}</Typography>
            <TextField
              label={"Name"}
              variant="filled"
              value={abilityArray[index].name}
              onChange={(e) => setAbilityName(index, e.target.value)}
              onFocus={(e) => e.target.select()}
              disabled={disabled}
              onKeyUp={onKeyUp}
              fullWidth
              sx={{ marginBottom: "1rem" }}
            />
            <TextField
              label={"Text"}
              variant="filled"
              value={abilityArray[index].text}
              onChange={(e) => setAbilityText(index, e.target.value)}
              onFocus={(e) => e.target.select()}
              disabled={disabled}
              onKeyUp={onKeyUp}
              fullWidth
              multiline={true}
            />
          </div>
        </Paper>
      ))}
    </>
  );
}

EnemyGroup.propTypes = {
  disabled: PropTypes.bool,
  groupData: PropTypes.object,
  onGroupUpdated: PropTypes.func,
};
