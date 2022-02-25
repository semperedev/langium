/******************************************************************************
 * Copyright 2022 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { createLangiumGrammarServices } from '../../src';
import { parseDocument } from '../../src/test';

describe('Grammar Validator tests', () => {

    const services = createLangiumGrammarServices();

    test('Unsupported optional element in unordered group error', async () => {
        const text = `
        grammar TestUnorderedGroup
        
        entry Book: 
            'book' name=STRING 
            (
                  ("description" descr=STRING)
                & ("edition" version=STRING)?
                & ("author" author=STRING)
            )
        ;
        hidden terminal WS: /\\s+/;
        terminal STRING: /"[^"]*"|'[^']*'/;
        `;
        const parseDoc = await parseDocument(services.grammar, text);
        const validation = await services.grammar.validation.DocumentValidator.validateDocument(parseDoc);
        expect(validation.length).toBe(1);
        expect(validation[0].message).toBe('Optional elements in Unordered groups are currently not supported');
    });
});
