//react
import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Paper, Typography } from "@mui/material";

export default function EnemyInstruction({
  disabled = false,
  instruction,
  onInstructionUpdated,
}) {
  const [instName, setInstName] = useState(instruction.instName);
  const [instructionContentArray, setInstructionContentArray] = useState(
    instruction.content
  );

  function onKeyUp(ev) {
    if (ev.key === "Enter" || ev.keyCode === 13) ev.target.blur();
  }

  function onNameChange(ev) {
    setInstName(ev.target.value);
    instruction.instName = ev.target.value;
    onInstructionUpdated(instruction);
  }

  function onInstructionChange(instructionIndex, itemIndex, value) {
    instruction.content[instructionIndex].instruction[itemIndex] = value;
    let temp = [...instructionContentArray];
    temp[instructionIndex].instruction[itemIndex] = value;
    setInstructionContentArray(temp);
    onInstructionUpdated(instruction);
  }

  return (
    <>
      <TextField
        label={"Name"}
        variant="filled"
        value={instName}
        onChange={(e) => onNameChange(e)}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        onKeyUp={onKeyUp}
        fullWidth
        sx={{ marginBottom: "1rem" }}
      />

      {instruction.content.map((cItem, sIdx) => (
        <Paper key={sIdx} sx={{ padding: "1rem", marginBottom: "1rem" }}>
          <div style={{ marginBottom: "1rem", color: "#6dcaf2" }}>
            <Typography variant="button" key={Math.random()}>
              {`Instruction Group ${sIdx + 1}`}
            </Typography>
          </div>
          {instruction.content[sIdx].instruction.map((mItem, inIdx) => (
            <TextField
              key={inIdx}
              label={""}
              variant="filled"
              value={instructionContentArray[sIdx].instruction[inIdx]}
              onChange={(e) => onInstructionChange(sIdx, inIdx, e.target.value)}
              onFocus={(e) => e.target.select()}
              disabled={disabled}
              fullWidth
              multiline={true}
              sx={{ marginBottom: "1rem" }}
            />
          ))}
        </Paper>
      ))}
    </>
  );
}

EnemyInstruction.propTypes = {
  disabled: PropTypes.bool,
  instruction: PropTypes.object,
  onInstructionUpdated: PropTypes.func,
};
