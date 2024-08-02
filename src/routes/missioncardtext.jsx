//mui
import { Typography } from "@mui/material";
//my library
import {
  saveFile,
  createMissionCardList,
  findObjectById,
  downloadSource,
} from "../utils/core";
//libraries
import { jsonrepair } from "jsonrepair";
//my components
import ToastMessage from "../components/ToastMessage";
import CommonLayout from "../components/CommonLayout";
import MissionCardItem from "../components/MissionCardItem";
import DialogBox from "../components/DialogBox";
//react
import { useState } from "react";
//source data
import coreData from "../translationdata/MissionCardText/core.json";
import twinData from "../translationdata/MissionCardText/twin.json";
import bespinData from "../translationdata/MissionCardText/bespin.json";
import empireData from "../translationdata/MissionCardText/empire.json";
import hothData from "../translationdata/MissionCardText/hoth.json";
import jabbaData from "../translationdata/MissionCardText/jabba.json";
import lothalData from "../translationdata/MissionCardText/lothal.json";
import otherData from "../translationdata/MissionCardText/other.json";
//variables
let sourceTree = [
  { id: "0", label: "Core", data: coreData, filename: "core.json" },
  { id: "1", label: "Twin", data: twinData, filename: "twin.json" },
  { id: "2", label: "Bespin", data: bespinData, filename: "bespin.json" },
  { id: "3", label: "Empire", data: empireData, filename: "empire.json" },
  { id: "4", label: "Hoth", data: hothData, filename: "hoth.json" },
  { id: "5", label: "Jabba", data: jabbaData, filename: "jabba.json" },
  { id: "6", label: "Lothal", data: lothalData, filename: "lothal.json" },
  { id: "7", label: "Other", data: otherData, filename: "other.json" },
];

//specially formatted for tree view
const sourceData = createMissionCardList(sourceTree);
//make a unique copy of the source data for defaults
// let translatedData = JSON.parse(JSON.stringify(sourceData));
//array of ALL data sets
let exportedDataArray = [
  JSON.parse(JSON.stringify(coreData)),
  JSON.parse(JSON.stringify(twinData)),
  JSON.parse(JSON.stringify(bespinData)),
  JSON.parse(JSON.stringify(empireData)),
  JSON.parse(JSON.stringify(hothData)),
  JSON.parse(JSON.stringify(jabbaData)),
  JSON.parse(JSON.stringify(lothalData)),
  JSON.parse(JSON.stringify(otherData)),
];
let selectedTreeIndex = -1; //root expansion dataset index (core, twin, etc)
let itemArrayIndex = -1; //index into the selected dataset's currently selected mission item
let expectedFilename = "";

export default function MissionCardText() {
  const [disableDrop, setDisableDrop] = useState(true);
  const [selectedExpansionTitle, setSelectedExpansionTitle] = useState("");
  //selected source item in the tree
  const [selectedSourceItem, setSelectedSourceItem] = useState(null);
  //selected translated item in the tree
  const [selectedTranslatedItem, setSelectedTranslatedItem] = useState(null);
  const [disableSaveButton, setDisableSaveButton] = useState(true);
  const [busy, setBusy] = useState(false);

  const handleItemSelectionToggle = (event, itemId, isSelected) => {
    setDisableDrop(true);

    //process root tree item (expansion name)
    if (isSelected && Number.parseInt(itemId) <= 7) {
      setDisableSaveButton(false);
      setDisableDrop(false);
      selectedTreeIndex = itemId;
      itemArrayIndex = -1;
      setSelectedExpansionTitle(" - " + sourceData[selectedTreeIndex].label);
      expectedFilename = sourceData[selectedTreeIndex].filename;
    }

    //or process the selected Mission item
    if (isSelected && Number.parseInt(itemId) > 7) {
      let sItem = findObjectById(sourceData, itemId);
      itemArrayIndex = sItem.arrayIndex;
      expectedFilename = sItem.filename;
      selectedTreeIndex = sItem.parentID;

      setSelectedSourceItem(sItem.dataItem);
      setSelectedTranslatedItem(
        exportedDataArray[selectedTreeIndex][itemArrayIndex]
      );

      setSelectedExpansionTitle(" - " + sItem.parentLabel);
      setDisableSaveButton(false);
      setDisableDrop(false);
    }
  };

  function onFileDropped(fileInfo, fileContent) {
    if (fileInfo.name != expectedFilename) {
      ToastMessage.showToast(
        `The imported filename doesn't match the expected filename: ${expectedFilename}`
      );
      return;
    }
    setSelectedSourceItem(null);
    setSelectedTranslatedItem(null);
    CommonLayout.SelectTreeNone();
    let result = "";
    try {
      //repair and parse the imported data
      let importedData = JSON.parse(jsonrepair(fileContent));
      exportedDataArray[selectedTreeIndex] = importedData;
      result = `Data imported: ${fileInfo.name}`;
    } catch (error) {
      result = "There was an error importing the data: " + error;
      console.log("🚀 ~ onFileDropped ~ error:", error);
    } finally {
      ToastMessage.showToast(result);
    }
  }

  function onMissionUpdated(value) {
    exportedDataArray[selectedTreeIndex][itemArrayIndex] = value;
  }

  function onSaveFile() {
    saveFile(exportedDataArray[selectedTreeIndex], expectedFilename, (m) =>
      ToastMessage.showToast(m)
    );
  }

  async function doWork({ language, task }) {
    setSelectedSourceItem(null);
    setSelectedTranslatedItem(null);
    CommonLayout.SelectTreeNone();
    setDisableSaveButton(true);
    setBusy(true);

    itemArrayIndex = -1;
    selectedTreeIndex = -1;
    expectedFilename = "";

    try {
      let promises = [];
      if (task.getSource) {
        [
          "core.json",
          "twin.json",
          "bespin.json",
          "empire.json",
          "hoth.json",
          "jabba.json",
          "lothal.json",
          "other.json",
        ].forEach((filename) => {
          promises.push(
            new Promise((resolve) => {
              resolve(
                downloadSource(
                  "missioncardtext",
                  "English (EN)",
                  true,
                  filename
                )
              );
            })
          );
        });
      }

      if (task.getTranslation) {
        //these are in order as they appear in the tree
        [
          "core.json",
          "twin.json",
          "bespin.json",
          "empire.json",
          "hoth.json",
          "jabba.json",
          "lothal.json",
          "other.json",
        ].forEach((filename) => {
          promises.push(
            new Promise((resolve) => {
              resolve(
                downloadSource("missioncardtext", language, true, filename)
              );
            })
          );
        });
      }

      let promise = await Promise.all(promises);

      if (task.getSource && !task.getTranslation) {
        //set the source
        for (let index = 0; index < 8; index++) {
          sourceTree[index].data = promise[index];
          exportedDataArray[index] = JSON.parse(JSON.stringify(promise[index]));
        }
      } else if (task.getSource && task.getTranslation) {
        //set both
        for (let index = 0; index < 8; index++) {
          sourceTree[index].data = promise[index];
        }
        for (let index = 0; index < 8; index++) {
          exportedDataArray[index] = JSON.parse(
            JSON.stringify(promise[index + 8])
          );
        }
      }

      ToastMessage.showToast("Successfully downloaded the requested data.");
    } catch (error) {
      console.log("🚀 ~ onDownloadLatest ~ error:", error);
      DialogBox.ShowGenericDialog(
        "Downloading Error",
        "There was an error trying to download the requested data: " + error
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <CommonLayout
      disableSaveButton={disableSaveButton}
      onFileDropped={onFileDropped}
      treeViewList={sourceData}
      handleItemSelectionToggle={handleItemSelectionToggle}
      projectTitle={`MISSION TEXT ${selectedExpansionTitle}`}
      onSave={onSaveFile}
      dropDisabled={disableDrop}
      dropMessage={"Select an Expansion for the data you want to import."}
      onDownloadLatest={doWork}
      isBusy={busy}
    >
      {/* TRANSLATED PANEL */}
      <div style={{ flexGrow: "1", marginRight: ".5rem" }}>
        {selectedTranslatedItem && (
          <MissionCardItem
            key={selectedTranslatedItem.id}
            item={selectedTranslatedItem}
            onMissionUpdated={onMissionUpdated}
          />
        )}
      </div>

      {/* ENGLISH SOURCE PANEL */}
      <div style={{ flexGrow: "1", marginLeft: ".5rem" }}>
        {!selectedSourceItem && (
          <Typography variant="p">Select an item to translate.</Typography>
        )}
        {selectedSourceItem && (
          <MissionCardItem
            key={selectedSourceItem.id}
            item={selectedSourceItem}
            disabled={true}
          />
        )}
      </div>
    </CommonLayout>
  );
}
