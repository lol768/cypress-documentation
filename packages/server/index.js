require('./timers')

process.env.UV_THREADPOOL_SIZE = 128
require('graceful-fs').gracefulify(require('fs'))
// if running in production mode (CYPRESS_ENV)
// all transpile should have been done already
// and these calls should do nothing
require("@packages/ts/register")
require("@packages/coffee/register")

require && require.extensions && delete require.extensions[".litcoffee"]
require && require.extensions && delete require.extensions[".coffee.md"]
require("./lib/cypress").start(process.argv)
