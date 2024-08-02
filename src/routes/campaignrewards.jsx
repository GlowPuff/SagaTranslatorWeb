//mui
import Typography from "@mui/material/Typography";
//my library
import {
  findObjectById,
  saveFile,
  createTreeListFromArray,
  downloadSource,
} from "../utils/core";
//libraries
import { jsonrepair } from "jsonrepair";
//my components
import ToastMessage from "../components/ToastMessage";
import TextInput from "../components/TextInput";
import DialogBox from "../components/DialogBox";
import CommonLayout from "../components/CommonLayout";
//react
import { useState } from "react";
//source data
import sourceData from "../translationdata/CampaignData/rewards.json";

//variables
let translatedData = JSON.parse(jsonrepair(JSON.stringify(sourceData))); //data to export, make unique copy of source data
let workingSourceData = sourceData; //copy the imported data so it can later be modified from downloading the latest source
let selectedTreeIndex = -1;

//replace null strings with empty strings
translatedData = translatedData.map((item) => {
  if (!Object.hasOwnProperty.call(item, "extra")) item.extra = "";
  return item;
});

export default function CampaignRewards() {
  const [sourceTreeList, setSourceTreeList] = useState(
    createTreeListFromArray(sourceData)
  );
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const [selectedSourceItemArray, setSelectedSourceItemArray] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [busy, setBusy] = useState(false);

  function onFileDropped(fileInfo, fileContent) {
    if (fileInfo.name != "rewards.json") {
      ToastMessage.showToast(
        "The imported filename doesn't match the expected filename: rewards.json"
      );
      return;
    }

    //clear existing data
    setSelectedSourceItemArray([]);
    setSourceTreeList([]);
    setSelectedTranslation(null);
    setDisableSaveButton(true);
    CommonLayout.SelectTreeNone();

    let importedData;
    try {
      importedData = JSON.parse(jsonrepair(fileContent));
    } catch (error) {
      ToastMessage.showToast(`Error parsing imported file: ${error}`);
      console.log(`Error parsing imported file: ${error}`);
      return;
    }

    //add any properties that don't exist
    let missingData = [];
    for (let index = 0; index < workingSourceData.length; index++) {
      let found = importedData.find(
        (x) => x.id === workingSourceData[index].id
      );
      if (typeof found === "undefined") {
        importedData.splice(index, 0, workingSourceData[index]);
        missingData.push(
          workingSourceData[index].id + " / " + workingSourceData[index].name
        );
      }
    }

    translatedData = importedData;

    setDisableSaveButton(false);

    if (missingData.length > 0) {
      DialogBox.ReportUIErrors(missingData, []);
    } else ToastMessage.showToast("Data imported, no errors found");

    //create the tree view lists
    setSourceTreeList(createTreeListFromArray(workingSourceData));
  }

  const handleItemSelectionToggle = (event, itemId, isSelected) => {
    if (isSelected) {
      let sItem = sourceTreeList.filter((x) => x.id == itemId)[0];
      let tItem = translatedData.filter((x) => x.id == sItem.itemID)[0];
      selectedTreeIndex = itemId;

      if (sItem) {
        setSelectedSourceItemArray([findObjectById(sourceTreeList, itemId)]);
      }

      if (tItem) {
        setSelectedTranslation(tItem);
      }
    }
  };

  async function doWork({ language, task }) {
    setSelectedSourceItemArray([]);
    setSelectedTranslation(null);
    CommonLayout.SelectTreeNone();
    setBusy(true);

    try {
      let promises = [];
      if (task.getSource) {
        promises.push(
          new Promise((resolve) => {
            resolve(downloadSource("campaignrewards", "English (EN)", true));
          })
        );
      }

      if (task.getTranslation) {
        promises.push(
          new Promise((resolve) => {
            resolve(downloadSource("campaignrewards", language, true));
          })
        );
      }

      let promise = await Promise.all(promises);

      //set the source
      if (task.getSource && !task.getTranslation) {
        workingSourceData = promise[0];
        translatedData = JSON.parse(JSON.stringify(workingSourceData));

        setSourceTreeList(createTreeListFromArray(workingSourceData));
      } else if (task.getSource && task.getTranslation) {
        //set both
        workingSourceData = promise[0];
        translatedData = promise[1];
        setSourceTreeList(createTreeListFromArray(workingSourceData));
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

  function onUpdateText(key, txt) {
    let copy = { ...selectedTranslation };
    copy[key] = txt;
    let index = translatedData.findIndex((x) => x.id === copy.id);
    translatedData[index] = copy;
  }

  return (
    <CommonLayout
      disableSaveButton={disableSaveButton}
      onFileDropped={onFileDropped}
      treeViewList={sourceTreeList ?? []}
      handleItemSelectionToggle={handleItemSelectionToggle}
      projectTitle={"CAMPAIGN REWARDS"}
      onSave={() =>
        saveFile(translatedData, "rewards.json", (m) =>
          ToastMessage.showToast(m)
        )
      }
      drawerWidth={340}
      onDownloadLatest={doWork}
      isBusy={busy}
    >
      {/* TRANSLATED PANEL */}
      <div style={{ flexGrow: "1", marginRight: ".5rem" }}>
        {selectedTranslation && (
          <div style={{ marginBottom: "1rem" }}>
            <Typography variant="p">
              {workingSourceData[selectedTreeIndex].name}
            </Typography>
          </div>
        )}
        {selectedTranslation && (
          <div key={selectedTranslation.id}>
            <TextInput
              label={workingSourceData[selectedTreeIndex].name}
              disabled={false}
              intialValue={selectedTranslation.name}
              onTextUpdated={(txt) => onUpdateText("name", txt)}
            />
            <TextInput
              label={"Extra"}
              disabled={false}
              intialValue={selectedTranslation.extra}
              onTextUpdated={(txt) => onUpdateText("extra", txt)}
            />
          </div>
        )}
      </div>

      {/* ENGLISH SOURCE PANEL */}
      <div style={{ flexGrow: "1", marginLeft: ".5rem" }}>
        {selectedSourceItemArray.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <Typography variant="p">Source</Typography>
          </div>
        )}
        {selectedSourceItemArray.length == 0 ? (
          <Typography variant="p">Select an item to translate.</Typography>
        ) : (
          selectedSourceItemArray.map((item) => (
            <div key={item.id}>
              <TextInput
                label={item.label}
                disabled={true}
                intialValue={workingSourceData[item.id].name}
              />
              <TextInput
                label={"Extra"}
                disabled={true}
                intialValue={workingSourceData[item.id].extra || ""}
              />
            </div>
          ))
        )}
      </div>
    </CommonLayout>
  );
}
