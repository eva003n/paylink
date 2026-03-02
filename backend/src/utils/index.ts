import path from "path"
import { ZodIssue } from "zod";

const getAbsolutePath = (pathString: string) => {
    // const __dirName = path.dirname(__filename);

    return path.resolve(__dirname, pathString);
}

const formatError = (errors: ZodIssue[]) => {
  return errors.map((error: ZodIssue) => ({
    detail: error.message,
    field: error.path,
  }));
};

const getTimeStamp = () => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-T:\.Z]/g, "")
    .slice(0, 14); // YYYYMMDDHHmmss

    return timestamp
}

export {
    getAbsolutePath,
    formatError,
    getTimeStamp
}