import { startLanguageServer } from 'langium';
import { createConnection, ProposedFeatures } from 'vscode-languageserver/node';
import { create<%= LanguageName %>Services } from './<%= language-id %>-module';

// Create a connection to the client
const connection = createConnection(ProposedFeatures.all);

// Inject the shared services and language-specific services
const { shared } = create<%= LanguageName %>Services({ connection });

// Start the language server with the shared services
startLanguageServer(shared);
