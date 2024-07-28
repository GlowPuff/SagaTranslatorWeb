import { Box, Typography, Container, Paper } from "@mui/material";
import PropTypes from "prop-types";

export default function Footer({ footerText }) {
  return (
    <Paper
      sx={{
        marginTop: "calc(10% + 60px)",
        width: "100%",
        position: "fixed",
        bottom: 0,
        backgroundColor: "purple",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      square
      variant="outlined"
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50px",
          }}
        >
          <Typography variant="caption" color="white">
            {footerText}
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
}

Footer.propTypes = {
  footerText: PropTypes.string,
};
