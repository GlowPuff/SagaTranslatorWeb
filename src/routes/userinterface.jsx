//lodash
import defaultsDeep from "lodash/defaultsDeep";
import isObject from "lodash/isObject";
//mui
import { Typography } from "@mui/material";
//my library
import {
  getMissingPropertiesDeep,
  removeMissingPropertiesDeep,
  saveFile,
  createUIList,
} from "../utils/core";
// import { fixUI } from "../utils/datavalidation";
//my components
import ToastMessage from "../components/ToastMessage";
import CommonLayout from "../components/CommonLayout";
import UICategory from "../components/UICategory";
import DialogBox from "../components/DialogBox";
//react
import { useState } from "react";
//source data
import sourceData from "../translationdata/ui.json";

//variables
let selectedTreeIndex = -1;
//sort the source data by property name
sortData(sourceData);
let sourceDataTreeList = createUIList(sourceData);
//assign defaults to the exported data
let exportedData = JSON.parse(JSON.stringify(sourceData));

function sortData(dataObj) {
  //sort the data by root object property name
  Object.entries(dataObj)
    .sort(([keyA], [keyB]) => keyA > keyB)
    .reduce((obj, [key, value]) => Object.assign(obj, { [key]: value }), {});

  //then sort each root item's children props
  for (const key in dataObj) {
    if (isObject(dataObj[key])) {
      Object.entries(dataObj)
        .sort(([keyA], [keyB]) => keyA > keyB)
        .reduce(
          (obj, [key, value]) => Object.assign(obj, { [key]: value }),
          {}
        );
    }
  }
}

function sortDataArray(dataObj) {
  let copy = JSON.parse(JSON.stringify(dataObj));

  copy.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return copy;
}

export default function UserInterface() {
  //selected source item in the tree
  const [selectedSourceItem, setSelectedSourceItem] = useState(null);
  //selected translated item in the tree
  const [selectedTranslatedItem, setSelectedTranslatedItem] = useState(null);
  const [language, setLanguage] = useState("English (EN)");
  const [disableSaveButton, setDisableSaveButton] = useState(false);

  function onFileDropped(fileInfo, fileContent) {
    // console.log("🚀 ~ onFileDropped ~ fileContent:", fileContent);
    // console.log("🚀 ~ onFileDropped ~ fileInfo:", fileInfo);
    setSelectedSourceItem(null);
    setSelectedTranslatedItem(null);
    setDisableSaveButton(true);
    CommonLayout.SelectTreeNone();

    // importedFilename = fileInfo.name;
    let importedData = JSON.parse(fileContent);

    //first, report any missing properties as array of strings
    const missingProperties = getMissingPropertiesDeep(
      sourceData,
      importedData
    );
    //console.log("🚀 ~ missingProperties:", missingProperties);

    //second, deep merge the source (defaults) data into the loaded translation data, keeping any existing translated values intact
    exportedData = defaultsDeep(importedData, sourceData);

    //third, remove any properties that don't exist in the source data
    let removedProps = removeMissingPropertiesDeep(exportedData, sourceData);
    //console.log("Removed props found: ", removedProps.length);
    //console.log("Missing props found: ", missingProperties.length);

    if (removedProps.length > 0 || missingProperties.length > 0) {
      DialogBox.ReportUIErrors(missingProperties, removedProps);
    } else ToastMessage.showToast("Data imported, no errors found");

    setLanguage(exportedData.languageID);
    sortData(exportedData);
    setDisableSaveButton(false);

    //console.log("🚀 ~ onFileDropped ~ exportedData:", exportedData);
  }

  function setTargetLanguage(language) {
    setLanguage(language);
    exportedData.languageID = language;
  }

  const handleItemSelectionToggle = (event, itemId, isSelected) => {
    if (isSelected) {
      selectedTreeIndex = itemId;

      setSelectedSourceItem({
        id: selectedTreeIndex,
        category: sourceDataTreeList[selectedTreeIndex].label,
        items: sortDataArray(
          Object.entries(
            sourceData[sourceDataTreeList[selectedTreeIndex].label]
          )
        ),
      });

      setSelectedTranslatedItem({
        id: selectedTreeIndex,
        category: sourceDataTreeList[selectedTreeIndex].label,
        items: sortDataArray(
          Object.entries(
            exportedData[sourceDataTreeList[selectedTreeIndex].label]
          )
        ),
      });
    }
  };

  function onSaveFile() {
    saveFile(exportedData, "ui.json", (m) => ToastMessage.showToast(m));
  }

  function onItemUpdated(category, item, value) {
    exportedData[category][item] = value;
  }

  return (
    <CommonLayout
      disableSaveButton={disableSaveButton}
      onFileDropped={onFileDropped}
      treeViewList={sourceDataTreeList}
      handleItemSelectionToggle={handleItemSelectionToggle}
      projectTitle={"USER INTERFACE"}
      onSave={onSaveFile}
      includeLanguageSelector={true}
      language={language}
      onSetLanguage={setTargetLanguage}
    >
      {/* TRANSLATED PANEL */}
      <div style={{ flexGrow: "1", marginRight: ".5rem" }}>
        {selectedTranslatedItem && (
          <UICategory
            key={selectedTranslatedItem.id}
            uiCategory={selectedTranslatedItem}
            onItemUpdated={(cat, item, value) =>
              onItemUpdated(cat, item, value)
            }
          />
        )}
      </div>

      {/* ENGLISH SOURCE PANEL */}
      <div style={{ flexGrow: "1", marginLeft: ".5rem" }}>
        {!selectedSourceItem && (
          <Typography variant="p">Select an item to translate.</Typography>
        )}
        {selectedSourceItem && (
          <UICategory
            key={selectedSourceItem.id}
            uiCategory={selectedSourceItem}
            disabled
          />
        )}
      </div>
    </CommonLayout>
  );
}
