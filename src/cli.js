// Libs
var pm2 = require('pm2');

// Help fn
function startHelp () {
    console.log('Node processes updates manager\n\nTo start updates manager use the next command:\n\nnpum start <workingdir> <giturl> <gitbranch>');
}

switch (action) {
    case 'help':
        startHelp();
    break;
    case 'start':
        // Vars
        var action = process.argv[2];
        var workingDir = process.argv[3];
        var gitUrl = process.argv[4];
        var gitBranch = process.argv[5];
        // Start
        pm2.connect(function(err) {
            if (err) {
                console.error(err);
                process.exit(2);
                return;
            }
            pm2.start({
                script    : './execcli.js',
                args: [
                    action, workingDir, gitUrl, gitBranch
                ],
                instances : 1,
            }, function(err, apps) {
                pm2.disconnect();   // Disconnects from PM2
                if (err) throw err
            });
        });
    break;
    default:
        startHelp();
    break;
}