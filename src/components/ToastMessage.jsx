//mui
import { Snackbar, Slide } from "@mui/material";
//react
import { useState } from "react";

export default function ToastMessage() {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  function showToast(message) {
    setToastOpen(true);
    setSnackbarMessage(message);
  }
  ToastMessage.showToast = showToast;

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };

  return (
    <Snackbar
      open={toastOpen}
      autoHideDuration={4000}
      onClose={handleSnackClose}
      message={snackbarMessage}
      TransitionComponent={Slide}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    />
  );
}
