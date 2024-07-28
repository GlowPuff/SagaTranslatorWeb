// import { useState } from "react";
import PropTypes from "prop-types";
import MissionProps from "./MissionProps";
import MissionEvents from "./MissionEvents";
import MissionEntity from "./MissionEntity";
import MissionInitialGroups from "./MissionInitialGroups";

//data.data = actual data object, data.dataType = string ("missionProps", "missionEvents", etc)
export default function MissionLayout({
  data,
  disabled = false,
  brokenIDs = [],
  onModifyItem,
}) {
  return (
    <>
      {/* mission props */}
      {data.dataType === "missionProperties" && (
        <MissionProps
          data={data}
          disabled={disabled}
          brokenIDs={brokenIDs}
          onModifyItem={onModifyItem}
        />
      )}
      {/* events */}
      {data.dataType === "events" && (
        <MissionEvents
          data={data}
          disabled={disabled}
          brokenIDs={brokenIDs}
          onModifyItem={onModifyItem}
        />
      )}
      {/* entities */}
      {data.dataType === "mapEntities" && (
        <MissionEntity
          data={data.data}
          disabled={disabled}
          brokenIDs={brokenIDs}
          onModifyItem={onModifyItem}
        />
      )}
      {/* initial groups */}
      {data.dataType === "initialGroups" && (
        <MissionInitialGroups
          data={data.data}
          disabled={disabled}
          brokenIDs={brokenIDs}
          onModifyItem={onModifyItem}
        />
      )}
    </>
  );
}

MissionLayout.propTypes = {
  data: PropTypes.object,
  disabled: PropTypes.bool,
  brokenIDs: PropTypes.array,
  onModifyItem: PropTypes.func,
};
