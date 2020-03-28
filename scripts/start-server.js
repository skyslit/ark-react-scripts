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

const { spawn } = require('child_process');
const chalk = require('chalk');
const webpack = require('webpack');
const configFactory = require('../config/server.webpack.config');

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
        console.log(chalk.red('Compiled with error(s) - ' + stats.compilation.errors.length));
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

const compiler = webpack(configFactory('production'));
compiler.watch({}, (err, stats) => {
    clearConsole();
    console.log(' ');
    if (err) {
        throw err;
    } else {
        if (stats.hasErrors()) {
            stats.compilation.errors.forEach((err) => {
                console.log(chalk.red('Compiled with error(s) - ' + stats.compilation.errors.length));
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