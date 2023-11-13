const { json } = require('node:stream/consumers');
const vscode = require('vscode');
const fs = require('fs');

async function selectEnv(context) {

    //config is in public/config/env.json
    let config = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri).uri.path + '/public/config/env.json';

    config = config.slice(1);

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