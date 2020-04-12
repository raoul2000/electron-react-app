module.exports = {
  foo: {
    type: 'number',
    maximum: 100,
    minimum: 1,
    default: 50
  },
  bar: {
    type: 'string',
    format: 'url'
  },
  deep: {
    type: 'object',
    properties: {
      hello: {
        type: 'string',
        default: 'world'
      }
    },
    default: {
      hello: 'world !!'
    }
  }
};
