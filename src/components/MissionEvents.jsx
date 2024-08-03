import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Typography } from "@mui/material";
//event action components
import ModifyMapEntity from "./EventActions/ModifyMapEntity";
import EnemyDeployment from "./EventActions/EnemyDeployment";
import InputPrompt from "./EventActions/InputPrompt";
import TextBox from "./EventActions/TextBox";
import ChangeMissionInfo from "./EventActions/ChangeMissionInfo";
import ChangeObjective from "./EventActions/ChangeObjective";
import QuestionPrompt from "./EventActions/QuestionPrompt";
import AllyDeployment from "./EventActions/AllyDeployment";
import ChangeGroupInstructions from "./EventActions/ChangeGroupInstructions";
import ChangeRepositionInstructions from "./EventActions/ChangeRepositionInstructions";
import ChangeTarget from "./EventActions/ChangeTarget";
import CustomEnemyDeployment from "./EventActions/CustomEnemyDeployment";

export default function MissionEvents({
  data,
  disabled = false,
  brokenIDs = [],
  onModifyItem,
}) {
  const [eventText, setEventText] = useState(
    Object.entries(data.data).filter((x) => x[0] === "eventText")[0]
  );

  const eventActions =
    Object.entries(data.data).filter((x) => x[0] === "eventActions")[0][1] ||
    [];

  const eventName = Object.entries(data.data).filter(
    (x) => x[0] === "eventName"
  )[0][1];

  const eventGUID = Object.entries(data.data).filter(
    (x) => x[0] === "GUID"
  )[0][1];

  function modifyEventText(value) {
    setEventText(["eventText", value]);
    onModifyItem("eventText", value);
  }

  function getEventActionComponent(eaType, item, key) {
    switch (eaType) {
      case 1:
        return (
          <ChangeMissionInfo
            eaItem={item}
            key={key}
            onModifyItem={onModifyItem}
            disabled={disabled}
            eaIndex={key}
            brokenIDs={brokenIDs}
            eaGUID={item.GUID}
          />
        );
      case 2:
        return (
          <ChangeObjective
            eaItem={item}
            key={key}
            onModifyItem={onModifyItem}
            disabled={disabled}
            eaIndex={key}
            brokenIDs={brokenIDs}
          />
        );
      case 5:
        return (
          <QuestionPrompt
            eaItem={item}
            key={key}
            onModifyItem={onModifyItem}
            disabled={disabled}
            eaIndex={key}
            brokenIDs={brokenIDs}
          />
        );
      case 6:
        return (
          <EnemyDeployment
            eaItem={item}
            key={key}
            onModifyItem={onModifyItem}
            disabled={disabled}
            eaIndex={key}
            brokenIDs={brokenIDs}
          />
        );
      case 7:
        return (
          <AllyDeployment
            eaItem={item}
            key={key}
            onModifyItem={onModifyItem}
            disabled={disabled}
            eaIndex={key}
            brokenIDs={brokenIDs}
          />
        );
      case 11:
        return (
          <ChangeGroupInstructions
            eaItem={item}
            key={key}
            onModifyItem={onModifyItem}
            disabled={disabled}
            eaIndex={key}
            brokenIDs={brokenIDs}
          />
        );
      case 12:
        return (
          <ChangeTarget
            eaItem={item}
            key={key}
            onModifyItem={onModifyItem}
            disabled={disabled}
            eaIndex={key}
            brokenIDs={brokenIDs}
          />
        );
      case 15:
        return (
          <ModifyMapEntity
            eaItem={item}
            key={key}
            onModifyItem={onModifyItem}
            disabled={disabled}
            eaIndex={key}
            brokenIDs={brokenIDs}
            eaGUID={item.GUID}
          />
        );
      case 16:
        return (
          <TextBox
            eaItem={item}
            key={key}
            onModifyItem={onModifyItem}
            disabled={disabled}
            eaIndex={key}
            brokenIDs={brokenIDs}
          />
        );
      case 17:
        return (
          <ChangeRepositionInstructions
            eaItem={item}
            key={key}
            onModifyItem={onModifyItem}
            disabled={disabled}
            eaIndex={key}
            brokenIDs={brokenIDs}
          />
        );
      case 20:
        return (
          <InputPrompt
            eaItem={item}
            key={key}
            onModifyItem={onModifyItem}
            disabled={disabled}
            eaIndex={key}
            brokenIDs={brokenIDs}
          />
        );
      case 21:
        return (
          <CustomEnemyDeployment
            eaItem={item}
            key={key}
            onModifyItem={onModifyItem}
            disabled={disabled}
            eaIndex={key}
            brokenIDs={brokenIDs}
          />
        );
      default:
        return <h4 key={key}>{`Unhandled Event Action ${eaType}`}</h4>;
    }
  }

  return (
    <>
      {!disabled ? (
        <div
          style={{
            marginBottom: "1rem",
            color: !disabled && brokenIDs.includes(eventGUID) ? "red" : "white",
          }}
        >
          <Typography>{`Event: ${eventName}`}</Typography>
        </div>
      ) : (
        <div style={{ marginBottom: "1rem" }}>
          <Typography>Source</Typography>
        </div>
      )}

      <TextField
        value={eventText[1]}
        label={"Event Text"}
        onChange={(e) => modifyEventText(e.target.value)}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        fullWidth
        multiline={true}
        sx={{
          backgroundColor:
            !disabled && brokenIDs.includes(eventText)
              ? "rgba(255, 0, 0, 0.2)"
              : "",
          borderRadius: "5px",
        }}
      />

      {eventName === "Undefined" && !disabled && (
        <Typography variant="p" sx={{ color: "orange" }}>
          This item should not be undefined. Please{" "}
          <a
            style={{ color: "red" }}
            href="https://github.com/GlowPuff/SagaTranslatorWeb/issues"
          >
            report this issue.
          </a>
        </Typography>
      )}

      <div className="spacer1" />

      {/* event actions */}
      {eventActions.length > 0 && (
        <>
          <div style={{ marginBottom: "1rem", color: "white" }}>
            <Typography>{`${eventActions.length} Event Action(s)`}</Typography>
          </div>

          {eventActions.map((item, index) =>
            getEventActionComponent(item.eventActionType, item, index)
          )}
        </>
      )}
    </>
  );
}

MissionEvents.propTypes = {
  data: PropTypes.object,
  disabled: PropTypes.bool,
  brokenIDs: PropTypes.array,
  onModifyItem: PropTypes.func,
};
