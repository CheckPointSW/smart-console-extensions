/*******************************************************************************
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Check Point Software Technologies Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 ******************************************************************************/

/**
 * This class manage the extension communication with SmartConsole
 * See more information in https://sc1.checkpoint.com/documents/SmartConsole/Extensions/index.html#SmartConsole%20Interactions
 */

import ExtensionInteractionSubscription from './extensionInteractionSubscription';
import ExtensionInvoker from './extensionInvoker';
import uuidv1 from './uuid';

const getContextCommand = 'get-context';
const requestCommitCommand = 'request-commit';
const goToRuleCommand = 'go-to-rule';
const closeWindowCommand = 'close-window';
const readOnlyCommand = 'run-readonly-command';

export default class SmartConsoleInteractions {
  // manages the subscription to callback returns from the embedding SmartConsole whenever "get context" is called.
  private getContextObjectSubscription: ExtensionInteractionSubscription;

  // manages the subscription to callback returns from the embedding SmartConsole whenever "request commit" is called.
  private requestCommitSubscription: ExtensionInteractionSubscription;

  // manages the subscription to callback returns from the embedding SmartConsole whenever "go to rule" is called.
  private goToRuleSubscription: ExtensionInteractionSubscription;

  private invoker: ExtensionInvoker;

  constructor(demoInteractions: any) {
    this.invoker = new ExtensionInvoker(demoInteractions);

    this.getContextObjectSubscription = new ExtensionInteractionSubscription(getContextCommand, true, this.invoker);

    this.requestCommitSubscription = new ExtensionInteractionSubscription(requestCommitCommand, false, this.invoker);

    this.goToRuleSubscription = new ExtensionInteractionSubscription(goToRuleCommand, false, this.invoker);
  }

  /**
   * Execute query to get objects from the Security Management API
   * @param {any} queryRequest - query ID and parameters to execute
   * @param {uuid} subscriptionId
   * @returns {any} Query response
   */
  public async query(queryRequest: any, subscriptionId: string = uuid()) {
    const getReadOnlyCommandSubscription = new ExtensionInteractionSubscription(readOnlyCommand, false, this.invoker);

    const queryResult = await getReadOnlyCommandSubscription.subscribe({
      command: queryRequest.queryId,
      parameters: queryRequest.queryParams,
      subscriptionId,
    });
    return queryResult;
  }

  /**
   * @param {uuid} subscriptionId
   * @returns Extension context provided by SmartConsole
   * See more information in https://sc1.checkpoint.com/documents/SmartConsole/Extensions/index.html#Extension%20Context
   */
  public async getContextObject(subscriptionId: string = uuid()) {
    const contextObj = await this.getContextObjectSubscription.subscribe({ subscriptionId });
    return contextObj;
  }

  /**
   * Request SmartConsole user to execute list of commands
   * Used by extensions to apply changes by SmartConsole user private session
   *
   * @param {uuid} subscriptionId
   * @param {string[]} commandsToCommit
   * @returns Commands to be executed by SmartConsole.
   * Note, commands are prompt to user require user approval
   */
  public requestCommit(commandsToCommit: string[], subscriptionId: string = uuid()) {
    const parameters = { commands: commandsToCommit, subscriptionId };
    return this.requestCommitSubscription
      .subscribe(parameters)
      .then((data: any) => {
        return data;
      })
      .catch((error: any) => {
        throw error;
      });
  }

  /**
   * Request SmartConsole to navigate to a rule
   *
   * @param {uuid} subscriptionId
   * @param {string} uid - rule uid to navigate to in SmartConsole
   */
  public navigate(uid: string, subscriptionId: string = uuid()) {
    const parameters = { ruleId: uid, subscriptionId };
    this.goToRuleSubscription.subscribe(parameters);
  }

  /**
   * @param {uuid} subscriptionId
   * Request SmartConsole to close the extension window
   */
  public closeExtensionWindow(subscriptionId: string = uuid()) {
    const closeWindowSubscription = new ExtensionInteractionSubscription(closeWindowCommand, false, this.invoker);
    closeWindowSubscription.subscribe({ subscriptionId });
  }
}

export function uuid(options: any = undefined, buf: any = undefined, offset: any = undefined) {
  return uuidv1(options, buf, offset);
}
