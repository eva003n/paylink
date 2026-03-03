module.exports = {
  apps: [
    {
      name: "paylink-api",
      script: "dist/src/index.js",
      watch: ".",
      env_development: {
        NODE_ENV: "development",
      },
    },
    {
      name: "payment-worker",
      script: "dist/src/workers/payment.worker.js",
      watch: ["dist/src/workers/payment.worker.js"],
      env_development: {
        NODE_ENV: "development",
      },
    },
    {
      name: "email-worker",
      script: "dist/src/workers/email.worker.js",
      watch: ["dist/src/workers/email.worker.js"],
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],

};
