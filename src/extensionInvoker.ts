const extensionJavascriptMethodParent = 'smxProxy';
const extensionJavascriptMethod = 'sendRequest';

export default class ExtensionInvoker {
  public static EXTENSION_METHODS_ARE_NOT_AVAILABLE = 'Extension methods are not available.';

  public static OPERATION_CANCELLED_BY_USER = 'operation-cancelled-by-user';

  // smxProxy.sendRequest(functionName, parametersObject, callbackMethodName) is registered through hosting by SmartConsole.

  private demoInteractions: any;

  constructor(demoInteractions: any) {
    this.demoInteractions = demoInteractions;
  }

  public isEnabled() {
    return this.getInvocationMethodContainer();
  }

  public isSmartConsoleMode() {
    return !(typeof window[extensionJavascriptMethodParent] === 'undefined');
  }

  public getInvocationMethod() {
    if (typeof window[extensionJavascriptMethodParent] === 'undefined') {
      return this.getDevMethod();
    }
    // this function is a magic identifier that only exists if this extension is embedded within SmartConsole.
    // SmartConsole GUI application registers that function.
    return window[extensionJavascriptMethodParent][extensionJavascriptMethod];
  }

  /**
   *
   * @param {string} functionName name of the function in SmartConsole to call
   * @param {any} parameters is an object which represents the parameters. Each parameter has a predefined key name by SmartConsole.
   * @param {string} callbackFunctionName name of a function in Rule Assistant which SmartConsole will call
   * after the execution of the SmartConsole interaction function succeeded or finished.
   * Note that not all SmartConsole functions have support for callback functions
   * (for example go-to-rule doesn't support callback functions)
   * @returns {any} success or failure of the method invocation.
   */
  public invoke(functionName: string, parameters: any, callbackFunctionName: string = '') {
    // this is how we call functions in SmartConsole:
    // window.smxProxy.sendRequest(functionName, jsonOfArguments, callbackFunctionName)
    // because window.smxProxy.sendRequest isn't actually defined in this extension, but it's something
    // that SmartConsole registers,
    // we use this unsafe reflection thing to call it.
    // to check whether this function exists we have isEnabled().
    return this.getInvocationMethod()(functionName, parameters, callbackFunctionName);
  }

  private getDevMethod() {
    return this.demoInteractions;
  }

  private getInvocationMethodContainer() {
    if (!this.isSmartConsoleMode()) {
      return this.getDevMethod();
    }

    // this function is a magic identifier that only exists if this extension is embedded within SmartConsole.
    // SmartConsole GUI application registers that function.
    return window[extensionJavascriptMethodParent];
  }
}
