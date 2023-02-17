'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://10.201.154.215:8080"',
  WS_API: '"ws://10.201.154.215:8080"',
})
