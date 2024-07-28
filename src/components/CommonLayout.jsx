//mui
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { Drawer, Box, Toolbar, CssBaseline } from "@mui/material";
//my components
import ToastMessage from "../components/ToastMessage";
import DragDropDiv from "../components/DragDropDiv";
import ICAppBar from "../components/ICAppBar";
import DialogBox from "../components/DialogBox";
//core
import { createTranslatorTheme } from "../utils/core";
//react
import { useState } from "react";
import PropTypes from "prop-types";

export default function CommonLayout({
  disableSaveButton,
  drawerWidth = 240,
  onFileDropped,
  treeViewList,
  handleItemSelectionToggle,
  projectTitle,
  dropMessage = "Drag and drop the file here to open it.",
  dropDisabled = false,
  onSave,
  includeLanguageSelector = false,
  language,
  onSetLanguage,
  children,
}) {
  //item selected in the tree view
  const [selectedItems, setSelectedItems] = useState([]);

  const darkTheme = createTheme(createTranslatorTheme);

  const selectTreeNone = () => {
    setSelectedItems([]);
  };
  CommonLayout.SelectTreeNone = selectTreeNone;

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <ICAppBar
          title={projectTitle}
          includeLanguageSelector={includeLanguageSelector}
          disableSaveButton={disableSaveButton}
          onSave={() => onSave()}
          language={language}
          onSetLanguage={onSetLanguage}
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
              instructionText={dropMessage}
              disabled={dropDisabled}
            />

            <RichTreeView
              items={treeViewList ?? []}
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
            {children}
          </Box>
        </Box>
      </Box>

      <ToastMessage />
      <DialogBox />
    </ThemeProvider>
  );
}

CommonLayout.propTypes = {
  disableSaveButton: PropTypes.bool,
  dropDisabled: PropTypes.bool,
  includeLanguageSelector: PropTypes.bool,
  language: PropTypes.string,
  drawerWidth: PropTypes.number,
  onFileDropped: PropTypes.func,
  treeViewList: PropTypes.array,
  handleItemSelectionToggle: PropTypes.func,
  projectTitle: PropTypes.string,
  dropMessage: PropTypes.string,
  onSave: PropTypes.func,
  onSetLanguage: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
