module.exports = {
  apps: [
    {
      name: "resume-builder",
      script: "backend/src/server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      min_uptime: "10s",
      max_restarts: 10,
      kill_timeout: 5000,
      listen_timeout: 10000,
      time: true,
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: "5000",
      },
      error_file: "backend/logs/pm2-error.log",
      out_file: "backend/logs/pm2-out.log",
      merge_logs: true,
    },
  ],
};
