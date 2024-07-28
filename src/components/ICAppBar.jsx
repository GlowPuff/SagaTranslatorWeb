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
}) {
  function handleChange(event) {
    onSetLanguage(event.target.value);
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

        {includeLanguageSelector && (
          <div className="appBarLanguageDiv" style={{ marginRight: "1rem" }}>
            <Typography
              variant="subtitle2"
              component="div"
              noWrap
              style={{ marginLeft: "auto" }}
            >
              {barText}
            </Typography>

            <div style={{ marginLeft: "auto" }}>
              <FormLabel sx={{ marginRight: "1rem", color: "white" }}>
                Target Language:
              </FormLabel>
              <Select
                value={language}
                onChange={handleChange}
                displayEmpty
                sx={{ minWidth: "200px", marginLeft: "auto" }}
              >
                <MenuItem value={"English (EN)"}>English (EN)</MenuItem>
                <MenuItem value={"German (DE)"}>German (DE)</MenuItem>
                <MenuItem value={"Spanish (ES)"}>Spanish (ES)</MenuItem>
                <MenuItem value={"French (FR)"}>French (FR)</MenuItem>
                <MenuItem value={"Polski (PL)"}>Polski (PL)</MenuItem>
                <MenuItem value={"Italian (IT)"}>Italian (IT)</MenuItem>
                <MenuItem value={"Magyar (HU)"}>Magyar (HU)</MenuItem>
                <MenuItem value={"Norwegian (NO)"}>Norwegian (NO)</MenuItem>
                <MenuItem value={"Russian (RU)"}>Russian (RU)</MenuItem>
              </Select>
            </div>
          </div>
        )}

        <Button
          color="secondary"
          variant="contained"
          sx={{ marginLeft: "auto", flexShrink: "0" }}
          disabled={disableSaveButton}
          onClick={() => onSave()}
        >
          Save File...
        </Button>
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
};
