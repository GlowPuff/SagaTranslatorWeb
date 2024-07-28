import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
//mui
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
//my library
import { createTranslatorTheme } from "./utils/core.js";
//router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/error-page.jsx";
//routes
import UserInterface from "./routes/userinterface.jsx";
import CampaignInfo from "./routes/campaigninfo.jsx";
import CampaignItems from "./routes/campaignitems.jsx";
import CampaignSkills from "./routes/campaignskills.jsx";
import CampaignRewards from "./routes/campaignrewards.jsx";
import MissionCardText from "./routes/missioncardtext.jsx";
import BonusEffects from "./routes/bonuseffects.jsx";
import EnemyInstructions from "./routes/enemyinstructions.jsx";
import DeploymentCard from "./routes/deploymentcard.jsx";
import HelpOverlay from "./routes/helpoverlay.jsx";
import Mission from "./routes/mission.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "userinterface",
    element: <UserInterface />,
  },
  {
    path: "campaigninfo",
    element: <CampaignInfo />,
  },
  {
    path: "campaignitems",
    element: <CampaignItems />,
  },
  {
    path: "campaignskills",
    element: <CampaignSkills />,
  },
  {
    path: "campaignrewards",
    element: <CampaignRewards />,
  },
  {
    path: "missioncardtext",
    element: <MissionCardText />,
  },
  {
    path: "bonuseffects",
    element: <BonusEffects />,
  },
  {
    path: "enemyinstructions",
    element: <EnemyInstructions />,
  },
  {
    path: "deploymentcard",
    element: <DeploymentCard />,
  },
  {
    path: "helpoverlay",
    element: <HelpOverlay />,
  },
  {
    path: "mission/:expansion/:missionID",
    element: <Mission />,
  },
  {
    path: "mission/:expansion/",
    element: <Mission />,
  },
]);

const darkTheme = createTheme(createTranslatorTheme);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
