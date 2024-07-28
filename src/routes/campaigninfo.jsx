//mui
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { Drawer, Box, Toolbar, CssBaseline } from "@mui/material";
import { saveFile, createTranslatorTheme } from "../utils/core";
//my components
import ToastMessage from "../components/ToastMessage";
import DragDropDiv from "../components/DragDropDiv";
import ICAppBar from "../components/ICAppBar";
import MultilineTextInput from "../components/MultilineTextInput";
import DialogBox from "../components/DialogBox";
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
const drawerWidth = 240;

export default function CampaignInfo() {
  const [translatedData, setTranslatedData] = useState(""); //the data that gets saved
  const [selectedSourceItem, setSelectedSourceItem] = useState({
    data: "",
    label: "None",
  });
  const [selectedTranslatedItem, setSelectedTranslatedItem] = useState({
    data: "",
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(true);

  const darkTheme = createTheme(createTranslatorTheme);

  const handleItemSelectionToggle = (event, itemId, isSelected) => {
    if (isSelected) {
      setDisableSaveButton(false);
      setTranslatedData(sourceTree[itemId].data);
      setSelectedSourceItem({
        ...sourceTree[itemId],
        rnd: Math.random().toString(),
      });
      setSelectedTranslatedItem({
        label: sourceTree[itemId].label,
        data: sourceTree[itemId].data,
        rnd: Math.random().toString(),
      });
    }
  };

  function onFileDropped(fileInfo, fileContent) {
    //console.log("🚀 ~ onFileDropped ~ fileContent:", fileContent);
    //console.log("🚀 ~ onFileDropped ~ fileInfo:", fileInfo);

    setSelectedTranslatedItem({
      label: selectedSourceItem.label,
      data: fileContent,
      rnd: Math.random().toString(),
    });

    setTranslatedData(fileContent);
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <ICAppBar
          title={`CAMPAIGN INFO - ${selectedSourceItem.label}`}
          includeLanguageSelector={false}
          disableSaveButton={disableSaveButton}
          onSave={() =>
            saveFile(translatedData, selectedSourceItem.filename, (m) =>
              ToastMessage.showToast(m)
            )
          }
        />

        <Drawer
          open={true}
          variant="permanent"
          sx={{
            position: "relative",
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />

          <Box
            onDragOver={(ev) => ev.preventDefault()}
            onDrop={(ev) => ev.preventDefault()}
          >
            <DragDropDiv
              onFileDropped={onFileDropped}
              disabled={selectedTranslatedItem.data.length === 0}
            />

            <RichTreeView
              items={sourceTree}
              onItemSelectionToggle={handleItemSelectionToggle}
              selectedItems={selectedItems}
              onSelectedItemsChange={(ev, ids) => setSelectedItems(ids)}
            />
          </Box>
        </Drawer>

        <Box
          sx={{
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />

          {/* MAIN CONTENT */}
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyItems={"center"}
            sx={{ mb: 10, mt: 2, marginLeft: "2rem", marginRight: "2rem" }}
          >
            {selectedTranslatedItem.data.length === 0 && (
              <div
                style={{ display: "grid", width: "100%", placeItems: "center" }}
              >
                <p>Select a Campaign.</p>
              </div>
            )}

            {/* TRANSLATED PANEL */}
            <div style={{ flexGrow: "1", marginRight: ".5rem" }}>
              {selectedTranslatedItem.data.length > 0 && (
                <MultilineTextInput
                  key={selectedTranslatedItem.rnd}
                  label={selectedTranslatedItem.label}
                  dataText={selectedTranslatedItem.data}
                  onTextChanged={(txt) => setTranslatedData(txt)}
                  disabled={false}
                />
              )}
            </div>
            {/* ENGLISH SOURCE PANEL */}
            <div style={{ flexGrow: "1", marginLeft: ".5rem" }}>
              {selectedSourceItem.data.length > 0 && (
                <MultilineTextInput
                  key={selectedSourceItem.id}
                  label={selectedSourceItem.label}
                  dataText={selectedSourceItem.data}
                  disabled={true}
                />
              )}
            </div>
          </Box>
        </Box>
      </Box>

      <ToastMessage />
      <DialogBox />
    </ThemeProvider>
  );
}
