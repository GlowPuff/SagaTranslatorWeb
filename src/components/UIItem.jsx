// DEPRECATED

import { useState } from "react";
import PropTypes from "prop-types";
import { TextField } from "@mui/material";

export default function UIItem({ uiCategory, onItemUpdated, sourceData }) {
  const [itemArray, setItemArray] = useState(uiCategory.items);

  //sort the translation by property key
  let sorted = sortData(itemArray);
  console.log("🚀 ~ UIItem ~ sorted:", sorted);

  function sortData(dataObj) {
    let copy = JSON.parse(JSON.stringify(dataObj));

    copy.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
		return copy;
  }

  function updateItem(index, value) {
    uiCategory.items[index][1] = value;
    let temp = [...itemArray];
    temp[index][1] = value;
    setItemArray(temp);
    onItemUpdated(uiCategory.category, uiCategory.items[index][0], value);
  }

  return (
    <>
      {/* TRANSLATION */}
      <div style={{ flexGrow: "1", marginRight: ".5rem" }}>
        {itemArray.map((item, index) => (
          <div key={index}>
            <TextField
              label={item[0]}
              key={index}
              value={item[1]}
              onChange={(e) => updateItem(index, e.target.value)}
              onFocus={(e) => e.target.select()}
              fullWidth
              multiline={true}
              sx={{ marginBottom: "1rem" }}
            />
          </div>
        ))}
      </div>

      {/* ENGLISH SOURCE */}
      <div style={{ flexGrow: "1", marginRight: ".5rem" }}>
        {sourceData.items.map((item, index) => (
          <div key={index}>
            <TextField
              label={item[0]}
              key={index}
              value={item[1]}
              onChange={(e) => updateItem(index, e.target.value)}
              onFocus={(e) => e.target.select()}
              fullWidth
              multiline={true}
              sx={{ marginBottom: "1rem" }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

UIItem.propTypes = {
  uiCategory: PropTypes.object,
  onItemUpdated: PropTypes.func,
  sourceData: PropTypes.object,
};
