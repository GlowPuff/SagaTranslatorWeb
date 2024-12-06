import "../css/dashboard.css";
import appIcon from "../assets/project.svg";
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  FormLabel,
  Button,
  Tooltip,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";

export default function ICAppBar({
  title,
  barText,
  language,
  onSetLanguage,
  includeLanguageSelector = false,
  onSave,
  disableSaveButton,
  onDownloadLatest,
  isBusy = false,
  disabledSourceButton = false,
}) {
  function handleChange(event) {
    onSetLanguage(event.target.value);
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
    ];
    return languages.map((item, index) => (
      <MenuItem key={index} value={item}>
        {item}
      </MenuItem>
    ));
  }

  function downloadLatest() {
    onDownloadLatest();
  }

  return (
    <AppBar
      enableColorOnDark
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "purple",
      }}
    >
      <Toolbar>
        <Tooltip title="Select a New Project" placement="bottom-start">
          <a href="/">
            <img src={appIcon} width={32} style={{ marginRight: "1rem" }} />
          </a>
        </Tooltip>

        <Typography
          variant="h6"
          component="div"
          sx={{ width: "240px", flexShrink: "0" }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            flexGrow: 0,
            display: "flex",
            marginLeft: "auto",
            alignItems: "center",
          }}
        >
          {includeLanguageSelector && (
            <div
              className={
                "appBarLanguageDiv " + (isBusy ? "missionDialogDisabled" : "")
              }
              style={{ marginRight: "1rem" }}
            >
              <Typography
                variant="subtitle2"
                component="div"
                noWrap
                style={{ marginLeft: "auto" }}
              >
                {barText}
              </Typography>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "auto",
                }}
              >
                <FormLabel sx={{ marginRight: "1rem", color: "white" }}>
                  Target Language:
                </FormLabel>
                <Select
                  value={language}
                  onChange={handleChange}
                  displayEmpty
                  sx={{ minWidth: "200px", marginLeft: "auto" }}
                >
                  {getLanguages()}
                </Select>
              </div>
            </div>
          )}

          <Tooltip
            title="Download the latest English Source reference and Translation data"
            placement="bottom-start"
          >
            {/* wrap in span so MUI doesn't complain about disabled Button under Tooltip */}
            <span>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => downloadLatest()}
                disabled={disableSaveButton || isBusy || disabledSourceButton}
                sx={{
                  marginLeft: "auto",
                  marginRight: "1rem",
                  flexShrink: "0",
                  display: "block",
                }}
              >
                Sources...
              </Button>
            </span>
          </Tooltip>

          <Button
            color="secondary"
            variant="contained"
            sx={{ marginLeft: "auto", flexShrink: "0", display: "block" }}
            disabled={disableSaveButton || isBusy}
            onClick={() => onSave()}
          >
            Save File...
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

ICAppBar.propTypes = {
  title: PropTypes.string,
  barText: PropTypes.string,
  language: PropTypes.string,
  onSetLanguage: PropTypes.func,
  includeLanguageSelector: PropTypes.bool,
  onSave: PropTypes.func,
  disableSaveButton: PropTypes.bool,
  onDownloadLatest: PropTypes.func,
  isBusy: PropTypes.bool,
  disabledSourceButton: PropTypes.bool,
};
