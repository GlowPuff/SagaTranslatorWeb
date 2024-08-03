import { saveFile, downloadSource } from "../utils/core";
//my components
import ToastMessage from "../components/ToastMessage";
import CommonLayout from "../components/CommonLayout";
import MultilineTextInput from "../components/MultilineTextInput";
import DialogBox from "../components/DialogBox";
// import DialogBox from "../components/DialogBox";
//react
import { useState } from "react";
//source data
import coreData from "../translationdata/CampaignData/CampaignInfo/CoreInfo.txt?raw";
import twinData from "../translationdata/CampaignData/CampaignInfo/TwinInfo.txt?raw";
import bespinData from "../translationdata/CampaignData/CampaignInfo/BespinInfo.txt?raw";
import empireData from "../translationdata/CampaignData/CampaignInfo/EmpireInfo.txt?raw";
import hothData from "../translationdata/CampaignData/CampaignInfo/HothInfo.txt?raw";
import jabbaData from "../translationdata/CampaignData/CampaignInfo/JabbaInfo.txt?raw";
import lothalData from "../translationdata/CampaignData/CampaignInfo/LothalInfo.txt?raw";
//variables
// let sourceData = coreData;
let sourceTree = [
  { id: "0", label: "Core", data: coreData, filename: "CoreInfo.txt" },
  { id: "1", label: "Twin", data: twinData, filename: "TwinInfo.txt" },
  { id: "2", label: "Bespin", data: bespinData, filename: "BespinInfo.txt" },
  { id: "3", label: "Empire", data: empireData, filename: "EmpireInfo.txt" },
  { id: "4", label: "Hoth", data: hothData, filename: "HothInfo.txt" },
  { id: "5", label: "Jabba", data: jabbaData, filename: "JabbaInfo.txt" },
  { id: "6", label: "Lothal", data: lothalData, filename: "LothalInfo.txt" },
];

export default function CampaignInfo() {
  const [selectedSourceItem, setSelectedSourceItem] = useState({
    data: "",
    label: "None",
  });
  const [disableSaveButton, setDisableSaveButton] = useState(true);
  const [busy, setBusy] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [refresh, setRefresh] = useState("");
  const [exportedData, setExportedData] = useState({
    Core: sourceTree[0].data,
    Twin: sourceTree[1].data,
    Bespin: sourceTree[2].data,
    Empire: sourceTree[3].data,
    Hoth: sourceTree[4].data,
    Jabba: sourceTree[5].data,
    Lothal: sourceTree[6].data,
  });

  let keyNames = [
    "Core",
    "Twin",
    "Bespin",
    "Empire",
    "Hoth",
    "Jabba",
    "Lothal",
  ];

  const handleItemSelectionToggle = (event, itemId, isSelected) => {
    if (isSelected) {
      setSelectedIndex(itemId);
      setSelectedKey(sourceTree[itemId].label);
      setDisableSaveButton(false);
      setSelectedSourceItem({
        ...sourceTree[itemId],
        rnd: Math.random().toString(),
      });
      setExportedData({
        ...exportedData,
      });
      setRefresh(Date.now);
    } else setSelectedIndex(-1);
  };

  function onFileDropped(fileInfo, fileContent) {
    if (fileInfo.name != sourceTree[selectedIndex].filename) {
      ToastMessage.showToast(
        `The imported filename doesn't match the expected filename: ${sourceTree[selectedIndex].filename}`
      );
      return;
    }

    setExportedData({
      ...exportedData,
      [selectedKey]: fileContent,
    });
    setRefresh(Date.now);

    ToastMessage.showToast(`Data imported: ${fileInfo.name}`);
  }

  async function doWork({ language, task }) {
    setBusy(true);

    //setSelectedKey("");
    setSelectedSourceItem({
      data: "",
      label: "None",
    });
    CommonLayout.SelectTreeNone();
    setSelectedIndex(-1);

    try {
      let promises = [];
      if (task.getSource) {
        for (let index = 0; index < 7; index++) {
          promises.push(
            new Promise((resolve) => {
              resolve(
                downloadSource(
                  "campaigninfo",
                  "English (EN)",
                  false,
                  sourceTree[index].filename
                )
              );
            })
          );
        }
      }

      if (task.getTranslation) {
        for (let index = 0; index < 7; index++) {
          promises.push(
            new Promise((resolve) => {
              resolve(
                downloadSource(
                  "campaigninfo",
                  language,
                  false,
                  sourceTree[index].filename
                )
              );
            })
          );
        }
      }

      let promise = await Promise.all(promises);

      if (task.getSource && !task.getTranslation) {
        for (let index = 0; index < 7; index++) {
          sourceTree[index].data = promise[index];
        }
      } else if (task.getSource && task.getTranslation) {
        let exported = {};
        for (let index = 0; index < 7; index++) {
          sourceTree[index].data = promise[index];
          exported[keyNames[index]] = promise[index + 7];
        }
        setExportedData(exported);
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
      setRefresh(Date.now);
    }
  }

  return (
    <CommonLayout
      disableSaveButton={disableSaveButton}
      onFileDropped={onFileDropped}
      treeViewList={sourceTree}
      handleItemSelectionToggle={handleItemSelectionToggle}
      projectTitle={`CAMPAIGN INFO - ${selectedSourceItem.label}`}
      dropDisabled={selectedKey === ""}
      onSave={() =>
        saveFile(
          exportedData[selectedKey],
          selectedSourceItem.filename,
          (m) => {
            return ToastMessage.showToast(m);
          }
        )
      }
      drawerWidth={340}
      language={"English (EN)"}
      onDownloadLatest={doWork}
      isBusy={busy}
    >
      {/* TRANSLATED PANEL */}
      <div style={{ flexGrow: "1", marginRight: ".5rem" }}>
        {selectedIndex != -1 && (
          <MultilineTextInput
            key={refresh}
            label={selectedKey}
            dataText={exportedData[selectedKey]}
            onTextChanged={(txt) => (exportedData[selectedKey] = txt)}
            disabled={false}
          />
        )}
      </div>

      {/* ENGLISH SOURCE PANEL */}
      <div style={{ flexGrow: "1", marginLeft: ".5rem" }}>
        {selectedSourceItem.data.length > 0 && (
          <MultilineTextInput
            key={refresh}
            label={selectedSourceItem.label}
            dataText={selectedSourceItem.data}
            disabled={true}
          />
        )}
      </div>
    </CommonLayout>
  );
}
