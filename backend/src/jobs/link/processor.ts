import { linkStatusSchema } from "@paylink/shared";
import  logger  from "../../api/logger/logger.winston";
import { Link } from "../../api/models";
import { LinkExpiry } from "../../schemas/validators";

export const handleLinkExpiry = async (linkData: LinkExpiry) => {
  try {
    const link = await Link.findByPk(linkData.linkId);
    if (!link) {
      logger.error(`Link with ID: ${linkData.linkId} does not exists`);
      return;
    }

    link.set("status", linkStatusSchema.enum.Expired);
    await link.save();

    logger.info(`Link with ID: ${link.id} updated to status: ${link.status}`);
  } catch (error) {
    logger.error(
      `Error while expiring link with ID: ${linkData.linkId} error: ${error.message}`,
    );
  }
};
