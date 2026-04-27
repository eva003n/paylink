module.exports = {
  apps: [
    {
      name: "paylink-api",
      script: "./dist/api/index.js",
      instances: -1,
      exec_mode: "cluster",
      autorestart: true,
      kill_timeout: 3000,
      wait_ready: true, // enable graceful start up
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "payment-worker",
      script: "./dist/workers/payment.worker.js",
      instances: 1, // payments are safer processed in single threaded
      exec_mode: "fork",
      autorestart: true,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "email-worker",
      script: "./dist/workers/email.worker.js",
      instances: 2, // control concurrency
      exec_mode: "fork",
      autorestart: true,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "pdf-worker",
      script: "./dist/workers/pdf.worker.js",
      instances: 1, // control concurrency
      exec_mode: "fork",
      max_memory_restart: "700M",
      autorestart: true,
      env: {
        NODE_ENV: "production",
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
        NODE_ENV: "production",
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
        NODE_ENV: "production",
      },
    },
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
