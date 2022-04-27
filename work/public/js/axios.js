'use strict';

var utils = require('axios/lib/utils');
var bind = require('axios/lib/helpers/bind');
var Axios = require('axios/lib/core/Axios');
var mergeConfig = require('axios/lib/core/mergeConfig');
var defaults = require('axios/lib/defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.CanceledError = require('axios/lib/cancel/CanceledError');
axios.CancelToken = require('axios/lib/cancel/CancelToken');
axios.isCancel = require('axios/lib/cancel/isCancel');
axios.VERSION = require('axios/lib/env/data').version;
axios.toFormData = require('axios/lib/helpers/toFormData');

// Expose AxiosError class
axios.AxiosError = require('axios/lib/core/AxiosError');

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('axios/lib/helpers/spread');

// Expose isAxiosError
axios.isAxiosError = require('axios/lib/helpers/isAxiosError');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;