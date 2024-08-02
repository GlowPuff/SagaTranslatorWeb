import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Paper, Typography } from "@mui/material";

export default function HelpItem({
  helpItem,
  onItemUpdated,
  title,
  disabled = false,
  helpIndex,
  brokenIDs,
}) {
  const [itemArray, setItemArray] = useState(helpItem.helpItems);

  function updateItem(itemIndex, value) {
    helpItem.helpItems[itemIndex].helpText = value;
    let temp = [...itemArray];
    temp[itemIndex].helpText = value;
    setItemArray(temp);
    onItemUpdated(helpIndex, itemIndex, value);
  }

  return (
    <>
      {title ? (
        <div style={{ marginBottom: "1rem" }}>
          <Typography >{title}</Typography>
        </div>
      ) : (
        <div style={{ marginBottom: "1rem" }}>
          <Typography >Source</Typography>
        </div>
      )}

      {itemArray.map((item, index) => (
        <div key={item.id}>
          <Paper
            key={helpItem.panelHelpID}
            sx={{ padding: "1rem", marginBottom: "1rem" }}
          >
            <Typography
              variant="button"
              sx={{
                color:
                  !disabled && brokenIDs.includes(item.id) ? "red" : "#6dcaf2",
              }}
            >
              {item.id}
            </Typography>
            <TextField
              value={item.helpText}
              onChange={(e) => updateItem(index, e.target.value)}
              onFocus={(e) => e.target.select()}
              disabled={disabled}
              fullWidth
              multiline={true}
            />
          </Paper>
        </div>
      ))}
    </>
  );
}

HelpItem.propTypes = {
  helpItem: PropTypes.object,
  onItemUpdated: PropTypes.func,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  helpIndex: PropTypes.string,
  brokenIDs: PropTypes.array,
};
