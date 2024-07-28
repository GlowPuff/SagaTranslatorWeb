import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Paper, Typography } from "@mui/material";

export default function InputPrompt({
  eaItem,
  disabled,
  brokenIDs = [],
  eaGUID,
  eaIndex,
  onModifyItem,
}) {
  const [entityItem, setEntityItem] = useState(eaItem);

  function modifyText(key, value) {
    let modified = { ...entityItem };
    modified[key] = value;
    setEntityItem(modified);
    onModifyItem("eventActions", modified, eaIndex);
  }

  function modifyInputText(index, value) {
    let modified = { ...entityItem };
    modified.inputList[index].theText = value;
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
          Input Prompt
        </Typography>

        <div className="spacer" />

        <TextField
          value={entityItem.mainText}
          label={"Main Text"}
          onChange={(e) => modifyText("mainText", e.target.value)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          fullWidth
          multiline={true}
          sx={{
            backgroundColor:
              !disabled && brokenIDs.includes(eaGUID)
                ? "rgba(255, 0, 0, 0.2)"
                : "",
            borderRadius: "5px",
          }}
        />

        <div className="spacer1" />

        <TextField
          value={entityItem.failText}
          label={"Fail Text"}
          onChange={(e) => modifyText("failText", e.target.value)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          fullWidth
          multiline={true}
        />

        <div className="spacer1" />

        {entityItem.inputList.length > 0 && (
          <>
            <Typography variant="button">{`${entityItem.inputList.length} Button(s)`}</Typography>

            {entityItem.inputList.map((item, index) => (
              <div key={index}>
                <div className="spacer1" />

                <TextField
                  value={item.theText}
                  label={`Input Text [${index + 1}]`}
                  onChange={(e) => modifyInputText(index, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  disabled={disabled}
                  fullWidth
                  multiline={true}
                  sx={{
                    backgroundColor:
                      !disabled && brokenIDs.includes(item.GUID)
                        ? "rgba(255, 0, 0, 0.2)"
                        : "",
                    borderRadius: "5px",
                  }}
                />
              </div>
            ))}
          </>
        )}
      </Paper>
    </>
  );
}

InputPrompt.propTypes = {
  eaItem: PropTypes.object,
  disabled: PropTypes.bool,
  brokenIDs: PropTypes.array,
  eaGUID: PropTypes.string,
  onModifyItem: PropTypes.func,
  eaIndex: PropTypes.number,
};
