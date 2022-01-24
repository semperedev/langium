/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import {
    GeneratorNode, Grammar, CompositeGeneratorNode, NL, processGeneratorNode, stream,
    isAlternatives, isKeyword, isParserRule, isDataTypeRule, ParserRule, LangiumServices
} from 'langium';
import { collectAst } from './type-collector';
import { generatedHeader } from './util';

export function generateTypes(services: LangiumServices, grammars: Grammar[]): string {
    const types = collectAst(services.shared.workspace.LangiumDocuments, grammars);
    const fileNode = new CompositeGeneratorNode();
    fileNode.append(
        generatedHeader
    );
    for (const type of types) {
        fileNode.append(type.toStringAsType(), NL);
    }
    for (const primitiveRule of stream(grammars.flatMap(e => e.rules)).distinct().filter(isParserRule).filter(isDataTypeRule)) {
        fileNode.append(buildDatatype(primitiveRule), NL, NL);
    }

    return processGeneratorNode(fileNode);
}

function buildDatatype(rule: ParserRule): GeneratorNode {
    if (isAlternatives(rule.alternatives) && rule.alternatives.elements.every(e => isKeyword(e))) {
        return `type ${rule.name} = ${stream(rule.alternatives.elements).filter(isKeyword).map(e => `'${e.value}'`).join(' | ')}`;
    }
    const type = rule.type?.name ?? 'string';
    return `type ${rule.name} = ${(['string', 'number', 'boolean', 'bigint', 'Date'].includes(type) ? ':' : '') + type}`;
}
