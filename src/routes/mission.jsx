//libraries
import { jsonrepair } from "jsonrepair";
//my library
import {
  saveFile,
  createMissionList,
  findObjectById,
  downloadSource,
} from "../utils/core";
import { validateMission } from "../utils/datavalidation";
//my components
import CommonLayout from "../components/CommonLayout";
import ToastMessage from "../components/ToastMessage";
import DialogBox from "../components/DialogBox";
import MissionLayout from "../components/MissionLayout";
//react
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

let sourceData; //the English source data
let exportedData; //the saved data
let brokenIDs = [];
let expansion;

export default function Mission() {
  //selected source item in the tree
  const [selectedSourceItem, setSelectedSourceItem] = useState(null);
  //selected translated item in the tree
  const [selectedTranslatedItem, setSelectedTranslatedItem] = useState(null);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [outFilename, setOutFilename] = useState("");
  const [title, setTitle] = useState("MISSION");
  const [workLanguage, setWorkLanguage] = useState("English (EN)");
  const [sourceDataTreeList, setTreeList] = useState(); //the tree view
  const [busy, setBusy] = useState(false);
  const [disabledSourceButton, setDisabledSourceButton] = useState(false);

  let location = useLocation();
  //console.log("🚀 ~ Mission ~ location:", location);

  useEffect(() => {
    //2=expansion
    //3=mission ID
    parseURL(location.pathname.split("/"), location.state.customMission);
  }, [location]);

  async function parseURL(loc, custom) {
    try {
      if (loc.length == 3) {
        if (loc[2] === "custom") {
          sourceData = custom;
          setTitle(sourceData.missionProperties.missionName);
          setOutFilename(`custom.json`);
          setDisabledSourceButton(true);
        }
      } else if (loc.length == 4) {
        const response = await fetch(`/Missions/${loc[2]}/${loc[3]}_EN.json`);
        //set the English source data
        sourceData = await response.json();
        setTitle(`${loc[3]}`);
        setOutFilename(`${loc[3]}_EN.json`);
        expansion = loc[2];
      }

      //sort the data
      sourceData.initialGroups.sort((a, b) =>
        a.cardName > b.cardName ? 1 : -1
      );
      sourceData.mapEntities.sort((a, b) =>
        a.entityName > b.entityName ? 1 : -1
      );
      sourceData.events.sort((a, b) => (a.eventName > b.eventName ? 1 : -1));
      //make a copy of defaults for the translation
      exportedData = JSON.parse(JSON.stringify(sourceData));

      setWorkLanguage(sourceData.languageID);

      setTreeList(createMissionList(sourceData));
    } catch (error) {
      ToastMessage.showToast(
        "There was an error importing the source data. Check the console for the error message."
      );
      console.log("🚀 ~ parseURL ~ error:", error);
    }
  }

  const handleItemSelectionToggle = (event, itemId, isSelected) => {
    if (isSelected) {
      setDisableSaveButton(false);
      // selectedTreeIndex = itemId;

      if (Number.parseInt(itemId) > 0 && Number.parseInt(itemId) <= 3) {
        //root item, skip
        setSelectedSourceItem(null);
        setSelectedTranslatedItem(null);
        return;
      }

      let selectedSrc = findObjectById(sourceDataTreeList, itemId);
      setSelectedSourceItem({
        data: selectedSrc.data,
        dataType: selectedSrc.dataType,
        itemIndex: selectedSrc.itemIndex,
        key: itemId, //force update of data
      });

      // console.log("🚀 ~ handleItemSelectionToggle ~ selectedSrc:", selectedSrc);

      //selected translated item depends on which data type was selected (prop, event, entity, group)
      if (selectedSrc.dataType === "missionProperties") {
        let selectedTrans = exportedData[selectedSrc.dataType];

        setSelectedTranslatedItem({
          data: selectedTrans,
          dataType: selectedSrc.dataType,
        });
      } else if (selectedSrc.dataType === "events") {
        let selectedTrans = exportedData.events.filter(
          (x) => x.eventName === selectedSrc.data.eventName
        )[0];

        setSelectedTranslatedItem({
          data: selectedTrans || {
            eventName: "Undefined",
            eventActions: [],
            eventText: "",
          },
          dataType: selectedSrc.dataType,
        });
      } else if (selectedSrc.dataType === "mapEntities") {
        let selectedTrans = exportedData.mapEntities.filter(
          (x) => x.entityName === selectedSrc.data.entityName
        )[0];

        setSelectedTranslatedItem({
          data: selectedTrans || { entityName: "Undefined" },
          dataType: selectedSrc.dataType,
        });
      } else if (selectedSrc.dataType === "initialGroups") {
        let selectedTrans =
          exportedData[selectedSrc.dataType][selectedSrc.itemIndex];

        setSelectedTranslatedItem({
          data: selectedTrans,
          dataType: selectedSrc.dataType,
        });
      }
    }
  };

  function onFileDropped(fileInfo, fileContent) {
    if (!fileInfo.name.includes(title + "_")) {
      ToastMessage.showToast(
        `The imported filename doesn't match the expected data: ${title}`
      );
      return;
    }

    setDisableSaveButton(true);
    setSelectedSourceItem(null);
    setSelectedTranslatedItem(null);
    CommonLayout.SelectTreeNone();

    brokenIDs = [];
    let fixResult = "";
    try {
      //repair the imported data
      const [result, markRed] = fixData(
        fileInfo.name,
        JSON.parse(jsonrepair(fileContent))
      );
      onSetLanguage(exportedData.languageID);

      fixResult = result;

      let treeCopy = [...sourceDataTreeList];
      for (let index = 0; index < sourceDataTreeList.length; index++) {
        if (markRed.includes(sourceDataTreeList[index].label)) {
          treeCopy[index].label = "*" + treeCopy[index].label;
        }
        for (
          let childIndex = 0;
          childIndex < sourceDataTreeList[index].children?.length;
          childIndex++
        ) {
          if (
            markRed.includes(
              sourceDataTreeList[index].children[childIndex].label
            )
          ) {
            treeCopy[index].children[childIndex].label =
              "*" + treeCopy[index].children[childIndex].label;
          }
        }
      }
      //set the updated tree view with "*" for erroneous/missing data
      setTreeList(treeCopy);
    } catch (error) {
      fixResult = "There was an error importing the data: " + error;
      console.log("🚀 ~ onFileDropped ~ error:", error);
      DialogBox.ShowGenericDialog(
        "Import Error",
        "There was an error importing the data: " + error
      );
    } finally {
      ToastMessage.showToast(fixResult);
    }
  }

  // "importedData" is repaired mission object, sets exportedData with fixed data
  function fixData(filename, importedData) {
    let fixed;
    let broken = [];
    let markRed = [];

    [broken, fixed, markRed] = validateMission(sourceData, importedData);

    exportedData = fixed;
    brokenIDs = broken.map((item) => item[1]);

    if (broken.length > 0) {
      DialogBox.ReportMissionErrors(broken, []);
    } else ToastMessage.showToast("Data imported, no errors found");

    setDisableSaveButton(false);
    setWorkLanguage(exportedData.languageID);
    1;
    let result = `Data imported: ${filename}`;

    return [result, markRed];
  }

  function onSaveFile() {
    saveFile(exportedData, outFilename, (m) => ToastMessage.showToast(m));
  }

  function onItemUpdated(key, value, index = -1) {
    //update the translation data
    // console.log("🚀 ~ onItemUpdated ~ key:", key);
    // console.log("🚀 ~ onItemUpdated ~ value:", value);
    // console.log("🚀 ~ onItemUpdated ~ index:", index);
    // console.log(
    //   "🚀 ~ onItemUpdated ~ selectedSrc.itemIndex:",
    //   selectedSourceItem.itemIndex
    // );

    if (selectedSourceItem.dataType === "missionProperties") {
      exportedData["missionProperties"][key] = value;
    } else if (selectedSourceItem.dataType === "events") {
      if (key === "eventText") {
        exportedData["events"][selectedSourceItem.itemIndex].eventText = value;
      } else if (key === "eventActions") {
        //console.log("🚀 ~ onItemUpdated ~ value:", value);
        exportedData["events"][selectedSourceItem.itemIndex].eventActions[
          index
        ] = value;
      }
    } else if (selectedSourceItem.dataType === "mapEntities") {
      exportedData["mapEntities"][selectedSourceItem.itemIndex] = value;
    } else if (selectedSourceItem.dataType === "initialGroups") {
      exportedData["initialGroups"][selectedSourceItem.itemIndex] = value;
    }

    //console.log("🚀 ~ onItemUpdated ~ exportedData:", exportedData);
  }

  //sets working language and returns the parsed filename (example: "CORE1_EN.json")
  function onSetLanguage(lang) {
    setWorkLanguage(lang);
    exportedData.languageID = lang;
    let languageID = lang.match(/\((.*?)\)/)[1];
    let filename = title + "_" + languageID.toUpperCase() + ".json";
    setOutFilename(filename);
    return filename;
  }

  async function doWork({ language, task }) {
    setSelectedSourceItem(null);
    setSelectedTranslatedItem(null);
    CommonLayout.SelectTreeNone();

    try {
      let promises = [];
      let filename = onSetLanguage(language);

      if (task.getSource) {
        promises.push(
          new Promise((resolve) => {
            resolve(
              downloadSource(
                "missionEnglish",
                "",
                true,
                `${expansion}/${title.toUpperCase()}_EN.json`
              )
            ); //Core/COREXX_EN.json
          })
        );
      }

      if (task.getTranslation) {
        promises.push(
          new Promise((resolve) => {
            resolve(
              downloadSource(
                "missionTranslation",
                language,
                true,
                `${expansion}/${filename}`
              )
            );
          })
        );
      }

      let promise = await Promise.all(promises);

      if (task.getSource && !task.getTranslation) {
        //set the source
        sourceData = promise[0];
        //sort the data
        sourceData.initialGroups.sort((a, b) =>
          a.cardName > b.cardName ? 1 : -1
        );
        sourceData.mapEntities.sort((a, b) =>
          a.entityName > b.entityName ? 1 : -1
        );
        sourceData.events.sort((a, b) => (a.eventName > b.eventName ? 1 : -1));
        //make a copy of defaults for the translation
        exportedData = JSON.parse(JSON.stringify(sourceData));

        setWorkLanguage(sourceData.languageID);
        setTreeList(createMissionList(sourceData));
      } else if (task.getSource && task.getTranslation) {
        //set both
        sourceData = promise[0];
        //sort the data
        sourceData.initialGroups.sort((a, b) =>
          a.cardName > b.cardName ? 1 : -1
        );
        sourceData.mapEntities.sort((a, b) =>
          a.entityName > b.entityName ? 1 : -1
        );
        sourceData.events.sort((a, b) => (a.eventName > b.eventName ? 1 : -1));
        //fix the imported translation
        fixData(filename, promise[1]); //sets 'exportedData', report errors

        let newTree = createMissionList(sourceData);
        setTreeList(newTree);
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
      projectTitle={title}
      onSave={onSaveFile}
      includeLanguageSelector={true}
      language={workLanguage}
      onSetLanguage={(lang) => onSetLanguage(lang)}
      onDownloadLatest={doWork}
      isBusy={busy}
      disabledSourceButton={disabledSourceButton}
    >
      {/* TRANSLATED PANEL */}
      <div style={{ flexGrow: "1", marginRight: ".5rem" }}>
        {selectedTranslatedItem && (
          <MissionLayout
            data={selectedTranslatedItem}
            brokenIDs={brokenIDs}
            onModifyItem={onItemUpdated}
            key={selectedSourceItem.key}
          />
        )}
      </div>

      {/* ENGLISH SOURCE PANEL */}
      <div style={{ flexGrow: "1", marginLeft: ".5rem" }}>
        {selectedSourceItem && (
          <MissionLayout
            data={selectedSourceItem}
            disabled={true}
            key={selectedSourceItem.key}
          />
        )}
      </div>
    </CommonLayout>
  );
}
