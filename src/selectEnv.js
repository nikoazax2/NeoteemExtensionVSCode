const { json } = require('node:stream/consumers');
const vscode = require('vscode');
const fs = require('fs');

async function selectEnv(context) {
  
    let config =vscode.workspace.workspaceFolders[0].uri.fsPath + '/public/config/env.json';

    const configJson = require(config);
    const envActuel = configJson['ws']
    const environments = Object.keys(configJson).slice(1);

    const selectedEnv = await vscode.window.showQuickPick(environments, {
        placeHolder: `Selectionnez un WS (actuel: ${envActuel})`,
    });

    if (selectedEnv) {
        vscode.window.showInformationMessage(`WS selectionné: ${selectedEnv} (${configJson[selectedEnv]})`);
        configJson['ws'] = configJson[selectedEnv];
        fs.writeFileSync(config, JSON.stringify(configJson, null, 2));

    }
}

function SelectEnv(context) {
    let disposable = vscode.commands.registerCommand('neoteem-tools.selectEnv', function () {
        selectEnv(context);
    });

    context.subscriptions.push(disposable);
}

module.exports = {
    SelectEnv
};