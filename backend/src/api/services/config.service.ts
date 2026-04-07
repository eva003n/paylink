import { Config } from "src/models";
import { Id } from "src/schemas/validators";
import {
    ConfigEnv,
  MerchantConfigInput,
  MerchantConfigUpdateInput,
} from "@shared/schemas/validators";

const mapConfigData = (
  config: MerchantConfigInput | MerchantConfigUpdateInput,
) => {
  const data: Partial<{
    env: ConfigEnv,
    consumer_key: string;
    consumer_secret: string;
    short_code: string;
    pass_Key: string;
    callback_url: string;
  }> = {};

  if (config.consumerKey !== undefined) data.consumer_key = config.consumerKey;
  if (config.env !== undefined) data.env = config.env;
  if (config.consumerSecret !== undefined)
    data.consumer_secret = config.consumerSecret;
  if (config.shortCode !== undefined) data.short_code = config.shortCode;
  if (config.passKey !== undefined) data.pass_Key = config.passKey;
  if (config.callbackUrl !== undefined) data.callback_url = config.callbackUrl;

  return data;
};

export const fetchConfig = async (merchantId: Id) => {
  return await Config.findOne({ where: { merchant_id: merchantId } });
};

export const createConfig = async (
  merchantId: Id,
  configData: MerchantConfigInput,
) => {
  const existingConfig = await fetchConfig(merchantId);

  if (existingConfig) {
    return { created: false, config: existingConfig };
  }

  const config = await Config.create({
    merchant_id: merchantId,
    ...mapConfigData(configData),
  });

  return { created: true, config };
};

export const updateConfig = async (
  merchantId: Id,
  configData: MerchantConfigUpdateInput,
) => {
  const config = await fetchConfig(merchantId);
  if (!config) return null;

  await config.update(mapConfigData(configData));

  return config;
};

export const deleteConfig = async (merchantId: Id) => {
  return await Config.destroy({ where: { merchant_id: merchantId } });
};
