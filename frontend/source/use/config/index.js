const
  configApi = require('../../../../configs/api')
;
module.exports = {
  install(Vue) {
    Vue.prototype.$config = {
      api: configApi,
    };
  },
};
