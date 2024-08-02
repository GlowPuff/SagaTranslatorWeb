import PropTypes from "prop-types";
import { useRef, useState } from "react";
import Typography from "@mui/material/Typography";

function DragDropDiv({
  onFileDropped,
  disabled = false,
  instructionText = "Drag and drop the file here to open it.",
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const readerRef = useRef(null); // useRef to hold FileReader instance
  const defaultMessage = "Drag and drop a file here to import it.";

  const handleDragOver = (event) => {
    event.preventDefault(); // Prevent default behavior (opening the file)
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (disabled) return;

    setIsDragOver(false);

    const file = event.dataTransfer.files[0];

    if (!readerRef.current) {
      readerRef.current = new FileReader();
    }

    const reader = readerRef.current;
    reader.onload = (event) => {
      // file content as text
      onFileDropped(file, event.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div
      className={
        "dottedOutline " +
        (disabled ? "dottedDisabled" : isDragOver ? "dottedGreen" : "")
      }
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={() => setIsDragOver(false)}
    >
      <Typography variant="p" color="inherit" component="div">
        <i>{disabled ? instructionText : defaultMessage}</i>
      </Typography>{" "}
    </div>
  );
}

DragDropDiv.propTypes = {
  onFileDropped: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  instructionText: PropTypes.string,
};

export default DragDropDiv;
