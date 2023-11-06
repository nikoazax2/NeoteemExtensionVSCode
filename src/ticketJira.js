const vscode = require('vscode');
const simpleGit = require('simple-git');
const { exec } = require('child_process');
const config = require('../config.json');  

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
                let config = vscode.workspace.getConfiguration('myExtension');
                let chromeProfile = config.get('chromeProfile');
                const jiraUrl = `${config.project_url}${match}`;
                const chromeExecutablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
                const chromeCommand = `"${chromeExecutablePath}" --profile-directory="${chromeProfile}" "${jiraUrl}"`;

                // Execute the command
                exec(chromeCommand, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error opening Chrome: ${error.message}`);
                    } else {
                        console.log(`Chrome opened with profile: ${chromeProfile}`);
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
    OuvrirtTicketJira
};