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
  downloadSource,
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
import sourceDataRaw from "../translationdata/ui.json";
import { jsonrepair } from "jsonrepair";

//variables
let selectedTreeIndex = -1;
let sourceData = sourceDataRaw; //copy the import so it can be changed
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
  const [busy, setBusy] = useState(false);

  function onFileDropped(fileInfo, fileContent) {
    if (fileInfo.name != "ui.json") {
      ToastMessage.showToast(
        "The imported filename doesn't match the expected filename: ui.json"
      );
      return;
    }

    setSelectedSourceItem(null);
    setSelectedTranslatedItem(null);
    setDisableSaveButton(true);
    CommonLayout.SelectTreeNone();

    fixImport(JSON.parse(jsonrepair(fileContent)));

    setLanguage(exportedData.languageID);
    sortData(exportedData);
    setDisableSaveButton(false);
  }

  //fix imported data, add missing props, report any errors, set exportedData
  function fixImport(importedData) {
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

  async function doWork({ language, task }) {
    setSelectedSourceItem(null);
    setSelectedTranslatedItem(null);
    CommonLayout.SelectTreeNone();
    setBusy(true);

    try {
      let promises = [];
      if (task.getSource) {
        promises.push(
          new Promise((resolve) => {
            resolve(downloadSource("ui", "English (EN)", true, ""));
          })
        );
      }

      if (task.getTranslation) {
        promises.push(
          new Promise((resolve) => {
            resolve(downloadSource("ui", language, true, ""));
          })
        );
      }

      let promise = await Promise.all(promises);

      if (task.getSource && !task.getTranslation) {
        //set the source
        sourceData = promise[0];
        sortData(sourceData);
        sourceDataTreeList = createUIList(sourceData);
        exportedData = defaultsDeep(promise[0], sourceData);
        setLanguage(exportedData.languageID);
      } else if (task.getSource && task.getTranslation) {
        //set both
        sourceData = promise[0];
        sortData(sourceData);
        sourceDataTreeList = createUIList(sourceData);
        fixImport(promise[1]);//this func also sets the 'exportedData' property with the fixed import
        sortData(exportedData);
        setLanguage(exportedData.languageID);
      }

      ToastMessage.showToast("Successfully downloaded the requested data.");
    } catch (error) {
      console.log("🚀 ~ onDownloadLatest ~ error:", error);
      DialogBox.ShowGenericError(
        "Downloading Error",
        "There was an error trying to download the requested data.",
        error.message
      );
    } finally {
      setBusy(false);
    }
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
      onDownloadLatest={doWork}
      isBusy={busy}
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
