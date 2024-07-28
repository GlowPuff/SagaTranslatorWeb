//mui
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Drawer, Box, Toolbar, Typography, CssBaseline } from "@mui/material";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
//my library
import {
  findObjectById,
  saveFile,
  createTranslatorTheme,
  createTreeListFromArray,
} from "../utils/core";
//my components
import ToastMessage from "../components/ToastMessage";
import DragDropDiv from "../components/DragDropDiv";
import ICAppBar from "../components/ICAppBar";
import TextInput from "../components/TextInput";
import DialogBox from "../components/DialogBox";
//react
import { useState } from "react";
//source data
import sourceData from "../translationdata/CampaignData/skills.json";

//variables
let translatedData = JSON.parse(JSON.stringify(sourceData)); //make unique copy of source data
const drawerWidth = 240;

export default function CampaignItems() {
  const [sourceTreeList, setSourceTreeList] = useState(
    createTreeListFromArray(sourceData)
  );
  const [translatedTreeList, setTranslatedTreeList] = useState(
    createTreeListFromArray(sourceData)
  );
  const [selectedSourceItemArray, setSelectedSourceItemArray] = useState([]);
  const [selectedTranslatedItemArray, setSelectedTranslatedItemArray] =
    useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);

  const darkTheme = createTheme(createTranslatorTheme);

  function onFileDropped(fileInfo, fileContent) {
    //clear existing data
    setSelectedSourceItemArray([]);
    setSelectedTranslatedItemArray([]);
    setSourceTreeList([]);
    setTranslatedTreeList([]);
    setSelectedItems([]);
    setDisableSaveButton(true);

    let importedData;
    try {
      importedData = JSON.parse(fileContent);
    } catch (error) {
      ToastMessage.showToast(`Error parsing imported file: ${error}`);
      console.log(`Error parsing imported file: ${error}`);
      return;
    }

    //add any properties that don't exist
    let missingData = [];
    for (let index = 0; index < sourceData.length; index++) {
      let found = importedData.find((x) => x.id === sourceData[index].id);
      if (typeof found === "undefined") {
        importedData.splice(index, 0, sourceData[index]);
        missingData.push(sourceData[index].id + " / " + sourceData[index].name);
      }
    }

    translatedData = importedData;

    setDisableSaveButton(false);

    if (missingData.length > 0) {
      DialogBox.ReportUIErrors(missingData, []);
    } else ToastMessage.showToast("Data imported, no errors found");

    //create the tree view lists
    setSourceTreeList(createTreeListFromArray(sourceData));
    setTranslatedTreeList(createTreeListFromArray(translatedData));
  }

  const handleItemSelectionToggle = (event, itemId, isSelected) => {
    if (isSelected) {
      let sItem = sourceTreeList.filter((x) => x.id == itemId)[0];
      let tItem = translatedTreeList.filter((x) => x.id == itemId)[0];

      if (sItem) {
        setSelectedSourceItemArray([findObjectById(sourceTreeList, itemId)]);
      }

      if (tItem) {
        setSelectedTranslatedItemArray([
          findObjectById(translatedTreeList, itemId),
        ]);
      }
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <ICAppBar
          title={"CAMPAIGN SKILLS"}
          includeLanguageSelector={false}
          disableSaveButton={disableSaveButton}
          onSave={() =>
            saveFile(translatedData, "skills.json", (m) =>
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
            <DragDropDiv onFileDropped={onFileDropped} />

            <RichTreeView
              items={sourceTreeList ?? []}
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
            {/* TRANSLATED PANEL */}
            <div style={{ flexGrow: "1", marginRight: ".5rem" }}>
              {selectedTranslatedItemArray.map((item, index) => (
                <TextInput
                  key={item.id}
                  label={selectedSourceItemArray[index].label}
                  disabled={false}
                  dataSet={translatedData[item.id]}
                  dataPath={"name"}
                />
              ))}
            </div>

            {/* ENGLISH SOURCE PANEL */}
            <div style={{ flexGrow: "1", marginLeft: ".5rem" }}>
              {selectedSourceItemArray.length == 0 ? (
                <Typography variant="p">
                  Select an item to translate.
                </Typography>
              ) : (
                selectedSourceItemArray.map((item) => (
                  <TextInput
                    key={item.id}
                    label={item.label}
                    disabled={true}
                    dataSet={sourceData[item.id]}
                    dataPath={"name"}
                  />
                ))
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
