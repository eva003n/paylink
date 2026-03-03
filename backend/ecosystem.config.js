module.exports = {
  apps: [
    {
      name: "paylink-api",
      script: "./src/index.js",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      kill_timeout: 3000,
      env_production: {
        //.env
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,

        //.env.develoment or .env.production
        PM2_PUBLIC_KEY:process.env.PM2_PUBLIC_KEY,
        PM2_SECRET_KEY:process.env.PM2_SECRET_KEY

      },
    },
    {
      name: "payment-worker",
      script: "./src/workers/payment.worker.js",
      instances: 1, // payments are safer processed in single threaded
      // exec_mode: "fork",
      autorestart: true,
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "email-worker",
      script: "./src/workers/email.worker.js",
      instances: 2, // control concurrency
      // exec_mode: "fork",
      autorestart: true,
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "pdf-worker",
      script: "./src/workers/pdf.worker.js",
      instances: 1, // control concurrency
      // exec_mode: "fork",
      max_memory_restart: "700M",
      autorestart: true,
      env_production: {
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
