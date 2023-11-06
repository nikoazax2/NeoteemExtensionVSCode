 
const { OuvrirProjetBB } = require('./src/projetBB');
const { OuvrirtTicketJira } = require('./src/ticketJira');

async function activate(context) {
    OuvrirtTicketJira(context)
    OuvrirProjetBB(context)
}

module.exports = {
    activate
};
