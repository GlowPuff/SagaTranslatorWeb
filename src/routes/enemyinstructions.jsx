//mui
import { Typography } from "@mui/material";
import { createInstructionList, saveFile } from "../utils/core";
//libraries
import { jsonrepair } from "jsonrepair";
//my components
import CommonLayout from "../components/CommonLayout";
import ToastMessage from "../components/ToastMessage";
import DialogBox from "../components/DialogBox";
import EnemyInstruction from "../components/EnemyInstruction";
//react
import { useState } from "react";
//source data
import instructionDataRaw from "../translationdata/instructions.json?raw";

//source data formatted for the tree view
let sourceDataTreeList;
//raw instruction json object
let instructionData;
//repair the source data
try {
  instructionData = JSON.parse(jsonrepair(instructionDataRaw));
  sourceDataTreeList = createInstructionList(instructionData);
  //console.log("🚀 ~ sourceDataTreeList:", sourceDataTreeList);
} catch (error) {
  //console.error("JSON repair error: ", error);
  DialogBox.ShowGenericDialog(
    "JSON Repair Error",
    "There was an error when repairing the JSON data: " + error
  );
}

//make a unique copy of the source data for defaults
//translatedDataList is formatted for the tree view
let exportedData = JSON.parse(JSON.stringify(instructionData)); //the actual data that is saved to file
let selectedTreeIndex = -1;

export default function EnemyInstructions() {
  //selected source item in the tree
  const [selectedSourceItem, setSelectedSourceItem] = useState(null);
  //selected translated item in the tree
  const [selectedTranslatedItem, setSelectedTranslatedItem] = useState(null);
  const [disableSaveButton, setDisableSaveButton] = useState(false);

  const handleItemSelectionToggle = (event, itemId, isSelected) => {
    if (isSelected) {
      setDisableSaveButton(false);
      selectedTreeIndex = itemId;
      setSelectedSourceItem(sourceDataTreeList[selectedTreeIndex]);
      setSelectedTranslatedItem(exportedData[selectedTreeIndex]);
    }
  };

  function onFileDropped(fileInfo, fileContent) {
    if (fileInfo.name != "instructions.json") {
      ToastMessage.showToast(
        "The imported filename doesn't match the expected data set: instructions.json"
      );
      return;
    }
    setSelectedSourceItem(null);
    setSelectedTranslatedItem(null);
    CommonLayout.SelectTreeNone();

    let result = "";
    try {
      //repair the imported data
      exportedData = JSON.parse(jsonrepair(fileContent));
      result = `Data imported: ${fileInfo.name}`;
    } catch (error) {
      result = "There was an error importing the data: " + error;
      console.log("🚀 ~ onFileDropped ~ error:", error);
    } finally {
      ToastMessage.showToast(result);
    }
  }

  function onSaveFile() {
    saveFile(exportedData, "instructions.json", (m) =>
      ToastMessage.showToast(m)
    );
  }

  function onInstructionUpdated(instruction) {
    exportedData[selectedTreeIndex] = instruction;
  }

  return (
    <CommonLayout
      disableSaveButton={disableSaveButton}
      onFileDropped={onFileDropped}
      treeViewList={sourceDataTreeList}
      fileName={"instructions.json"}
      projectTitle={"ENEMY INSTRUCTIONS"}
      handleItemSelectionToggle={handleItemSelectionToggle}
      onSave={onSaveFile}
    >
      {/* TRANSLATED PANEL */}
      <div style={{ flexGrow: "1", marginRight: ".5rem" }}>
        {selectedTranslatedItem && (
          <EnemyInstruction
            key={selectedTranslatedItem.instID}
            instruction={selectedTranslatedItem}
            onInstructionUpdated={(e) => onInstructionUpdated(e)}
          />
        )}
      </div>

      {/* ENGLISH SOURCE PANEL */}
      <div style={{ flexGrow: "1", marginLeft: ".5rem" }}>
        {!selectedSourceItem && (
          <Typography variant="p">Select an item to translate.</Typography>
        )}
        {selectedSourceItem && (
          <EnemyInstruction
            key={selectedSourceItem.id}
            instruction={selectedSourceItem.data}
            disabled={true}
          />
        )}
      </div>
    </CommonLayout>
  );
}
