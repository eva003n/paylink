module.exports = {
  apps: [
    {
      name: "paylink-api",
      script: "./dist/api/index.js",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      wait_ready: true, // start when services are ready

      kill_timeout: 3000,
      env: {
        //.env
        PORT: 8000,
        NODE_ENV: "development",
      },
    },
    {
      name: "payment-worker",
      script: "./dist/workers/payment.worker.js",
      instances: 1, // payments are safer processed in single threaded
      exec_mode: "fork",
      wait_ready: true, // start when services are ready
      autorestart: true,
      env: {
        //.env
        NODE_ENV: "development",
      },
    },
    {
      name: "email-worker",
      script: "./dist/workers/email.worker.js",
      instances: 1, // control concurrency
      wait_ready: true, // start when services are ready
      exec_mode: "fork",
      autorestart: true,
      env: {
        NODE_ENV: "development",
      },
    },
    {
      name: "pdf-worker",
      script: "./dist/workers/pdf.worker.js",
      instances: 1, // control concurrency
      exec_mode: "fork",
      wait_ready: true, // start when services are ready
      max_memory_restart: "700M",
      autorestart: true,
      env: {
        NODE_ENV: "development",
      },
    },
    {
      name: "link-worker",
      script: "./dist/workers/link.worker.js",
      instances: 1, // control concurrency
      exec_mode: "fork",
      wait_ready: true, // start when services are ready
      autorestart: true,
      env: {
        NODE_ENV: "development",
      },
    },
    {
      name: "migrate-worker",
      script: "./dist/api/config/db/umzug.js",
      instances: 1, // control concurrency
      exec_mode: "fork",
      autorestart: false,
      wait_ready: true, // start when services are ready
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
