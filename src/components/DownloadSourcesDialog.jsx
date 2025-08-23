import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import { useState, useRef } from "react";

export default function DownloadSourcesDialog() {
  const [open, setOpen] = useState(false);
  const [useSourceChecked, setUseSourceChecked] = useState(false);
  const [useTranslationChecked, setUseTranslationChecked] = useState(false);
  const [language, setLanguage] = useState("English (EN)");
  const callbackFunc = useRef(null);

  function showDialog(callback) {
    callbackFunc.current = callback;
    setLanguage("English (EN)");
    setUseSourceChecked(true);
    setUseTranslationChecked(false);
    setOpen(true);
  }
  DownloadSourcesDialog.ShowDialog = showDialog;

  function onOK() {
    setOpen(false);
    callbackFunc.current({
      language: language,
      task: {
        getSource: useSourceChecked,
        getTranslation: useTranslationChecked,
      },
    });
  }

  function getLanguages() {
    let languages = [
      "English (EN)",
      "German (DE)",
      "Spanish (ES)",
      "French (FR)",
      "Polski (PL)",
      "Italian (IT)",
      "Magyar (HU)",
      "Norwegian (NO)",
      "Russian (RU)",
      "Dutch (NL)",
      "Portuguese (PT)"
    ];
    return languages.map((item, index) => (
      <MenuItem key={index} value={item}>
        {item}
      </MenuItem>
    ));
  }

  return (
    <Dialog open={open} maxWidth={"md"} fullWidth={true} scroll={"paper"}>
      <DialogTitle>Download Current Data</DialogTitle>
      <DialogContent>
        <Typography variant="p" display={"block"}>
          Download the current English Source reference and optionally the
          current Translation.
        </Typography>

        <Typography variant="p" color={"red"}>
          Be sure to save any work before continuing.
        </Typography>
        <div className="missionDialogPanels" style={{ marginTop: "1rem" }}>
          {/* LEFT */}
          <Paper sx={{ padding: "1rem", width: "100%" }}>
            <Typography variant="button">English Source</Typography>
            <hr />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(ev) => setUseSourceChecked(ev.target.checked)}
                  checked={useSourceChecked}
                  disabled={true}
                />
              }
              label="Download Current English Source"
            />
            <Typography color={"orange"}>
              Downloading only the Source will replace the English reference
              data <b><i>and</i></b> replace your Translation with English defaults.
            </Typography>
          </Paper>

          {/* RIGHT */}
          <Paper sx={{ padding: "1rem", width: "100%" }}>
            <Typography variant="button">Translation</Typography>
            <hr />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(ev) => setUseTranslationChecked(ev.target.checked)}
                  checked={useTranslationChecked}
                />
              }
              label="Download Current Translation"
            />

            <Typography color={"orange"}>
              Downloading the Translation will replace your Translation with the latest data from the language you select below, if it exists.
            </Typography>

            <div
              className={useTranslationChecked ? "" : "missionDialogDisabled"}
              style={{ marginTop: "1rem" }}
            >
              <FormLabel sx={{ marginRight: "1rem", color: "white" }}>
                Translation Language:
              </FormLabel>
              <Select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                displayEmpty
                sx={{ minWidth: "200px", marginLeft: "auto" }}
              >
                {getLanguages()}
              </Select>
            </div>
          </Paper>
        </div>
      </DialogContent>
      <DialogActions sx={{ paddingRight: "1rem", paddingBottom: "1rem" }}>
        <Button
          disabled={!(useSourceChecked || useTranslationChecked)}
          variant="contained"
          onClick={() => onOK()}
        >
          continue
        </Button>
        <Button
          variant="contained"
          onClick={() => setOpen(false)}
          color="error"
        >
          cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
