import { plural, singular } from "pluralize";
import cryptojs from "crypto-js";

export function encryptData(data: string, key: string) {
  return cryptojs.RC4.encrypt(data, key).toString();
}

export function decryptData(data: string, key: string) {
  const bytes = cryptojs.RC4.decrypt(data, key);
  return bytes.toString(cryptojs.enc.Utf8);
}

export const filterAttrs = (
  obj: any,
  toRemove: any,
  oclusive: boolean = true
) => {
  const newObj: any = {};
  for (var attr in obj) {
    // if (!obj[attr]) (`⚠️ ${attr}: Its null or undefined ⚠️`.yellow);
    if (!oclusive === toRemove.includes(attr)) {
      newObj[attr] = obj[attr];
    }
  }
  return newObj;
};

export const getEntityProperties = (Entity: any) => {
  const newObj: any = {};
  for (var attr in Entity) {
    if (typeof Entity[attr] !== "function") newObj[attr] = Entity[attr];
  }
  return newObj;
};

export const Mapfy = (object: any): any => {
  if (!object) return;
  return new Map(Object.entries(object));
};

export const UnMapfy = (map: any): any => {
  if (!map) return;
  return Object.fromEntries(map.entries());
};

export const settingName = (value: any) =>
  "set" + value.slice(0, 1).toUpperCase() + value.slice(1);

export const getActionTypes = (object: any) => {
  const actionTypes: any = {};
  for (var key of object.keys()) {
    actionTypes[settingName(key)] = settingName(key);
  }
  actionTypes["reset"] = "reset";
  return actionTypes;
};

export const setEnums = (enums: string[], entity: any = {}) => {
  // enums = [...enums, "reset"];
  const types: any = {};
  enums.forEach((E: any) => (types[E] = E));
  return Object.freeze({ ...types });
};

export const Enumfy = (object: Array<String> | Object) => {
  const enumObj: any = {};
  if (Array.isArray(object)) object.forEach((i: string) => (enumObj[i] = i));
  return Object.freeze(enumObj);
};

export const execFunc = async (func: Function | any) => {
  if (typeof func !== "function") {
    "Not implemented yet!".red;
    return;
  }
  try {
    await func();
  } catch (e: any) {
    e.message.red;
  }
};

/**
 * @LP Lower Case Plural (LowerPlural)
 * @LS Lower Case Singular (LowerSingle)
 * @CP Camel Case Plural (CamelPlural)
 * @CS Camel Case Singular (CamelSingle)
 * @UP Upper Case Plural (UpperPlural)
 * @US Upper Case Singular (UpperSingle)
 */
export const labelCases = (label: string, normal: boolean = true) => {
  label = normal ? normalize(label) : label;
  return Object.defineProperties(Object(String(label)), {
    LP: { value: plural(label.toLowerCase()), writable: false },
    LS: { value: singular(label.toLowerCase()), writable: false },
    CP: { value: plural(capitalize(label)), writable: false },
    CS: { value: singular(capitalize(label)), writable: false },
    UP: { value: plural(label).toUpperCase(), writable: false },
    US: { value: singular(label).toUpperCase(), writable: false },

    toString: { value: () => label },
  });
};

export const normalize = (str: any) => {
  const from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
    to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
    mapping: any = {};

  for (var i = 0, j: any = from.length; i < j; i++)
    mapping[from.charAt(i)] = to.charAt(i);

  var ret: any = [];
  for (var i = 0, j = str.length; i < j; i++) {
    var c: any = str.charAt(i);
    if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c]);
    else ret.push(c);
  }
  return ret.join("");
};

export const capitalize = (label: any, pluralize: boolean = false) => {
  return (
    label[0].toUpperCase() +
    label.slice(1).toLowerCase() +
    (pluralize ? "s" : "")
  );
};

export const createEnumFromArray = (array: Array<any>) =>
  Object.freeze(Object.fromEntries(array.map((item: any) => [item, item])));

export const fromEnumToArray = (_enum: any) =>
  new Array(Object.entries(_enum))[0]
    .splice(Object.entries(_enum).length / 2)
    .flatMap((e: any) => e[0]);

export const mapToList = (data: any, onlyValues = true): any => {
  if (!data) return;
  return Object.entries({ ...data }).map((data) =>
    onlyValues ? data[1] : data
  );
};

export const listToMap = (data: any): any => {
  if (!data) return;
  return Object.fromEntries(
    [...data].map((data: any, index: any) => [index, data])
  );
};

export const genRandomId = () => {
  return Number(String(Math.random()).replace("0.", ""));
};
