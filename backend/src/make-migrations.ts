import fs from "fs";
import { getAbsolutePath, getTimeStamp } from "./api/utils/index";

const name = process.argv[2];
if (!name) {
  console.error(
    "❌  Please provide a migration name, e.g. pnpm run make:migration create-users",
  );
  process.exit(1);
}

const timestamp = getTimeStamp();

const fileName = `${timestamp}-${name}.ts`;
const filePath = getAbsolutePath(`../migrations/${fileName}`);

console.log(filePath);

const template = `import { DataTypes } from "sequelize";
import {QueryInterface} from "sequelize"

 async function up({ context: queryInterface }: {context: QueryInterface }) {
  // TODO: write migration logic here
}

 async function down({ context: queryInterface }: {context: QueryInterface }) {
  // TODO: revert migration logic here
}

export { up, down };
`;

fs.appendFileSync(filePath, template);
console.log(`✅ Created migration file ${fileName}`, filePath);
