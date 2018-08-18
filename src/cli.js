// Libs
var pm2 = require('pm2');
var path = require('path');
var shell = require('shelljs');

// Help fn
function startHelp () {
    console.log('Node processes updates manager\n\nTo start updates manager use the next command:\n\nnpum start <workingdir> <giturl> <gitbranch>');
}

// Args
var action = process.argv[2];
var workingDir = process.argv[3];
workingDir = path.resolve(workingDir);
var gitUrl = process.argv[4];
var gitBranch = process.argv[5];

switch (action) {
    case 'help':
        startHelp();
    break;
    case 'start':
        // Start
        var execFilePath = path.join(__dirname, 'execcli.js');
        shell.exec('pm2 start '+execFilePath+' --name "npum" -- '+([
            action, workingDir, gitUrl, gitBranch
        ]).join(' '));
        shell.exec('pm2 save');
    break;
    default:
        startHelp();
    break;
}