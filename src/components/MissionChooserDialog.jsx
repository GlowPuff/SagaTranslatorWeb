import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Select from "@mui/material/Select";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState, useRef } from "react";
//library
import { jsonrepair } from "jsonrepair";
//data
import missionSchema from "../assets/mission-schema";

export default function MissionChooserDialog() {
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [selectedExpansion, setSelectedExpansion] = useState("Core");
  const [selectedMission, setSelectedMission] = useState("CORE1");
  const [missionList, setMissionList] = useState(missionSchema["Core"]);
  const callbackFunc = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [customName, setCustomName] = useState("");
  const [useCustomChecked, setUseCustomChecked] = useState(false);
  const [customMission, setCustomMission] = useState({});

  const readerRef = useRef(null); // useRef to hold FileReader instance

  const expansionNames = Object.keys(missionSchema);

  function onExpansionChanged(value) {
    setSelectedExpansion(value);
    setMissionList(missionSchema[value]);
    setSelectedMission(missionSchema[value][0]);
  }

  function onMissionChanged(value) {
    setSelectedMission(value);
  }

  function onContinueClicked() {
    setOpen(false);
    callbackFunc.current(
      selectedExpansion,
      selectedMission,
      customMission,
      useCustomChecked
    );
  }

  const showDialog = (dialogTitle, callback) => {
    callbackFunc.current = callback;
    setDialogTitle(dialogTitle);
    setUseCustomChecked(false);
    setCustomName("");
		setSelectedExpansion("Core");
		setSelectedMission("CORE1");
		setMissionList(missionSchema["Core"]);
    setOpen(true);

  };
  MissionChooserDialog.ShowDialog = showDialog;

  const handleDragOver = (event) => {
    event.preventDefault(); // Prevent default behavior (opening the file)
    setIsDragOver(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setIsDragOver(false);

    const file = event.dataTransfer.files[0];

    if (!readerRef.current) {
      readerRef.current = new FileReader();
    }

    const reader = readerRef.current;
    reader.onload = (event) => {
      // file content as text
      try {
        let custom = JSON.parse(jsonrepair(event.target.result));
        setCustomMission(custom);
        setCustomName(
          custom.missionProperties.missionName + " / " + custom.languageID
        );
      } catch (error) {
        console.log("🚀 ~ Error repairing Custom Mission:", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} maxWidth={"sm"} fullWidth={true} scroll={"paper"}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <div className="missionDialogPanels">
          {/* LEFT */}
          <Paper sx={{ padding: "1rem", width: "100%" }}>
            <Typography variant="button">Official Mission</Typography>

            <div
              className={
                "missionDialogLayout " +
                (useCustomChecked ? "missionDialogDisabled" : "")
              }
            >
              <FormLabel sx={{ color: "white" }}>Expansion:</FormLabel>
              <Select
                value={selectedExpansion}
                onChange={(ev) => onExpansionChanged(ev.target.value)}
                displayEmpty
                sx={{ marginLeft: "auto", width: "100%" }}
              >
                {expansionNames.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>

              <FormLabel sx={{ color: "white" }}>Mission:</FormLabel>
              <Select
                value={selectedMission}
                onChange={(ev) => onMissionChanged(ev.target.value)}
                displayEmpty
                sx={{ marginLeft: "auto", width: "100%" }}
              >
                {missionList.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </Paper>
          {/* RIGHT */}
          <Paper sx={{ padding: "1rem", width: "100%" }}>
            <Typography variant="button">Custom Mission</Typography>

            <FormControlLabel
              control={
                <Checkbox
                  onChange={(ev) => setUseCustomChecked(ev.target.checked)}
                  checked={useCustomChecked}
                />
              }
              label="Use Custom Mission"
            />
            <div
              className={
                "missionDialogDropBox " + (isDragOver ? "dottedBlue" : "")
              }
              style={{ textAlign: "center" }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragLeave={() => setIsDragOver(false)}
            >
              Drag and drop your Custom Mission here.
            </div>
            <Typography sx={{ textAlign: "center" }}>{customName}</Typography>
          </Paper>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => onContinueClicked()}
          disabled={
            useCustomChecked
              ? useCustomChecked && customName === ""
                ? true
                : false
              : false
          }
        >
          continue
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={() => setOpen(false)}
        >
          cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
