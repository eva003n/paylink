import base62 from "@sindresorhus/base62";
import { FRONTEND_BASE_URI } from "../../config/env";
import { Merchant, Link } from "../../models";
import { FilterOption, PaymentLink } from "@shared/schemas/validators";
import { Id } from "src/schemas/validators";
import { LinkStatus } from "@shared/schemas/validators";
import { LinkDTO } from "../dto";
import { sequelize } from "src/config/db/postgres";

export const generatePaymentLink = async (
  linkData: PaymentLink & { merchant_id: string },
) => {
  const merchant = await Merchant.findByPk(linkData.merchant_id);

  if (!merchant) return { merchant, link: null };
  const link = await Link.create({
    shortCode: linkData.shortCode,
    amount: linkData.amount,
    merchant_id: merchant.id,
    url: "",
    expiresAt: linkData.expiresAt,
  });

  const base62String = base62.encodeString(link.id);
  const baseUrl = FRONTEND_BASE_URI;
  const url = `${baseUrl}/payments/payment-link?token=${base62String}`;
  link.set("url", `${url}`);
  link.set("token", `${base62String}`);

  await link.save();
  return { merchant, link };
};

type FilterOptions = {
  status: LinkStatus;
} & FilterOption;
export const getAllLinks = async (id: Id, options: FilterOptions) => {
  return getPaginatedLinks(id, options);
};

export const findLink = async (token: Id) => {
  const linkId = base62.decodeString(token);

  const link = await Link.findByPk(linkId, {
    attributes: [
      "id",
      "amount",
      "status",
      "shortCode",
      [sequelize.col("Merchant.business_name"), "businessName"], // rename column
    ],
    include: {
      model: Merchant,
      as: "Merchant",
      attributes: [],// do not include any attributes i merchat

      required: true, // perform inner join
    },
  });

  return link;
};

const getPaginatedLinks = async (id: Id, filtersOptions: FilterOptions) => {
  //inplements page by page logic
  const offset = (filtersOptions.page - 1) * filtersOptions.limit;

  //build an object of dynamic filters
  const filters = {
    merchant_id: id,
    status: filtersOptions.status,
  };

  //convert resulting array to object for filtering
  const where = Object.fromEntries(
    //build an array of key value pairs removing empty values
    Object.entries(filters).filter(([_, v]) => v?.toString().trim()),
  );

  const { rows, count } = await Link.findAndCountAll({
    where,
    limit: filtersOptions.limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    links: rows.map((link) => LinkDTO.create(link.dataValues)),
    currentPage: filtersOptions.page,
    totalPages: Math.ceil(count / filtersOptions.limit),
    totalItems: count,
  };
};
