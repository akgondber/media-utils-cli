import { cancel, isCancel } from "@clack/prompts";

const cancelAndExit = () => {
  cancel("Cancelled by you.");
  process.exit(0);
};

const handleCancel = (result) => {
  if (isCancel(result)) {
    cancelAndExit();
  }
};

export { cancelAndExit, handleCancel };
