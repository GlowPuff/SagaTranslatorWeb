import { useState } from "react";
import PropTypes from "prop-types";
import { TextField } from "@mui/material";

export default function UICategory({ uiCategory, onItemUpdated, disabled }) {
  const [itemArray, setItemArray] = useState(uiCategory.items);

  function updateItem(index, value) {
    uiCategory.items[index][1] = value;
    let temp = [...itemArray];
    temp[index][1] = value;
    setItemArray(temp);
    onItemUpdated(uiCategory.category, uiCategory.items[index][0], value);
  }

  return (
    <>
      {itemArray.map((item, index) => (
        <div key={index}>
          <TextField
            label={item[0]}
            key={index}
            value={item[1]}
            onChange={(e) => updateItem(index, e.target.value)}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            fullWidth
            multiline={true}
            sx={{ marginBottom: "1rem" }}
          />
        </div>
      ))}
    </>
  );
}

UICategory.propTypes = {
  uiCategory: PropTypes.object,
  onItemUpdated: PropTypes.func,
  disabled: PropTypes.bool,
};
