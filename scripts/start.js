// @remove-on-eject-begin
/**
 * Copyright (c) 2020-present, Skyslit Network Private Limited
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');
// @remove-on-eject-begin
// Do the preflight check (only happens before eject).
const verifyPackageTree = require('./utils/verifyPackageTree');
if (process.env.SKIP_PREFLIGHT_CHECK !== 'true') {
  verifyPackageTree();
}
const verifyTypeScriptSetup = require('./utils/verifyTypeScriptSetup');
verifyTypeScriptSetup();
// @remove-on-eject-end

const fs = require('fs');
const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');

const useYarn = fs.existsSync(paths.yarnLockFile);
const useServer = fs.existsSync(paths.appServerJs) && process.argv.indexOf('--ssr') > -1;
const isModuleDevelopment = fs.existsSync(paths.appModuleJs);
const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (isModuleDevelopment === false) {
  if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
    process.exit(1);
  }
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Attempting to bind to HOST environment variable: ${chalk.yellow(
        chalk.bold(process.env.HOST)
      )}`
    )
  );
  console.log(
    `If this was unintentional, check that you haven't mistakenly set it in your shell.`
  );
  console.log(
    `Learn more here: ${chalk.yellow('https://bit.ly/CRA-advanced-config')}`
  );
  console.log();
}

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // We attempt to use the default port but if it is busy, we offer the user to
    // run on a different port. `choosePort()` Promise resolves to the next free port.
    return choosePort(HOST, DEFAULT_PORT);
  })
  .then(port => {
    if (port == null) {
      // We have not found a port.
      return;
    }

    const config = configFactory('development', useServer);
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const appName = require(paths.appPackageJson).name;
    const useTypeScript = fs.existsSync(paths.appTsConfig);
    const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';
    const urls = prepareUrls(
      protocol,
      HOST,
      port,
      paths.publicUrlOrPath.slice(0, -1)
    );
    const devSocket = {
      warnings: warnings =>
        devServer.sockWrite(devServer.sockets, 'warnings', warnings),
      errors: errors =>
        devServer.sockWrite(devServer.sockets, 'errors', errors),
    };

    if (useServer === true) {
      
      const { spawn } = require('child_process');
      let serverProcess = null;
      function restartDevServer() {
        if (serverProcess) {
          console.log(chalk.gray('Restarting server...'));
          serverProcess.kill();
        } else {
          console.log(chalk.gray('Starting server...'));
        }

        serverProcess = spawn('node', ['./build/server.js']);
        serverProcess.stdout.on('data', (data) => {
          console.log(chalk.dim(data));
        });

        serverProcess.stderr.on('data', (data) => {
          console.log(chalk.red('Compiled with error(s)'));
          console.log(' ');
          console.log(chalk.red(data));
        });

        serverProcess.on('close', (code) => {
          // console.log(`child process exited with code ${code}`);
        });
      }

      function clearConsole() {
        console.clear();
      }

      clearConsole();
      console.log(chalk.blue('Initiating compilation...'))

      const compiler = webpack(config);
      compiler.watch({}, (err, stats) => {
        clearConsole();
        console.log(' ');
        if (err) {
          throw err;
        } else {
          if (stats.hasErrors()) {
            stats.compilation.errors.forEach((err) => {
              console.log(chalk.red('Compiled with error(s)'));
              console.log(' ');
              console.log(chalk.red(err.message));
            });
          } else {
            // Show success + warnings
            if (stats.hasWarnings()) {
              console.log(chalk.yellow('Compiled with warnings'));
              stats.compilation.warnings.forEach((warning) => {
                console.log(' ');
                console.log(chalk.yellow(warning));
              })
            } else {
              console.log(chalk.green('Compiled Successfully'));
              console.log(' ');
              console.log('Ark will watch for changes in server and restart the application for you. Happy building...');
              console.log(' ');
            }
            restartDevServer();
          }
        }
      })

    } else {
      // Start Client
      // Create a webpack compiler that is configured with custom messages.
      const compiler = createCompiler({
        appName,
        config,
        devSocket,
        urls,
        useYarn,
        useTypeScript,
        tscCompileOnError,
        webpack,
      });
      // Load proxy config
      const proxySetting = require(paths.appPackageJson).proxy;
      const proxyConfig = prepareProxy(
        proxySetting,
        paths.appPublic,
        paths.publicUrlOrPath
      );
      // Serve webpack assets generated by the compiler over a web server.
      const serverConfig = createDevServerConfig(
        proxyConfig,
        urls.lanUrlForConfig
      );
      const devServer = new WebpackDevServer(compiler, serverConfig);
      // Launch WebpackDevServer.
      devServer.listen(port, HOST, err => {
        if (err) {
          return console.log(err);
        }
        if (isInteractive) {
          clearConsole();
        }

        // We used to support resolving modules according to `NODE_PATH`.
        // This now has been deprecated in favor of jsconfig/tsconfig.json
        // This lets you use absolute paths in imports inside large monorepos:
        if (process.env.NODE_PATH) {
          console.log(
            chalk.yellow(
              'Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.'
            )
          );
          console.log();
        }

        console.log(chalk.cyan('Starting the development server...\n'));
        openBrowser(urls.localUrlForBrowser);
      });

      ['SIGINT', 'SIGTERM'].forEach(function (sig) {
        process.on(sig, function () {
          devServer.close();
          process.exit();
        });
      });

      if (isInteractive || process.env.CI !== 'true') {
        // Gracefully exit when stdin ends
        process.stdin.on('end', function () {
          devServer.close();
          process.exit();
        });
        process.stdin.resume();
      }
    }
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
