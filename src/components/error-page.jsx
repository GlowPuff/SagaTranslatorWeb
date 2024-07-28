import { useRouteError } from "react-router-dom";
import { Alert, Typography, Container } from "@mui/material";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div id="error-page">
        <Alert
          severity="error"
          sx={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            margin: "1rem",
            backgroundColor: "purple",
          }}
        >
          <Typography variant="h1">Oops</Typography>
          <Typography variant="p">
            Sorry, an unexpected error has occurred.
          </Typography>
					<br></br>
          <Typography variant="p">
            <i>{error.statusText || error.message}</i>
          </Typography>
        </Alert>
      </div>
    </Container>
  );
}
