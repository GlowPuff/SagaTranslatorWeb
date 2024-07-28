//mui
import { Typography } from "@mui/material";
import { saveFile, createHelpOverlayList } from "../utils/core";
import { fixHelpOverlay } from "../utils/datavalidation";
//libraries
import { jsonrepair } from "jsonrepair";
//my components
import CommonLayout from "../components/CommonLayout";
import ToastMessage from "../components/ToastMessage";
import DialogBox from "../components/DialogBox";
//react
import { useState } from "react";
//source data
import helpDataRaw from "../translationdata/help.json?raw";
import HelpItem from "../components/HelpItem";

let helpData; //the repaired json from helpDataRaw
let selectedTreeIndex = -1;
let exportedData; //the saved data
let brokenIDs = [];

//repair the source data
try {
  helpData = JSON.parse(jsonrepair(helpDataRaw));
  exportedData = JSON.parse(JSON.stringify(helpData));
  //sort the exported data
  sortHelpData(exportedData);
  sortHelpData(helpData);
} catch (err) {
  console.error("JSON repair error: ", err);
  DialogBox.ShowGenericDialog(
    "JSON Repair Error",
    "There was an error when repairing the JSON data: " + err
  );
}

let sourceDataTreeList = createHelpOverlayList(helpData);

function sortHelpData(helpArray) {
  // sort by label
  helpArray = helpArray.sort((a, b) =>
    a.panelHelpID < b.panelHelpID ? -1 : a.panelHelpID > b.panelHelpID ? 1 : 0
  );
  //after sorting, sort their helpItems by name (id)
  for (let index = 0; index < helpArray.length; index++) {
    helpArray[index].helpItems = helpArray[index].helpItems.sort((a, b) =>
      a.id < b.id ? -1 : a.id > b.id ? 1 : 0
    );
  }
}

export default function HelpOverlay() {
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
    // console.log("🚀 ~ handleItemSelectionToggle ~ exportedData:", exportedData);
  };

  function onFileDropped(fileInfo, fileContent) {
    if (fileInfo.name != "help.json") {
      ToastMessage.showToast(
        "The imported filename doesn't match the expected data set: help.json"
      );
      return;
    }
    // console.log("🚀 ~ onFileDropped ~ fileContent:", fileContent);
    // console.log("🚀 ~ onFileDropped ~ fileInfo:", fileInfo);
    setDisableSaveButton(true);
    setSelectedSourceItem(null);
    setSelectedTranslatedItem(null);
    CommonLayout.SelectTreeNone();
    brokenIDs = [];

    let result = "";
    try {
      //repair the imported data
      let importedData = JSON.parse(jsonrepair(fileContent));
      sortHelpData(importedData);

      const [missingProperties, fixed, broken] = fixHelpOverlay(
        helpData,
        importedData
      );
      brokenIDs = broken;
      console.log("🚀 ~ onFileDropped ~ brokenIDs:", brokenIDs);
      //console.log("🚀 ~ onFileDropped ~ missingProperties:", missingProperties);

      exportedData = fixed;
      sortHelpData(exportedData);
      //console.log("🚀 ~ onFileDropped ~ exportedData:", exportedData);

      if (missingProperties.length > 0) {
        DialogBox.ReportUIErrors(missingProperties, []);
      } else ToastMessage.showToast("Data imported, no errors found");

      setDisableSaveButton(false);

      result = `Data imported: ${fileInfo.name}`;
    } catch (error) {
      result = "There was an error importing the data: " + error;
      console.log("🚀 ~ onFileDropped ~ error:", error);
    } finally {
      ToastMessage.showToast(result);
    }
  }

  function onSaveFile() {
    saveFile(exportedData, "help.json", (m) => ToastMessage.showToast(m));
  }

  function onItemUpdated(helpIndex, itemIndex, value) {
    //update the translation data
    exportedData[helpIndex].helpItems[itemIndex].helpText = value;
  }

  return (
    <CommonLayout
      disableSaveButton={disableSaveButton}
      onFileDropped={onFileDropped}
      treeViewList={sourceDataTreeList}
      handleItemSelectionToggle={handleItemSelectionToggle}
      projectTitle={"HELP OVERLAY"}
      onSave={onSaveFile}
    >
      {/* TRANSLATED PANEL */}
      <div style={{ flexGrow: "1", marginRight: ".5rem" }}>
        {selectedTranslatedItem && (
          <HelpItem
            key={selectedTranslatedItem.panelHelpID}
            title={selectedTranslatedItem.panelHelpID}
            helpItem={selectedTranslatedItem}
            onItemUpdated={(helpIndex, itemIndex, value) =>
              onItemUpdated(helpIndex, itemIndex, value)
            }
            helpIndex={selectedSourceItem.id}
            brokenIDs={brokenIDs}
          />
        )}
      </div>

      {/* ENGLISH SOURCE PANEL */}
      <div style={{ flexGrow: "1", marginLeft: ".5rem" }}>
        {!selectedSourceItem && (
          <Typography variant="p">Select an item to translate.</Typography>
        )}
        {selectedSourceItem && (
          <HelpItem
            key={selectedSourceItem.label}
            helpItem={selectedSourceItem}
            disabled={true}
            helpIndex={selectedSourceItem.id}
          />
        )}
      </div>
    </CommonLayout>
  );
}
