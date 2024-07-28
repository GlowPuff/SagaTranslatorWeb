//find and report missing props, then fix the data with defaults
//sourceObj is the array of objects in help.json
//both need to first be sorted with the same array item order
function fixHelpOverlay(sourceArray, translatedArray) {
  const missingProperties = [];
  let fixed = JSON.parse(JSON.stringify(translatedArray));
  let brokenIDs = []; //array of IDs of missing items for color coding red

  //check root items
  sourceArray.forEach((rootItem, index) => {
    let hasRoot = translatedArray.find(
      (x) => x.panelHelpID === rootItem.panelHelpID
    );
    if (hasRoot === undefined) {
      missingProperties.push("Missing Category: " + rootItem.panelHelpID);
      //add the missing root item
      fixed.splice(index, 0, rootItem);
      brokenIDs.push(index);
    } else {
      //console.log("GET: ", get(sourceArray, `${index}.helpItems`));
      //check each help item in the root category
      rootItem.helpItems.forEach((item, hIndex) => {
        //console.log("GET: ", get(sourceArray, `${index}.helpItems.${hIndex}.id`));
        let hasItem = translatedArray[index].helpItems.find(
          (x) => x.id === item.id
        );
        //console.log("🚀 ~ hasItem:", hasItem);
        if (hasItem === undefined) {
          missingProperties.push(
            "Missing Item: " +
              translatedArray[index].panelHelpID +
              " -> " +
              item.id
          );
          fixed[index].helpItems.splice(hIndex, 0, item);
          brokenIDs.push(item.id);
        }
      });
    }
  });

  return [missingProperties, fixed, brokenIDs];
}

function validateMission(source, translation) {
  //source data arrays are already sorted
  //array of GUIDs/prop names of missing items for color coding red
  let broken = []; //["missing category", "missing name", "list label to mark red"]
  let markRed = [];
  let fixed = JSON.parse(JSON.stringify(translation));
  let sourceCopy = JSON.parse(JSON.stringify(source));

  //mission props
  Object.entries(sourceCopy.missionProperties).map((item) => {
    //console.log("Checking ", item[0]);
    if (!Object.hasOwnProperty.call(translation.missionProperties, item[0])) {
      //add the missing property
      fixed.missionProperties[item[0]] = item[1];
      //mark it as missing
      broken.push(["Mission Property", item[0]]);
      markRed.push("Mission Properties");
    }
  });

  //initial groups
  //sort the data so we can compare each item in an expected order
  sourceCopy.initialGroups = sourceCopy.initialGroups.sort((a, b) =>
    a.cardName < b.cardName ? -1 : a.cardName > b.cardName ? 1 : 0
  );
  fixed.initialGroups = fixed.initialGroups.sort((a, b) =>
    a.cardName < b.cardName ? -1 : a.cardName > b.cardName ? 1 : 0
  );
  //clip the translated array so it's the same length as the expected item count
  fixed.initialGroups.splice(sourceCopy.initialGroups.length);

  //check if the translation contains all the source items
  sourceCopy.initialGroups.forEach((item) => {
    if (
      fixed.initialGroups.filter((x) => item.cardName == x.cardName).length ===
      0
    )
      broken.push(["Missing Initial Group", item.cardName]);
  });

  //fix any missing or out of order items
  sourceCopy.initialGroups.forEach((item, index) => {
    if (index < fixed.initialGroups.length) {
      //compare items
      if (fixed.initialGroups[index].cardName !== item.cardName) {
        fixed.initialGroups[index].cardName = item.cardName;
        fixed.initialGroups[index].customInstructions = item.customInstructions;
      }
    } else {
      //end of list, just add the missing item
      fixed.initialGroups.push({
        cardName: item.cardName,
        customInstructions: item.customInstructions,
      });
    }
  });

  //map entities
  //check if the translation contains all the source items
  let missing = [];
  sourceCopy.mapEntities.forEach((item) => {
    if (!fixed.mapEntities.some((x) => item.GUID === x.GUID)) {
      broken.push([`Missing Map Entity (${item.entityName})`, item.GUID]);
      markRed.push(item.entityName);
      missing.push(item);
    }
  });

  //add missing items
  missing.forEach((item) => {
    fixed.mapEntities.push(item);
  });

  //verify and remove items that don't exist in the source
  for (let index = fixed.mapEntities.length - 1; index >= 0; index--) {
    if (
      !sourceCopy.mapEntities.some(
        (src) => src.GUID === fixed.mapEntities[index].GUID
      )
    ) {
      broken.push([
        "Removing Entity that doesn't exist in the source data",
        fixed.mapEntities[index].entityName,
      ]);
      //remove the non-existant item
      fixed.mapEntities.splice(index, 1);
    }
  }

  //make sure each entity has the same button data as the source
  sourceCopy.mapEntities.forEach((srcItem) => {
    //find the matching translated entity
    let tItem = fixed.mapEntities.find((x) => x.GUID === srcItem.GUID);
    if (tItem !== undefined) {
      let notFound = []; //button GUID that doesn't exist in source
      tItem.buttonList.forEach((btn) => {
        if (!srcItem.buttonList.some((x) => x.GUID === btn.GUID)) {
          notFound.push(btn.GUID);
        }
      });
      //remove buttons that weren't found in the source
      for (let index = tItem.buttonList.length - 1; index >= 0; index--) {
        if (notFound.includes(tItem.buttonList[index].GUID)) {
          broken.push([
            "Entity Button doesn't exist in the source data",
            tItem.buttonList[index].theText,
          ]);
          tItem.buttonList.splice(index, 1);
        }
      }
      //check for missing button data
      srcItem.buttonList.forEach((btn, index) => {
        if (!tItem.buttonList.some((x) => x.GUID === btn.GUID)) {
          //add the missing button to the translation at the same array position
          tItem.buttonList.splice(index, 0, btn);
          broken.push([
            "Entity Button is missing: " +
              srcItem.entityName +
              "->" +
              btn.theText,
            btn.GUID,
          ]);
          markRed.push(srcItem.entityName);
        }
      });
    }
  });

  //events
  missing = [];
  //check if the translation contains all the source events
  sourceCopy.events.forEach((item) => {
    if (!fixed.events.some((x) => item.GUID === x.GUID)) {
      broken.push([`Missing Event (${item.eventName})`, item.GUID]);
      missing.push(item);
      markRed.push(item.eventName);
    }
  });

  //add missing events
  missing.forEach((item) => {
    fixed.events.push(item);
  });

  //verify and remove events that don't exist in the source
  for (let index = fixed.events.length - 1; index >= 0; index--) {
    if (
      !sourceCopy.events.some((src) => src.GUID === fixed.events[index].GUID)
    ) {
      broken.push([
        "Event doesn't exist in the source data",
        fixed.events[index].eventName,
      ]);
      //remove the non-existant item
      fixed.events.splice(index, 1);
    }
  }

  //make sure each event has the same event action data as the source
  sourceCopy.events.forEach((srcItem) => {
    let tItem = fixed.events.find((x) => x.GUID === srcItem.GUID);
    if (tItem !== undefined) {
      //check for missing EAs
      srcItem.eventActions.forEach((srcEa, index) => {
        if (!tItem.eventActions.some((x) => x.GUID === srcEa.GUID)) {
          broken.push([
            `Event [${srcItem.eventName}] is missing Event Action [${srcEa.eaName}]`,
            srcEa.GUID,
          ]);
          markRed.push(srcItem.eventName);
          //add the EA into the translation
          tItem.eventActions.splice(index, 0, srcEa);
        }
      });

      //make sure translation EAs are also in the source
      let notFound = [];
      tItem.eventActions.forEach((tEA) => {
        if (!srcItem.eventActions.some((x) => x.GUID === tEA.GUID))
          notFound.push(tEA.GUID);
      });

      for (let index = tItem.eventActions.length - 1; index >= 0; index--) {
        if (notFound.includes(tItem.eventActions[index].GUID)) {
          broken.push([
            `Event [${tItem.eventName}] contains an Event Action that doesn't exist in the source`,
            tItem.eventActions[index].eaName,
          ]);
          tItem.eventActions.splice(index, 1);
        }
      }

      //make sure each EA has the expected EA specific sub-items (buttons, inputs, etc)
      srcItem.eventActions.forEach((srcEa) => {
        let tItem = fixed.events.find((x) => x.GUID === srcItem.GUID);
        if (
          tItem !== undefined &&
          Object.hasOwnProperty.call(srcEa, "buttonList") &&
          Object.hasOwnProperty.call(tItem, "buttonList")
        ) {
          //console.log("🚀 ~ srcEa with buttons:", srcEa);

          srcEa.buttonList.forEach((btn, index) => {
            let btnEa = tItem.eventActions.find((x) => x.GUID === srcEa.GUID);

            if (
              Object.hasOwnProperty.call(btnEa, "buttonList") &&
              !btnEa.buttonList.some((tb) => tb.GUID === btn.GUID)
            ) {
              markRed.push(srcItem.eventName);
              broken.push([
                `Event [${srcItem.eventName}] is missing a button [${btn.theText}]`,
                btn.GUID,
              ]);
              //add the button
              btnEa.buttonList.splice(index, 0, btn);
            }
          });

          //remove any buttons that don't exist in the source
          let notFound = [];
          tItem.buttonList.forEach((btn) => {
            if (!srcEa.buttonList.some((x) => x.GUID === btn.GUID))
              notFound.push(btn.GUID);
          });
          for (let index = tItem.buttonList.length - 1; index >= 0; index--) {
            if (notFound.includes(tItem.buttonList[index].GUID)) {
              console.log("Remove ", tItem.buttonList[index].GUID);
              tItem.buttonList.splice(index, 1);
            }
          }
        }
      });
    }
  });

  console.log("🚀 ~ validateMission ~ fixed:", fixed);

  return [broken, fixed, markRed];
}

export { fixHelpOverlay, validateMission };
