import fs from 'node:fs';
import { text, cancel, isCancel } from "@clack/prompts";

const handleCancel = (value) => {
    if (isCancel(value)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }
};

const getText = async (options) => {
    const value = await text({type: 'text', ...options});
    handleCancel(value);
    return value;
};

const getSourceFile = async () => {
    const result = await getText({
        message: 'What is a source file?',
        validate: (value) => {
        if (!fs.existsSync(value)) {
            return `File ${value} does not exist`;
        }
        },
    });

    return result;
};

const getFile = async (message) => {
    const result = await getText({
        message,
        validate: (value) => {
        if (!fs.existsSync(value)) {
            return `File ${value} does not exist`;
        }
        },
    });

    return result;
};

const getDestFile = async () => {
    const result = await getText({
        message: 'What is a dest file?',
    });

    return result;
};

const getNumber = async (message, { isPositive = false } = {}) => {
    const value = await getText({
        message,
        validate: (value) => {
        if (isNaN(Number(value))) {
            return `input value should be a type of number, got ${typeof value}`;
        } else if (isPositive && Number(value) < 1) {
            return `input should be larger than 0`;
        }
        },
    });
    return Number(value);
};

export {
    getText,
    getSourceFile,
    getFile,
    getDestFile,
    getNumber,
};
