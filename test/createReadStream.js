import yuml2svg from "yuml2svg";
import { createReadStream, promises as fs } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const inputFile = join(__dirname, "test.yuml");
const outputFile = join(__dirname, "dark.yuml.svg");

export default Promise.all([
  yuml2svg(createReadStream(inputFile), { isDark: true }).then(Buffer.from),
  fs.readFile(outputFile),
]).then(([actualOutput, expectedOutput]) => {
  if (Buffer.compare(actualOutput, expectedOutput) === 0) {
    return Promise.resolve("Success for dark diagram with streams");
  } else {
    console.warn("Output of dark diagram has been modified");

    return fs
      .writeFile(outputFile, actualOutput)
      .then(() =>
        Promise.reject(new Error("Wrong output for dark diagram with streams"))
      );
  }
});
