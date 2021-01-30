'use strict';

const fs = require('fs');
const w3cjs = require('w3cjs');
const glob = require('glob-all');

let error = (...msg) => {
  console.error("\x1b[31m%s\x1b[0m", ...msg);
}

let success = (...msg) => {
  console.log("\x1b[32m%s\x1b[0m", ...msg);
}

let info = (...msg) => {
  console.info(...msg);
}

let warn = (...msg) => {
  console.warn("\x1b[33m%s\x1b[0m", ...msg);
}

glob([
    'public/**/*.html',
    '!public/google*.html',
    '!public/amp/**'],
  (err, files) => {
    let errorCount = 0;
    let warningCount = 0;
    let done = files.length;
    for (let file of files) {
      w3cjs.validate({
        file: file,
        input: fs.readFileSync(file, {encoding: 'utf8'}),
        callback: (err, res) => {
          if (res && res.messages.length > 0) {
            for (let msg of res.messages) {
              let loc = file + " [" + msg.lastLine + ":" + msg.firstColumn + "]";
              if (msg.type === "error") {
                error("⚠ " + loc + ": " + msg.message);
                errorCount++;
              } else {
                warn("⚠ (" + msg.type + msg.subType + ") " + loc + ": " + msg.message);
                warningCount++;
              }
            }
          } else {
            success("✓ " + file);
          }
          if (--done == 0) {
            info("Warnings: " + warningCount + ", Errors: " + errorCount);
            if (errorCount > 0) {
              throw new Error('HTML validation failed');
            }
          }
        }
      });
    }
  }
);
