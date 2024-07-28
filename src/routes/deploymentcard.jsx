//mui
import { Typography } from "@mui/material";
import { createDeploymentList, findObjectById, saveFile } from "../utils/core";
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
//repair the source data
try {
  const allies = JSON.parse(jsonrepair(allyDataRaw));
  const heroes = JSON.parse(jsonrepair(heroDataRaw));
  const enemy = JSON.parse(jsonrepair(enemyDataRaw));
  const villains = JSON.parse(jsonrepair(villainDataRaw));
  sourceDataTreeList = createDeploymentList([allies, heroes, enemy, villains]);
} catch (error) {
  DialogBox.ShowGenericDialog(
    "JSON Repair Error",
    "There was an error when repairing the JSON data: " + error
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
