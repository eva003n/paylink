module.exports = {
  apps: [
    {
      name: "paylink-api",
      script: "./dist/api/index.js",
      instances: "-1",
      exec_mode: "cluster",
      autorestart: true,
      kill_timeout: 3000,
      env_development: {
        //.env
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,

        //.env.develoment or .env.production
        PM2_PUBLIC_KEY: process.env.PM2_PUBLIC_KEY,
        PM2_SECRET_KEY: process.env.PM2_SECRET_KEY,
      },
    },
    {
      name: "payment-worker",
      script: "./dist/workers/payment.worker.js",
      instances: 1, // payments are safer processed in single threaded
      exec_mode: "fork",
      autorestart: true,
      env_development: {
        NODE_ENV: process.env.NODE_ENV,
      },
    },
    {
      name: "email-worker",
      script: "./dist/workers/email.worker.js",
      instances: 2, // control concurrency
      exec_mode: "fork",
      autorestart: true,
      env_development: {
        NODE_ENV: "development",
      },
    },
    {
      name: "pdf-worker",
      script: "./dist/workers/pdf.worker.js",
      instances: 1, // control concurrency
      exec_mode: "fork",
      max_memory_restart: "700M",
      autorestart: true,
      env_development: {
        NODE_ENV: "development",
      },
    },
  ]
};
