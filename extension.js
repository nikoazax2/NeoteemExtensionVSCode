const vscode = require('vscode');
const simpleGit = require('simple-git');
const { exec } = require('child_process');
const config = require('./config.json');

async function activate(context) {
    OuvrirtTicketJira(context)
    OuvrirProjetBB(context)
}

async function OuvrirProjetBB(context) {
    const branchName = vscode.workspace.workspaceFolders[0].uri.path.split(`/`)[vscode.workspace.workspaceFolders[0].uri.path.split(`/`).length - 1]
    const bitbucketUrl = `https://bitbucket.org/neofront/${branchName}/branches/?status=all`
    const bitbucketUrlBack = `https://bitbucket.org/neot-v2/${branchName}/branches/?status=all`

    const disposable = vscode.commands.registerCommand('extension.openBitbucketRepo', () => {
        // Define the Chrome profile you want to use 
        let config = vscode.workspace.getConfiguration('myExtension');
        let chromeProfile = config.get('chromeProfile');
        const chromeExecutablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        let chromeCommand

        if (['ws'].includes(branchName)) {
            chromeCommand = `"${chromeExecutablePath}" --profile-directory="${chromeProfile}" "${bitbucketUrlBack}"`;
        } else {
            chromeCommand = `"${chromeExecutablePath}" --profile-directory="${chromeProfile}" "${bitbucketUrl}"`;
        }

        // Execute the command
        exec(chromeCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error opening Chrome: ${error.message}`);
            } else {
                console.log(`Chrome opened with profile: ${chromeProfile}`);
            }
        });
    });

    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100000)
    statusBarItem.text = `$(github-inverted)  Bitbucket ${branchName}`
    statusBarItem.tooltip = `Ouvrir le repo Bitbucket ${branchName}`
    statusBarItem.command = 'extension.openBitbucketRepo'
    statusBarItem.show()

    context.subscriptions.push(statusBarItem, disposable)
}

async function OuvrirtTicketJira(context) {
    let disposable = vscode.commands.registerCommand('extension.openJiraTicket', async () => {
        extractTicketNumberFromBranch()
    })

    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10001);
    statusBarItem.text = `$(notebook-render-output)  Ticket Jira`;
    statusBarItem.tooltip = `Ouvrir le ticket Jira`;
    statusBarItem.command = 'extension.openJiraTicket';
    statusBarItem.show();

    context.subscriptions.push(statusBarItem, disposable);
}

async function extractTicketNumberFromBranch() {
    const workspacePath = vscode.workspace.rootPath;
    const git = simpleGit(workspacePath);

    let num = await git.branch((err, summary) => {
        const currentBranch = summary.current;

        if (currentBranch) {
            const regex = /\d{5}/; // Matches exactly 5 digits 
            const match = currentBranch.match(regex)

            if (match) {
                const jiraUrl = `${config.project_url}${match}`;
                const chromeExecutablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
                const chromeCommand = `"${chromeExecutablePath}" --profile-directory="${config.chrome_profile}" "${jiraUrl}"`;

                // Execute the command
                exec(chromeCommand, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error opening Chrome: ${error.message}`);
                    } else {
                        console.log(`Chrome opened with profile: ${config.chrome_profile}`);
                    }
                });

            } else {
                vscode.window.showErrorMessage("Aucun numéro de ticket trouvé dans le nom de la branche.");
            }

            return match
        }
        else {
            vscode.window.showWarningMessage('You are not on any branch.');
        }

    })

    vscode.window.showWarningMessage(num)
}

module.exports = {
    activate
};
