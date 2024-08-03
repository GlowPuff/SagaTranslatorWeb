import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useState } from "react";
import { Typography } from "@mui/material";

export default function DialogBox() {
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");

  const reportUIErrors = (missingPropsArray, removedPropsArray) => {
    //console.log("🚀 ~ reportUIErrors ~ missingPropsArray:", missingPropsArray);
    let missingCount = missingPropsArray.length;
    let removedCount = removedPropsArray.length;

    setDialogContent(
      <>
        {missingPropsArray.length > 0 && (
          <>
            <DialogTitle>
              Missing Properties [{missingCount}] Found in Imported Data
            </DialogTitle>
            <DialogContent>
              <List sx={{ pt: 0 }}>
                {missingPropsArray.map((item) => (
                  <ListItem
                    disableGutters
                    key={item}
                    sx={{ margin: 0, padding: 0 }}
                  >
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
          </>
        )}
        {removedPropsArray.length > 0 && (
          <>
            <DialogTitle>
              Removed Properties [{removedCount}] From Imported Data
            </DialogTitle>
            <DialogContent>
              <List sx={{ pt: 0 }}>
                {removedPropsArray.map((item) => (
                  <ListItem
                    disableGutters
                    key={item}
                    sx={{ margin: 0, padding: 0 }}
                  >
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
          </>
        )}
      </>
    );

    setOpen(true);
  };
  DialogBox.ReportUIErrors = reportUIErrors;

  const showGenericDialog = (dialogTitle, dialogContent) => {
    setDialogContent(
      <>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
      </>
    );

    setOpen(true);
  };
  DialogBox.ShowGenericDialog = showGenericDialog;

  const reportMissionErrors = (missingPropsArray, removedPropsArray) => {
    let missingCount = missingPropsArray.length;
    //console.log("🚀 ~ reportMissionErrors ~ missingCount:", missingCount);
    let removedCount = removedPropsArray.length;

    setDialogContent(
      <>
        {missingPropsArray.length > 0 && (
          <>
            <DialogTitle>
              Errors [{missingCount}] Found and Fixed in Imported Data
            </DialogTitle>
            <DialogContent>
              <List sx={{ pt: 0 }}>
                {missingPropsArray.map((item, index) => (
                  <ListItem
                    disableGutters
                    key={index}
                    sx={{ margin: 0, padding: 0 }}
                  >
                    <ListItemText primary={`${item[0]} -> ${item[1]}`} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
          </>
        )}
        {removedPropsArray.length > 0 && (
          <>
            <DialogTitle>
              Removed Properties [{removedCount}] From Imported Data
            </DialogTitle>
            <DialogContent>
              <List sx={{ pt: 0 }}>
                {removedPropsArray.map((item, index) => (
                  <ListItem
                    disableGutters
                    key={index}
                    sx={{ margin: 0, padding: 0 }}
                  >
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
          </>
        )}
      </>
    );

    setOpen(true);
  };
  DialogBox.ReportMissionErrors = reportMissionErrors;

  const showGenericError = (dialogTitle, message, error) => {
    setDialogContent(
      <>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography>{message}</Typography>
          <Typography color={"orange"}>{error}</Typography>
        </DialogContent>
      </>
    );

    setOpen(true);
  };
  DialogBox.ShowGenericError = showGenericError;

  return (
    <Dialog open={open} maxWidth={"sm"} fullWidth={true} scroll={"paper"}>
      {dialogContent}
      <DialogActions>
        <Button variant="contained" onClick={() => setOpen(false)}>
          ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
