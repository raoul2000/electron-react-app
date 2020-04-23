module.exports = {
  serverMode: {
    type: 'boolean',
    default: false
  },
  serverPort: {
    type: 'integer',
    default: 3000
  },
  logger: {
    type: 'object',
    properties: {
      enable: {
        type: 'boolean',
        default: false
      },
      level: {
        type: 'string',
        default: 'info',
        enum: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']
      }
    },
    default: {
      enable: false,
      level: 'info'
    }
  }
};
