import fs from "node:fs";
import { text, cancel, isCancel, confirm } from "@clack/prompts";

const handleCancel = (value) => {
  if (isCancel(value)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }
};

const getText = async (message, options = {}) => {
  const value = await text({ message, ...options });
  handleCancel(value);
  return value;
};

const getBool = async (message) => {
  const value = await confirm({ message });
  handleCancel(value);
  return value;
};

const getTime = async (message) => {
  const value = await text({
    message,
    validate: (value) => {
      if (!/(\d{2})|(\d{2}:\d{2}:\d{2}(\.\d{1,})?)/.test(value)) {
        return `Time should be in "ss" or "hh:mm:ss" format`;
      }
    },
  });
  handleCancel(value);
  return value;
};

const getSourceFile = async () => {
  const result = await getText("What is a source file?", {
    validate: (value) => {
      if (!fs.existsSync(value)) {
        return `File ${value} does not exist`;
      }
    },
  });

  return result;
};

const getSourceFolder = async () => {
  const result = await getText("What is a source folder?", {
    validate: (value) => {
      if (!fs.existsSync(value)) {
        return `Folder ${value} does not exist`;
      }
    },
  });

  return result;
};

const getFile = async (message) => {
  const result = await getText(message, {
    validate: (value) => {
      if (!fs.existsSync(value)) {
        return `File ${value} does not exist`;
      }
    },
  });

  return result;
};

const getDestFile = async () => {
  const result = await getText("What is a dest file?");

  return result;
};

const getNumber = async (
  message,
  { isPositive = false, inRange = null } = {},
) => {
  const value = await getText(message, {
    validate: (value) => {
      if (isNaN(Number(value))) {
        return `input value should be a type of number, got ${typeof value}`;
      } else if (inRange != null) {
        if (
          value < inRange.min ||
          (!inRange.inclusive ? value >= inRange.max : value > inRange.max)
        ) {
          return `input must be in range [${inRange.min}..${inRange.max}${!inRange.inclusive ? ")" : "]"}`;
        }
      } else if (isPositive && Number(value) < 1) {
        return `input should be larger than 0`;
      }
    },
  });
  return Number(value);
};

export {
  getText,
  getTime,
  getSourceFile,
  getSourceFolder,
  getFile,
  getDestFile,
  getNumber,
  getBool,
};
