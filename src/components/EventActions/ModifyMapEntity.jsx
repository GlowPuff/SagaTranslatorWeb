import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Paper, Typography } from "@mui/material";

export default function ModifyMapEntity({
  eaItem,
  disabled,
  brokenIDs = [],
  eaGUID,
  eaIndex,
  onModifyItem,
}) {
  const [entityItem, setEntityItem] = useState(eaItem);

  function modifyText(index, value) {
    let modified = { ...entityItem };
    modified.translatedEntityProperties[index].theText = value;
    setEntityItem(modified);
    onModifyItem("eventActions", modified, eaIndex);
  }

  function modifyButton(index, btnIndex, value) {
    let modified = { ...entityItem };
    modified.translatedEntityProperties[index].buttonList[btnIndex].theText =
      value;
    setEntityItem(modified);
    onModifyItem("eventActions", modified, eaIndex);
  }

  return (
    <>
      <Paper sx={{ padding: "1rem", marginBottom: "1rem" }}>
        <Typography
          variant="button"
          sx={{
            color: !disabled && brokenIDs.includes(eaGUID) ? "red" : "#6dcaf2",
          }}
        >
          {`Modify Map Entity (${entityItem.translatedEntityProperties.length})`}
        </Typography>

        <div className="spacer" />

        {entityItem.translatedEntityProperties.map((item, index) => (
          <Paper
            key={index}
            sx={{
              padding: "1rem",
              marginBottom: "1rem",
              backgroundColor:
                !disabled && brokenIDs.includes(eaGUID)
                  ? "rgba(255, 0, 0, 0.2)"
                  : "#402d5d",
            }}
            elevation={3}
          >
            <Typography
              variant="button"
              sx={{
                color:
                  !disabled && brokenIDs.includes(eaGUID) ? "red" : "#6dcaf2",
              }}
            >
              {`Entity ${index + 1} - ${item.entityName}`}
            </Typography>

            <div className="spacer" />

            <TextField
              value={item.theText || ""}
              label={"Entity Text"}
              onChange={(e) => modifyText(index, e.target.value)}
              onFocus={(e) => e.target.select()}
              disabled={disabled}
              fullWidth
              multiline={true}
              sx={{
                backgroundColor:
                  !disabled && brokenIDs.includes(item.GUID)
                    ? "rgba(255, 0, 0, 0.2)"
                    : "",
                borderRadius: "5px",
              }}
            />

            {item.buttonList.length > 0 && (
              <div>
                <div className="spacer" />

                <Typography
                  variant="button"
                  sx={{
                    color: "#6dcaf2",
                    marginTop: "1rem",
                  }}
                >
                  {`${item.buttonList.length} Button(s)`}
                </Typography>

                {item.buttonList.map((btn, btnIndex) => (
                  <div key={btnIndex}>
                    <div className="spacer1" />

                    <TextField
                      key={btnIndex}
                      value={btn.theText || ""}
                      label={"Button Text"}
                      onChange={(e) =>
                        modifyButton(index, btnIndex, e.target.value)
                      }
                      onFocus={(e) => e.target.select()}
                      disabled={disabled}
                      fullWidth
                      multiline={true}
                      sx={{
                        backgroundColor:
                          !disabled && brokenIDs.includes(btn.GUID)
                            ? "rgba(255, 0, 0, 0.2)"
                            : "",
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </Paper>
        ))}
      </Paper>
    </>
  );
}

ModifyMapEntity.propTypes = {
  eaItem: PropTypes.object,
  disabled: PropTypes.bool,
  brokenIDs: PropTypes.array,
  eaGUID: PropTypes.string,
  onModifyItem: PropTypes.func,
  eaIndex: PropTypes.number,
};
