//mui
import { Typography } from "@mui/material";
import {
  saveFile,
  createBonusEffectsList,
  downloadSource,
} from "../utils/core";
//libraries
import { jsonrepair } from "jsonrepair";
//my components
import CommonLayout from "../components/CommonLayout";
import ToastMessage from "../components/ToastMessage";
import TextInput from "../components/TextInput";
import DialogBox from "../components/DialogBox";
//react
import { useState } from "react";
//source data
import bonusEffectData from "../translationdata/bonuseffects.json";
import enemyDataRaw from "../translationdata/enemies.json?raw";
import villainDataRaw from "../translationdata/villains.json?raw";

//the enemy data for name lookup
let enemyData, villainData;

//repair the source data
try {
  enemyData = JSON.parse(jsonrepair(enemyDataRaw));
  villainData = JSON.parse(jsonrepair(villainDataRaw));
} catch (err) {
  DialogBox.ShowGenericDialog(
    "JSON Repair Error",
    "There was an error when repairing the JSON data: " + err
  );
}

//source data formatted for the tree view
let sourceDataTreeList = createBonusEffectsList(bonusEffectData, [
  ...enemyData,
  ...villainData,
]);

//make a unique copy of the source data for defaults
let exportedData = JSON.parse(JSON.stringify(bonusEffectData)); //the actual data that is saved to file
let selectedTreeIndex = -1;

export default function BonusEffects() {
  //selected source item in the tree
  const [selectedSourceItem, setSelectedSourceItem] = useState(null);
  //selected translated item in the tree
  const [selectedTranslatedItem, setSelectedTranslatedItem] = useState(null);
  //item selected in the tree view
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleItemSelectionToggle = (event, itemId, isSelected) => {
    if (isSelected) {
      setDisableSaveButton(false);
      selectedTreeIndex = itemId;
      setSelectedSourceItem(sourceDataTreeList[selectedTreeIndex]);
      setSelectedTranslatedItem(exportedData[selectedTreeIndex]);
    }
  };

  function onFileDropped(fileInfo, fileContent) {
    if (fileInfo.name != "bonuseffects.json") {
      ToastMessage.showToast(
        "The imported filename doesn't match the expected data set: bonuseffects.json"
      );
      return;
    }
    // console.log("🚀 ~ onFileDropped ~ fileContent:", fileContent);
    // console.log("🚀 ~ onFileDropped ~ fileInfo:", fileInfo);
    setDisableSaveButton(true);
    setSelectedSourceItem(null);
    setSelectedTranslatedItem(null);
    CommonLayout.SelectTreeNone();

    let result = "";
    try {
      let importedData = JSON.parse(jsonrepair(fileContent));
      exportedData = JSON.parse(JSON.stringify(importedData));
      result = `Data imported: ${fileInfo.name}`;
    } catch (error) {
      result = "There was an error importing the data: " + error;
      console.log("🚀 ~ onFileDropped ~ error:", error);
    } finally {
      ToastMessage.showToast(result);
    }
  }

  function onSaveFile() {
    saveFile(exportedData, "bonuseffects.json", (m) =>
      ToastMessage.showToast(m)
    );
  }

  function onTextUpdated(updatedText, index) {
    //update the translation source
    exportedData[selectedTreeIndex].effects[index] = updatedText;
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
            resolve(downloadSource("bonuseffects", "English (EN)", true, ""));
          })
        );
      }

      if (task.getTranslation) {
        promises.push(
          new Promise((resolve) => {
            resolve(downloadSource("bonuseffects", language, true, ""));
          })
        );
      }

      let promise = await Promise.all(promises);

      if (task.getSource && !task.getTranslation) {
        //set the source
        sourceDataTreeList = createBonusEffectsList(promise[0], [
          ...enemyData,
          ...villainData,
        ]);
        exportedData = promise[0];
      } else if (task.getSource && task.getTranslation) {
        //set both
        sourceDataTreeList = createBonusEffectsList(promise[0], [
          ...enemyData,
          ...villainData,
        ]);
        exportedData = promise[1];
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
      treeViewList={sourceDataTreeList}
      handleItemSelectionToggle={handleItemSelectionToggle}
      projectTitle={"BONUS EFFECTS"}
      onSave={onSaveFile}
      drawerWidth={340}
      onDownloadLatest={doWork}
      isBusy={busy}
    >
      {/* TRANSLATED PANEL */}
      <div
        style={{ flexGrow: "1", marginRight: ".5rem" }}
        className={busy ? "missionDialogDisabled" : ""}
      >
        {selectedTranslatedItem &&
          selectedTranslatedItem.effects.length === 0 && (
            <Typography variant="p">This item has no Effects.</Typography>
          )}
        {selectedTranslatedItem &&
          selectedTranslatedItem.effects.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <Typography variant="p">{selectedSourceItem.label}</Typography>
            </div>
          )}

        {selectedTranslatedItem &&
          selectedTranslatedItem.effects.length > 0 &&
          selectedTranslatedItem.effects.map((item, index) => (
            <TextInput
              key={Math.random()}
              label={"Effect"}
              disabled={false}
              intialValue={selectedTranslatedItem.effects[index]}
              onTextUpdated={(e) => onTextUpdated(e, index)}
              multiline={item.split(" ").length >= 4}
            />
          ))}
      </div>

      {/* ENGLISH SOURCE PANEL */}
      <div style={{ flexGrow: "1", marginLeft: ".5rem" }}>
        {!selectedSourceItem && (
          <Typography variant="p">Select an item to translate.</Typography>
        )}
        {selectedSourceItem && selectedSourceItem.data.effects.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <Typography>Source</Typography>
          </div>
        )}
        {selectedSourceItem &&
          selectedSourceItem.data.effects.length > 0 &&
          selectedSourceItem.data.effects.map((item, index) => (
            <TextInput
              key={Math.random()}
              label={"Effect"}
              disabled={true}
              intialValue={selectedSourceItem.data.effects[index]}
              multiline={item.split(" ").length >= 4}
            />
          ))}
      </div>
    </CommonLayout>
  );
}
