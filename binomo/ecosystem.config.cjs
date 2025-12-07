module.exports = {
  apps: [{
    name: 'binomo-frontend',
    script: 'npm',
    args: 'run preview',
    cwd: process.cwd(),
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/ubuntu/.pm2/logs/binomo-frontend-error.log',
    out_file: '/home/ubuntu/.pm2/logs/binomo-frontend-out.log',
    log_file: '/home/ubuntu/.pm2/logs/binomo-frontend-combined.log',
    time: true
  }]
};
