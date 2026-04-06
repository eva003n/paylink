import {Merchant, UserRoles} from "./merchants.model"
import {Payment, PaymentStatus} from "./payments.model"
import { Link } from "./link.model"
import {Client} from "./client.model"

// merchant associations
Merchant.hasMany(Payment, {
    foreignKey: "merchant_id"
})
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
export {
    Merchant,
    UserRoles,
    Payment,
    PaymentStatus,
    Link,
    Client,
}