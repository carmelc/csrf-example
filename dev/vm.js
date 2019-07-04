const { Engine } = require('velocity');

const velocityData = require('./velocity.data.json');
const velocityDataPrivate = require('./velocity.private.data.json');

const engine = new Engine({ template: './src/index.vm' });

module.exports = (data, staticsBaseUrlDomain) => {
  const velocityDataComplete = {
    ...velocityData,
    ...velocityDataPrivate,
  };
  return engine.render({
    ...velocityDataComplete,
    staticsBaseUrl: `//${staticsBaseUrlDomain}:${velocityData.clientTopology.staticsBaseUrlPort}/`,
    ...data,
  });
};
