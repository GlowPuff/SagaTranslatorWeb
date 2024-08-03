//mui
import { Typography } from "@mui/material";
import {
  createDeploymentList,
  findObjectById,
  saveFile,
  downloadSource,
} from "../utils/core";
//libraries
import { jsonrepair } from "jsonrepair";
//my components
import CommonLayout from "../components/CommonLayout";
import ToastMessage from "../components/ToastMessage";
import DialogBox from "../components/DialogBox";
import EnemyGroup from "../components/EnemyGroup";
//react
import { useState } from "react";
//source data
import allyDataRaw from "../translationdata/DeploymentGroups/allies.json?raw";
import enemyDataRaw from "../translationdata/DeploymentGroups/enemies.json?raw";
import heroDataRaw from "../translationdata/DeploymentGroups/heroes.json?raw";
import villainDataRaw from "../translationdata/DeploymentGroups/villains.json?raw";

//source data formatted for the tree view
let sourceDataTreeList;
let allies, heroes, enemy, villains;
//repair the source data
try {
  allies = JSON.parse(jsonrepair(allyDataRaw));
  heroes = JSON.parse(jsonrepair(heroDataRaw));
  enemy = JSON.parse(jsonrepair(enemyDataRaw));
  villains = JSON.parse(jsonrepair(villainDataRaw));
  sourceDataTreeList = createDeploymentList([allies, heroes, enemy, villains]);
} catch (error) {
  DialogBox.ShowGenericError(
    "JSON Repair Error",
    "There was an error when repairing the JSON data.",
    error.message
  );
}

//make a unique copy of the source data for defaults
//translatedDataTreeList is formatted for the tree view
let translatedDataTreeList = JSON.parse(JSON.stringify(sourceDataTreeList));
let selectedTreeIndex = -1;
let selectedGroupIndex = -1;

export default function DeploymentCard() {
  //selected source item in the tree
  const [selectedSourceItem, setSelectedSourceItem] = useState(null);
  //selected translated item in the tree
  const [selectedTranslatedItem, setSelectedTranslatedItem] = useState(null);
  const [disableSaveButton, setDisableSaveButton] = useState(true);
  const [exportFilename, setExportFilename] = useState("");
  const [dropDisabled, setDropDisabled] = useState(true);
  const [dropMessage, setDropMessage] = useState(
    "Select a group type for the data you want to import."
  );
  const [projectTitle, setProjectTitle] = useState("");
  const [busy, setBusy] = useState(false);

  const handleItemSelectionToggle = (event, itemId, isSelected) => {
    //process root tree item (group data set: allies, enemies, etc)
    if (isSelected && Number.parseInt(itemId) < 4) {
      setDropMessage("Select a ");
      selectedTreeIndex = itemId;
      setDisableSaveButton(false);
      setDropDisabled(false);

      setExportFilename(sourceDataTreeList[itemId].filename);
      setProjectTitle(" - " + sourceDataTreeList[itemId].label);

      setSelectedSourceItem(null);
      setSelectedTranslatedItem(null);
    }

    //process selected group
    if (isSelected && Number.parseInt(itemId) > 3) {
      setDropMessage("Drag and drop the file here to open it.");
      setDisableSaveButton(false);
      setDropDisabled(false);

      let sItem = findObjectById(sourceDataTreeList, itemId);
      let tItem = findObjectById(translatedDataTreeList, itemId);
      let parent = findObjectById(sourceDataTreeList, tItem.parentID);

      selectedTreeIndex = tItem.parentID;
      selectedGroupIndex = tItem.arrayIndex;
      setExportFilename(parent.filename);
      setProjectTitle(" - " + parent.label);

      setSelectedSourceItem(sItem);
      setSelectedTranslatedItem(tItem);
    }
  };

  function onFileDropped(fileInfo, fileContent) {
    if (fileInfo.name != exportFilename) {
      ToastMessage.showToast(
        `The imported filename doesn't match the expected data set: ${exportFilename}`
      );
      return;
    }
    setDisableSaveButton(true);
    setSelectedSourceItem(null);
    setSelectedTranslatedItem(null);
    CommonLayout.SelectTreeNone();

    let result = "";
    try {
      //repair the imported data
      let importedData = JSON.parse(jsonrepair(fileContent));
      //set the imported data into the existing translation array data
      for (let index = 0; index < importedData.length; index++) {
        translatedDataTreeList[selectedTreeIndex].data[index] =
          importedData[index];
        translatedDataTreeList[selectedTreeIndex].children[index].data =
          importedData[index];
      }
      result = `Data imported: ${fileInfo.name}`;
    } catch (error) {
      result = "There was an error importing the data: " + error;
      console.log("🚀 ~ onFileDropped ~ error:", error);
    } finally {
      ToastMessage.showToast(result);
    }
  }

  function onSaveFile() {
    if (selectedTreeIndex == -1) return;

    let exportedData = translatedDataTreeList[selectedTreeIndex].data;
    saveFile(exportedData, exportFilename, (m) => ToastMessage.showToast(m));
  }

  function onGroupUpdated(updatedGroup) {
    //update the translation source
    translatedDataTreeList[selectedTreeIndex].data[selectedGroupIndex] =
      updatedGroup;
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
            resolve(downloadSource("allies", "English (EN)", true, ""));
          })
        );
        promises.push(
          new Promise((resolve) => {
            resolve(downloadSource("heroes", "English (EN)", true, ""));
          })
        );
        promises.push(
          new Promise((resolve) => {
            resolve(downloadSource("enemies", "English (EN)", true, ""));
          })
        );
        promises.push(
          new Promise((resolve) => {
            resolve(downloadSource("villains", "English (EN)", true, ""));
          })
        );
      }

      if (task.getTranslation) {
        promises.push(
          new Promise((resolve) => {
            resolve(downloadSource("allies", language, true, ""));
          })
        );
        promises.push(
          new Promise((resolve) => {
            resolve(downloadSource("heroes", language, true, ""));
          })
        );
        promises.push(
          new Promise((resolve) => {
            resolve(downloadSource("enemies", language, true, ""));
          })
        );
        promises.push(
          new Promise((resolve) => {
            resolve(downloadSource("villains", language, true, ""));
          })
        );
      }

      let promise = await Promise.all(promises);

      if (task.getSource && !task.getTranslation) {
        //set the source
        allies = promise[0];
        heroes = promise[1];
        enemy = promise[2];
        villains = promise[3];

        sourceDataTreeList = createDeploymentList([
          allies,
          heroes,
          enemy,
          villains,
        ]);
        translatedDataTreeList = JSON.parse(JSON.stringify(sourceDataTreeList));
      } else if (task.getSource && task.getTranslation) {
        //set both
        allies = promise[0];
        heroes = promise[1];
        enemy = promise[2];
        villains = promise[3];
        sourceDataTreeList = createDeploymentList([
          allies,
          heroes,
          enemy,
          villains,
        ]);
        //set the imported data into the existing translation array data
        for (let rootIndex = 0; rootIndex < 4; rootIndex++) {
          for (let index = 0; index < promise[4 + rootIndex].length; index++) {
            translatedDataTreeList[rootIndex].data[index] =
              promise[4 + rootIndex][index];
            translatedDataTreeList[rootIndex].children[index].data =
              promise[4 + rootIndex][index];
          }
        }
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
      dropDisabled={dropDisabled}
      onFileDropped={onFileDropped}
      treeViewList={sourceDataTreeList}
      handleItemSelectionToggle={handleItemSelectionToggle}
      projectTitle={"DEPLOYMENT CARD TEXT " + projectTitle}
      dropMessage={dropMessage}
      onSave={onSaveFile}
      onDownloadLatest={doWork}
      isBusy={busy}
    >
      {/* TRANSLATED PANEL */}
      <div style={{ flexGrow: "1", marginRight: ".5rem" }}>
        {selectedTranslatedItem && (
          <EnemyGroup
            key={selectedTranslatedItem.id}
            groupData={selectedTranslatedItem.data}
            onGroupUpdated={(g) => onGroupUpdated(g)}
          />
        )}
      </div>

      {/* ENGLISH SOURCE PANEL */}
      <div style={{ flexGrow: "1", marginLeft: ".5rem" }}>
        {!selectedSourceItem && (
          <Typography variant="p">Select an item to translate.</Typography>
        )}
        {selectedSourceItem && (
          <EnemyGroup
            key={selectedSourceItem.id}
            groupData={selectedSourceItem.data}
            disabled={true}
          />
        )}
      </div>
    </CommonLayout>
  );
}
