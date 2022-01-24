const test = `
export interface CommandProperties {
export declare function issueCommand(command: string, properties: CommandProperties, message: any): void;
export declare function issue(name: string, message?: string): void;
export interface InputOptions {
export declare enum ExitCode {
export interface AnnotationProperties {
export declare function exportVariable(name: string, val: any): void;
export declare function setSecret(secret: string): void;
export declare function addPath(inputPath: string): void;
export declare function getInput(name: string, options?: InputOptions): string;
export declare function getMultilineInput(name: string, options?: InputOptions): string[];
export declare function getBooleanInput(name: string, options?: InputOptions): boolean;
export declare function setOutput(name: string, value: any): void;
export declare function setCommandEcho(enabled: boolean): void;
export declare function setFailed(message: string | Error): void;
export declare function isDebug(): boolean;
export declare function debug(message: string): void;
export declare function error(message: string | Error, properties?: AnnotationProperties): void;
export declare function warning(message: string | Error, properties?: AnnotationProperties): void;
export declare function notice(message: string | Error, properties?: AnnotationProperties): void;
export declare function info(message: string): void;
export declare function startGroup(name: string): void;
export declare function endGroup(): void;
export declare function group<T>(name: string, fn: () => Promise<T>): Promise<T>;
export declare function saveState(name: string, value: any): void;
export declare function getState(name: string): string;
export declare function getIDToken(aud?: string): Promise<string>;
export declare function issueCommand(command: string, message: any): void;
export declare class OidcClient {
export declare function toCommandValue(input: any): string;
export declare function toCommandProperties(annotationProperties: AnnotationProperties): CommandProperties;
`

const isDeclare = (declarationFileLine) => declarationFileLine.indexOf(' declare ') > -1

const isHelper = (typeName) => (declarationFileLine) => declarationFileLine.indexOf(` ${typeName} `) > -1

const hasCall = (declarationFileLine) => 
    declarationFileLine.indexOf('(') > -1

const ifHasCallThenSplit = (declarationFileLine) => 
    hasCall(declarationFileLine) 
        ? declarationFileLine.split('(')[0] 
        : declarationFileLine;

const getDeclarationType = (declarationFileLine) => 
    declarationFileLine.indexOf('export') === 0 
        && ['namespace', 'interface', 'function', 'class', 'declare']
            .find((isHelperName) => (isHelper(isHelperName))(declarationFileLine));

const getExtractModuleNameFn = (helperName) => 
    (/** @type {string} */ declarationFileLine) => 
        ifHasCallThenSplit(
            declarationFileLine
                .split(` ${helperName} `)[1].split(' ')
                    [ (helperName === 'declare') ? 1 : 0 ]
        );

const extractModuleName = (declarationFileLine) =>
    getExtractModuleNameFn(
        getDeclarationType(declarationFileLine)
    )
    (declarationFileLine)    


const createJsDocTypedef = (fileName) =>
    (moduleName) =>
        `/** @typedef { import('${fileName}').${moduleName} } ${moduleName} */`;

const extractModuleNameAndCreateJsDocTypedef = (fileName) => 
    (test) => 
        createJsDocTypedef(fileName)(extractModuleName(test));

const createJsDocFromData = (utf8DataSplitedByLine, fileName) => 
    utf8DataSplitedByLine
        .filter(getDeclarationType)
            .map(extractModuleNameAndCreateJsDocTypedef(fileName));

/**
 * Example call: createJsDocFromFile('./actions-core.d.ts').then(console.log).catch(console.error) 
 * @returns 
 */
const createJsDocFromFile = async (filePath) => {
    const path = await import('node:path');
    console.log('Creating JSDOC d.ts Import annotations from file: ', path.resolve(filePath));
    const { readFileSync } = await import('node:fs');
    return createJsDocFromData(
        (readFileSync(path.resolve(filePath)).toString().split('\n')), 
        filePath.replace('.d.ts', '')
    );
}
const testData = test.split('\n');       
const runTest = async () => {
    (await import('node:assert')).equal(
        createJsDocFromData(
            testData, './actions-core'
        ).join('\n'),
`/** @typedef { import('./actions-core').CommandProperties } CommandProperties */
/** @typedef { import('./actions-core').issueCommand } issueCommand */
/** @typedef { import('./actions-core').issue } issue */
/** @typedef { import('./actions-core').InputOptions } InputOptions */
/** @typedef { import('./actions-core').ExitCode } ExitCode */
/** @typedef { import('./actions-core').AnnotationProperties } AnnotationProperties */
/** @typedef { import('./actions-core').exportVariable } exportVariable */
/** @typedef { import('./actions-core').setSecret } setSecret */
/** @typedef { import('./actions-core').addPath } addPath */
/** @typedef { import('./actions-core').getInput } getInput */
/** @typedef { import('./actions-core').getMultilineInput } getMultilineInput */
/** @typedef { import('./actions-core').getBooleanInput } getBooleanInput */
/** @typedef { import('./actions-core').setOutput } setOutput */
/** @typedef { import('./actions-core').setCommandEcho } setCommandEcho */
/** @typedef { import('./actions-core').setFailed } setFailed */
/** @typedef { import('./actions-core').isDebug } isDebug */
/** @typedef { import('./actions-core').debug } debug */
/** @typedef { import('./actions-core').error } error */
/** @typedef { import('./actions-core').warning } warning */
/** @typedef { import('./actions-core').notice } notice */
/** @typedef { import('./actions-core').info } info */
/** @typedef { import('./actions-core').startGroup } startGroup */
/** @typedef { import('./actions-core').endGroup } endGroup */
/** @typedef { import('./actions-core').group<T> } group<T> */
/** @typedef { import('./actions-core').saveState } saveState */
/** @typedef { import('./actions-core').getState } getState */
/** @typedef { import('./actions-core').getIDToken } getIDToken */
/** @typedef { import('./actions-core').issueCommand } issueCommand */
/** @typedef { import('./actions-core').OidcClient } OidcClient */
/** @typedef { import('./actions-core').toCommandValue } toCommandValue */
/** @typedef { import('./actions-core').toCommandProperties } toCommandProperties */`
    );
}

// Internal Self Test just nice to have that 
runTest().catch(console.error);

// Example call:
createJsDocFromFile('./actions-core.d.ts')
    .then(d=>d.join('\n'))
    .then(console.log)
    .catch(console.error);
