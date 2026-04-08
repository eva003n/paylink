import { Merchant, UserRoles } from "./merchants.model";
import { Payment } from "./payments.model";
import { Link } from "./link.model";
import { Client } from "./client.model";
import { Config } from "./config.model";

// merchant associations
Merchant.hasMany(Payment, {
  foreignKey: "merchant_id",
});

Merchant.hasMany(Link, {
  foreignKey: "merchant_id",
  // as: "merchant",
});
Merchant.hasOne(Config, {
  foreignKey: "merchant_id",
});
Payment.belongsTo(Merchant, {
  foreignKey: "merchant_id",
});
// client associations
Client.hasMany(Payment, {
  foreignKey: "client_id",
});
Payment.belongsTo(Client, {
  foreignKey: "client_id",
});
Payment.belongsTo(Merchant, {
  foreignKey: "merchant_id",
});

Link.belongsTo(Merchant, {
  foreignKey: "merchant_id",
  // as: "merchant",
});
Config.belongsTo(Merchant, {
  foreignKey: "merchant_id",
});

export { Merchant, UserRoles, Payment, Link, Client, Config };
