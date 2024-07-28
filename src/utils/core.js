import isObject from "lodash/isObject";
import isArray from "lodash/isArray";
import has from "lodash/has";
import forEach from "lodash/forEach";
import { purple, blue } from "@mui/material/colors";

let createTranslatorTheme = {
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "dashboardButton" },
          style: {
            display: "flex",
            flexDirection: "column",
            border: "1px solid purple",
            margin: "0",
          },
        },
      ],
    },
  },
  palette: {
    mode: "dark",
    primary: purple,
    secondary: blue,
    background: {
      default: "#160627",
      paper: "#160627",
    },
    text: {
      primary: "#fff",
      secondary: "rgba(133,219,255,1)",
    },
  },
};

async function saveWithFilePicker(fileData, fileName, callback) {
  // if (import.meta.env.VITE_USE_COMPATIBLE_FILESAVE === "true")
  //   console.log("true");
  // else console.log("false");

  let message = "";
  const mimetype = fileName.endsWith(".txt")
    ? { "text/plain": [".txt"] }
    : { "application/json": [".json"] };

  const opts = {
    suggestedName: fileName,
    types: [
      {
        description: fileName.endsWith(".txt") ? "TXT file" : "JSON file",
        accept: mimetype,
      },
    ],
  };

  try {
    const fileHandle = await window.showSaveFilePicker(opts);
    //console.log("🚀 ~ saveFile ~ fileHandle:", fileHandle);
    const writable = await fileHandle.createWritable();
    await writable.write(fileData);
    await writable.close();
    message = "File Saved";
  } catch (error) {
    if (!`${error}`.includes("AbortError")) {
      message = `Error saving file: ${error}`;
      console.log("🚀 ~ saveFile ~ error:", error);
    }
  } finally {
    if (message) callback(message);
  }
}

function saveWithAlternateMethod(fileData, fileName, callback) {
  let message = "";
  let binaryData = [];

  try {
    binaryData.push(fileData);

    var a = document.createElement("a"),
      url = URL.createObjectURL(
        new Blob(binaryData, { type: "application/json" })
      );
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
    message = "File Saved";
  } catch (error) {
    message = `Error saving file: ${error}`;
    console.log("🚀 ~ saveFile ~ error:", error);
  } finally {
    if (message) callback(message);
  }
}

function saveFile(fileData, fileName, callback) {
  if (typeof fileData === "undefined") {
    callback("Error saving file, no data");
    return;
  }

  if (isObject(fileData))
    fileData = JSON.stringify(fileData, null, "  ").replaceAll("\n", "\r\n");

  if (typeof window.showSaveFilePicker != "undefined") {
    saveWithFilePicker(fileData, fileName, callback);
  } else {
    saveWithAlternateMethod(fileData, fileName, callback);
  }
}

function removeMissingPropertiesDeep(targetObject, sourceObject) {
  const removedProps = [];

  function remMissingProp(tObj, sObj, path = "") {
    if (!isObject(tObj) || !isObject(sObj)) return;

    forEach(tObj, (value, key) => {
      const fullPath = path ? `${path}.${key}` : key;

      if (!has(sObj, key)) {
        //console.log("REMOVING " + key);
        removedProps.push(fullPath);
        delete tObj[key];
      } else {
        if (isObject(value) && isObject(sObj[key])) {
          remMissingProp(value, sObj[key], fullPath);
        }
      }
    });
  }

  remMissingProp(targetObject, sourceObject);

  return removedProps;
}

//ui.json data
function getMissingPropertiesDeep(sourceObject, targetObject) {
  const missingProperties = [];

  const compareObjects = (source, target, path = "") => {
    for (const key in source) {
      const fullPath = path ? `${path}.${key}` : key;
      const sourceValue = source[key];
      const targetValue = target[key];

      if (isObject(sourceValue) && targetValue !== undefined) {
        compareObjects(sourceValue, targetValue, fullPath);
      } else if (!Object.hasOwnProperty.call(target, key)) {
        missingProperties.push(fullPath);
      }
    }
  };

  compareObjects(sourceObject, targetObject);
  return missingProperties;
}

function createTreeListFromArray(sourceArray) {
  const tree = [];
  const itemIndex = 0;

  function createList(sObj, itemIndex) {
    if (isArray(sObj)) {
      forEach(sObj, (value) => {
        tree.push({ id: `${itemIndex++}`, label: value.name });
      });
    } else {
      console.log("SKIPPING, not array: ", sObj);
    }
  }

  createList(sourceArray, itemIndex);

  return tree;
}

//for ui.json
//create a specially formatted array of tree view items, given the raw data array (sourceObj)
//creates a 'path' property so the object's props can be written into with lodash 'set'
function createTreeList(sourceObj) {
  const tree = [];
  const itemIndex = 0;

  function createList(sObj, itemIndex, path = "") {
    if (isObject(sObj)) {
      for (const key in sObj) {
        const fullPath = path ? `${path}.${key}` : key;
        //only get objects, skip languageID (string)
        if (isObject(sObj[key])) {
          let p = itemIndex;
          let newItem = { id: `${itemIndex++}`, label: key, path: fullPath };
          tree.push(newItem);
          newItem.subitems = Object.keys(sObj[key]).map((child) => ({
            id: `${itemIndex++}`,
            label: child,
            parent: `${p}`,
            path: `${fullPath}.${child}`,
          }));
        }
      }
      //sort by keys so source/imported data line up in UI
    }
  }

  createList(sourceObj, itemIndex);

  return tree;
}

//ui.json, sourceObj is the sorted ui object from the source JSON
function createUIList(sourceObj) {
  let tree = [];

  for (const key in sourceObj) {
    if (isObject(sourceObj[key])) {
      let newItem = {
        label: key,
      };
      tree.push(newItem);
    }
  }

  tree = tree.sort((a, b) =>
    a.label < b.label ? -1 : a.label > b.label ? 1 : 0
  );
  for (let index = 0; index < tree.length; index++) {
    tree[index].id = index.toString();
  }

  return tree;
}

//for Mission Card Text
//create a specially formatted array of tree view items, given the raw data array (sObj)
//this tree view list also includes the raw data in the 'dataItem' prop
function createMissionCardList(sObj) {
  const tree = [];
  let itemIndex = 8;

  //root campaign objects in the array (8 items, key is an index)
  for (const key in sObj) {
    let newItem = { ...sObj[key] };
    //go through each mission
    let arrayIndex = 0;
    newItem.children = Object.keys(sObj[key].data).map((child) => ({
      id: `${itemIndex++}`,
      arrayIndex: arrayIndex++,
      label: sObj[key].data[child].id,
      dataItem: sObj[key].data[child],
      parentLabel: sObj[key].label,
      parentID: sObj[key].id,
      filename: sObj[key].filename,
    }));
    tree.push(newItem);
  }

  //console.log("🚀 ~ createMissionCardList ~ FINAL TREE:", tree);
  return tree;
}

//'bonusArray' is an array of bonus effects
// 'deploymentGroups' is used to get the names for the effects
function createBonusEffectsList(bonusArray, deploymentGroups) {
  const tree = [];
  let itemIndex = 0;

  //go through each bonus in the array
  for (let index = 0; index < bonusArray.length; index++) {
    let enemy = deploymentGroups.filter(
      (x) => x.id === bonusArray[index].bonusID
    );
    if (!enemy.length) enemy = [{ name: "Dummy Token" }];

    let newItem = {
      id: (itemIndex++).toString(),
      label: `${bonusArray[index].bonusID} / ${enemy[0].name}`,
      data: bonusArray[index],
      translationData: bonusArray, //the actual translated data
      key: Math.random(),
      path: index,
    };

    tree.push(newItem);
  }
  return tree;
}

function createInstructionList(instArray) {
  const tree = [];
  let itemIndex = 0;

  //go through each instruction in the array
  for (let index = 0; index < instArray.length; index++) {
    let newItem = {
      id: (itemIndex++).toString(),
      label: `${instArray[index].instName}`,
      data: instArray[index],
      key: `${instArray[index].instID}`,
      path: index,
    };

    tree.push(newItem);
  }

  return tree;
}

//groupArray is an array of all group arrays in order: allies, heroes, enemies, villains
function createDeploymentList(groupArray) {
  const tree = [];
  let itemIndex = 4;
  let groupNames = ["Allies", "Heroes", "Enemies", "Villains"];

  //create top level tree items (allies, enemies, etc)
  for (let index = 0; index < 4; index++) {
    let newItem = {
      id: index.toString(),
      label: groupNames[index],
      filename: groupNames[index].toLowerCase() + ".json",
      //TODO get rid of 'data' and use 'children' in the component instead, because of findobjebyid
      data: groupArray[index],
      children: [],
    };
    tree.push(newItem);
  }

  //process group items for each of the 4 deployment group data sets
  for (let index = 0; index < 4; index++) {
    //process each group
    for (let gIndex = 0; gIndex < groupArray[index].length; gIndex++) {
      let newItem = {
        id: (itemIndex++).toString(),
        label: groupArray[index][gIndex].name,
        data: groupArray[index][gIndex],
        parentID: tree[index].id, //string
        arrayIndex: gIndex, //the index in the actual data array
      };
      tree[index].children.push(newItem);
    }
  }

  return tree;
}

//helpArray is the sorted array of help items from the source JSON
function createHelpOverlayList(helpArray) {
  let tree = [];

  for (let index = 0; index < helpArray.length; index++) {
    let newItem = {
      label: helpArray[index].panelHelpID,
      helpItems: [...helpArray[index].helpItems],
    };
    tree.push(newItem);
  }

  // sort by label
  tree = tree.sort((a, b) =>
    a.label < b.label ? -1 : a.label > b.label ? 1 : 0
  );

  //after sorting, give them an id in order, and sort their helpItems by name (id)
  for (let index = 0; index < tree.length; index++) {
    tree[index].id = index.toString();
    tree[index].helpItems = tree[index].helpItems.sort((a, b) =>
      a.id < b.id ? -1 : a.id > b.id ? 1 : 0
    );
  }

  return tree;
}

//missionData is the mission translation JSON
function createMissionList(missionData) {
  let tree = [];
  let index = 0;
  let missionProps = {
    id: (index++).toString(),
    label: "Mission Properties",
    data: missionData.missionProperties,
    dataType: "missionProperties",
  };
  let missionEvents = {
    id: (index++).toString(),
    label: "Events",
    children: [],
    dataType: "events",
  };
  let missionMapEntities = {
    id: (index++).toString(),
    label: "Map Entities",
    children: [],
    dataType: "mapEntities",
  };
  let missionInitialGroups = {
    id: (index++).toString(),
    label: "Initial Groups",
    children: [],
    dataType: "initialGroups",
  };

  //mission props
  tree.push(
    missionProps,
    missionEvents,
    missionMapEntities,
    missionInitialGroups
  );

  //events
  missionData.events.map((value, idx) => {
    let missionEvent = {
      id: (index++).toString(),
      label: value.eventName,
      data: value,
      dataType: "events",
      itemIndex: idx,
    };
    missionEvents.children.push(missionEvent);
  });

  //entities
  missionData.mapEntities.map((value, idx) => {
    let missionEntity = {
      id: (index++).toString(),
      label: value.entityName,
      data: value,
      dataType: "mapEntities",
      itemIndex: idx,
    };
    missionMapEntities.children.push(missionEntity);
  });

  //initial groups
  missionData.initialGroups.map((value, idx) => {
    let missionGroup = {
      id: (index++).toString(),
      label: value.cardName,
      data: value,
      dataType: "initialGroups",
      itemIndex: idx,
      classes: {
        label: {
          backgroundColor: "green",
          color: "red",
        },
      },
    };
    missionInitialGroups.children.push(missionGroup);
  });

  return tree;
}

//arr is a specially formatted tree view list array
//these tree view objects have an 'id' and 'children'
//find and return an object by 'id' inside a tree view object array
function findObjectById(arr, id) {
  for (const item of arr) {
    if (item.id === id) {
      return item;
    } else if (Array.isArray(item.children)) {
      const foundInChild = findObjectById(item.children, id);
      if (foundInChild) return foundInChild;
    }
  }
  return null;
}

export {
  createTreeList,
  findObjectById,
  getMissingPropertiesDeep,
  removeMissingPropertiesDeep,
  saveFile,
  createTranslatorTheme,
  createTreeListFromArray,
  createMissionCardList,
  createBonusEffectsList,
  createInstructionList,
  createDeploymentList,
  createHelpOverlayList,
  createUIList,
  createMissionList,
};
