import logger from "../../logger/logger.winston";
import { getAbsolutePath } from "../../utils/index";
import { NODE_ENV } from "../env";
import { sequelize } from "./postgres";
import { SequelizeStorage, Umzug } from "umzug";





        console.log(`${getAbsolutePath("../../../", __dirname)}`);

const umzug = new Umzug({
  migrations: {
    glob:[
      NODE_ENV === "production"
        ? "dist/migrations/.*js"
        : "src/migrations/*.ts",
        {cwd: `${getAbsolutePath("../../../", __dirname)}`}]
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: logger,
});

// helper functions

export const runmigrations = async () => {
  logger.info(`Running migrations in ${NODE_ENV} environment`);

  logger.info(`🔍 Searching for migrations in ${sequelize.config.database} database`);

  const pendingMigrations = await umzug.pending();
  if (pendingMigrations.length === 0) {
    logger.info("✅ No pending migrations. Database is up to date.");
    return;
  } else {
    logger.info(`🔄 Found ${pendingMigrations.length} pending migrations.`);
  }

  await umzug.up();
    let percentage =
      (pendingMigrations.length / (await umzug.executed()).length) * 100;
    while (pendingMigrations.length) {
      logger.info(`✅ Migrations done: ${percentage}%`);
    }

};

export const revertLastMigration = async () => {
  logger.info(`Rerveting migrations in ${NODE_ENV} environment`);

  logger.info(
    `⏳ Reverting last database migration (Database -> ${sequelize.config.database})`,
  );
  const result = await umzug.down();
  logger.info(
    "⏪ Reverted database migration",
    JSON.stringify(result?.[0]?.name),
  );
}