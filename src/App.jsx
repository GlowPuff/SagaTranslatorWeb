// import { useState } from 'react'
import "./css/dashboard.css";
import projectSchema from "./assets/project-schema.js";
import { Container, Button, Typography, Alert } from "@mui/material";
import MissionChooserDialog from "./components/MissionChooserDialog.jsx";
import { Link, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const projects = projectSchema
    .sort((a, b) => (a.label < b.label ? -1 : 1))
    .map((item, idx) => (
      <Button
        key={idx}
        variant="dashboardButton"
        component={Link}
        to={item.navTo}
      >
        <Typography variant="button" mb={1} mt={1}>
          {item.label}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          mb={1}
        >
          {item.filetypes}
        </Typography>
      </Button>
    ));

  projects.push(
    <Button
      key={projects.length}
      variant="dashboardButton"
      onClick={() => onMissionButton()}
    >
      <Typography variant="button" mb={1} mt={1}>
        mission
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        align="center"
        mb={1}
      >
        CORE1_DE.json, BESPIN4_FR.json, etc.
      </Typography>
    </Button>
  );

  function onMissionButton() {
    MissionChooserDialog.ShowDialog(
      "Select a Mission to Translate",
      (expansion, missionID, customMission, useCustomChecked) => {
        if (!useCustomChecked)
          navigate(`/mission/${expansion}/${missionID}`, {
            state: { customMission: {} },
          });
        else
          navigate("/mission/custom", {
            state: { customMission: customMission },
          });
      }
    );
  }

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div className="gridContainer">{projects}</div>

      <div className="versionDiv">Version {import.meta.env.VITE_VERSION}</div>

      <Alert
        severity="info"
        sx={{
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          margin: "1rem",
          backgroundColor: "purple",
        }}
      >
        Choose which data set you&apos;d like to translate or continue your work
        from.
      </Alert>

      <MissionChooserDialog />
    </Container>
  );
}
export default App;
