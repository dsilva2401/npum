// Lib
var startUpdatesWatcher = require('.').startUpdatesWatcher;

// Args
var action = process.argv[2];
var workingDir = process.argv[3];
var gitUrl = process.argv[4];
var gitBranch = process.argv[5];

// Help fn
function startHelp () {
    console.log('Node processes updates manager\n\nTo start updates manager use the next command:\n\nnpum start <workingdir> <giturl> <gitbranch>');
}

switch (action) {
    case 'help':
        startHelp();
    break;
    case 'start':
        
        // Validation
        if (!workingDir) {
            console.log('Invalid working dir');
            return;
        }
        if (!gitUrl) {
            console.log('Invalid git url');
            return;
        }
        if (!gitBranch) {
            gitBranch = gitBranch || 'master';
        }
        
        // Start
        startUpdatesWatcher(workingDir, {
            url: gitUrl,
            branch: gitBranch
        });
    break;
    default:
        startHelp();
    break;
}