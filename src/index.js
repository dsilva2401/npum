var path = require('path');
var fsExtra = require('fs-extra');
var shell = require('shelljs');
var PREVENT_FILE_NAME = '.npum-prevent-update';

var updateProject = function (workingDir, gitData, processesData) {
    // Setup working space
    workingDir = path.resolve(workingDir);
    workingDir = workingDir.replace(/\/$/, '');
    var bckWorkingDir = workingDir+'_';
    fsExtra.ensureDirSync(workingDir);
    // Stop processes
    console.log('Stopping processes');
    shell.exec('sh -c \'cd '+workingDir+' && npm run stop\'');
    // Remove project
    console.log('Saving backup');
    fsExtra.renameSync(workingDir, bckWorkingDir);
    // Clone project again
    console.log('Cloning project');
    shell.exec('git clone -b '+gitData.branch+' '+gitData.url+' '+workingDir);
    // Install dependencies
    console.log('Installing project');
    shell.exec('sh -c \'cd '+workingDir+' && npm install\'');
    // Start project
    console.log('Starting project');
    shell.exec('sh -c \'cd '+workingDir+' && npm start\'');
    // Remove if no errors (TODO: restart when bugs)
    console.log('Removing backup');
    fsExtra.remove(bckWorkingDir);
}

var verifyIfGitChanges = function (workingDir, gitData, cb) {
    cb = cb || function () {}
    // Setup working space
    workingDir = path.resolve(workingDir);
    fsExtra.ensureDirSync(workingDir);
    // Verify git exists
    var hasGitInitialized = !!fsExtra.readdirSync(workingDir).filter(function (entry) {
        return (entry == '.git');
    }).length;
    if (!hasGitInitialized) {
        cb(true);
        return;
    }
    // Fetch git changes
    shell.exec('sh -c \'cd '+workingDir+' && git fetch\'');
    // Detect changes
    var changesDetected = !!shell.exec('sh -c \'cd '+workingDir+' && git diff '+gitData.branch+' origin/'+gitData.branch+'\'').stdout;
    cb(changesDetected);
}

var verifyIfPreventFileExists = function (workingDir, cb) {
    cb = cb || function () {}
    workingDir = path.resolve(workingDir);
    var preventFilePath = path.join(workingDir, PREVENT_FILE_NAME);
    if (fsExtra.existsSync(preventFilePath)) {
        cb (true);
        return;
    }
    cb (false);
}

var startUpdatesWatcher = function (workingDir, gitData, intvalMs) {
    setInterval(() => {
        // Verify if should update
        verifyIfPreventFileExists(workingDir, function (preventFileExists) {
            if (preventFileExists) {
                return;
            }
            // Verify if there are changes
            verifyIfGitChanges(workingDir, gitData, function (changesDetected) {
                if (!changesDetected) {
                    return;
                }
                // Update project
                console.log('Starting update');
                updateProject(workingDir, gitData);
            });
        })        
    }, intvalMs || 60000);
}

exports.startUpdatesWatcher = startUpdatesWatcher;

// startUpdatesWatcher('demo', {
//     url: 'git@bitbucket.org:screens-adv/screens-inspector.git',
//     branch: 'master'
// }, 1000);

// verifyIfPreventFileExists('demo', function (preventFileExists) {
//     console.log('Prevent file exists', preventFileExists);
// })

// verifyIfGitChanges('demo', {
//     url: 'git@bitbucket.org:screens-adv/screens-inspector.git',
//     branch: 'master'
// }, function (changesDetected) {
//     console.log('Changes detected:', changesDetected);
// });

// updateProject('demo', {
//     url: 'git@bitbucket.org:screens-adv/screens-inspector.git',
//     branch: 'master'
// });

