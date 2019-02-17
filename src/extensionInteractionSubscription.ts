import ExtensionInvoker from './extensionInvoker';
import Subscriber from './subscriber';

/**
 * Manage asynchronous calls to the embedding SmartConsole GUI application.
 * It creates a Promise which only returns after SmartConsole gives back the value.
 */
export default class ExtensionInteractionSubscription {
  // after we call SmartConsole, the result is sent to this extension through a javascript function
  // that we declare by this name.
  private callbackFunctionName: string;

  // list of functions to call back once SmartConsole returns the value.
  // it's a list, because we may call the same function multiple time.
  // each response from SmartConsole activates the first subscriber, and removes it from this list.
  private subscribers: any;

  // optional: cache the result and don't call SmartConsole again for the same thing (example: get context object)
  // this will only be used if useCache == true (initialized at the constructor)
  private cacheValue: any;

  private extensionInvoker: ExtensionInvoker;

  private functionName: string;

  private useCache: boolean = false;

  constructor(functionName: string, cacheValue: any, invoker: ExtensionInvoker) {
    this.cacheValue = cacheValue;
    this.extensionInvoker = invoker;
    this.functionName = functionName;

    this.callbackFunctionName = functionName.replace(/-/g, '_') + '_callback';

    // register a javascript function that SmartConsole will call with the value that we need from it.
    window[this.callbackFunctionName] = (value: any) => {
      this.onCallback(value);
    };
  }

  public subscribe(parameters: any = null, callbackResult: any = null) {
    return new Promise<any>((resolve: any, reject: any) => {
      // this can only happen if this is inside SmartConsole.
      // If subscribe() is called from the web, it will be immediately rejected.
      if (!this.extensionInvoker.isEnabled()) {
        console.error('subscribe.Promise reject', ExtensionInvoker.EXTENSION_METHODS_ARE_NOT_AVAILABLE);
        reject(ExtensionInvoker.EXTENSION_METHODS_ARE_NOT_AVAILABLE);
        return;
      }

      let callbackResult = (value: any) => {
        // if SmartConsole returns an object with "code" and "message" then this means there was an error.
        if (value.message && value.code) {
          const errorObject = value;
          // if it's a "cancelled" operation, then make sure we don't say it's an error.
          // Later, the UI will interpret that accordingly (not an error).
          if (value.code === ExtensionInvoker.OPERATION_CANCELLED_BY_USER) {
            console.error('subscribe.Promise reject', ExtensionInvoker.OPERATION_CANCELLED_BY_USER);
            reject(ExtensionInvoker.OPERATION_CANCELLED_BY_USER);
          } else {
            console.error('subscribe.Promise reject', errorObject.message);
            reject('An internal error has occured when communicating to SmartConsole. ' + errorObject.message);
          }
        } else {
          // SmartConsole returned the value successfully - so we resolve the async promise with this value.
          resolve(value);
        }
      };

      const subscriptionResult = this.interactWithSmartConsole(parameters, callbackResult);
      if (!subscriptionResult) {
        reject('An internal error has occurred when communicating to SmartConsole.');
      }
    });
  }

  public interactWithSmartConsole(parameters: any, callback: any) {
    // create a "subscriber" with the function to activate once SmartConsole returns the needed value
    const subscriber = new Subscriber(parameters.subscriptionId, callback);

    if (!this.subscribers) {
      this.subscribers = {};
    }

    // TODO we don't consider the parameters in the callback whatsoever,
    // this will be resolved once the callback methods from SmartConsole will have a consistent structure of
    // (ID, params, value).
    if (this.useCache && this.cacheValue) {
      callback(this.cacheValue);
    }

    // add this subscriber to the list of pending callbacks from SmartConsole on this particular functionName
    this.subscribers[subscriber.subscriberId] = subscriber;

    return this.extensionInvoker.invoke(this.functionName, parameters, this.callbackFunctionName);
  }

  public onCallback(value: any) {
    if (this.useCache) {
      this.cacheValue = value;
    }

    // notify the first subscriber(s) and remove it
    let subscriber;
    if (value && value.response && value.request) {
      subscriber = this.subscribers[value.request.subscriptionId];
      delete this.subscribers[value.request.subscriptionId];
      subscriber.operation(value.response);
    } else {
      for (let key in this.subscribers) {
        // check if the property/key is defined in the object itself, not in parent
        if (this.subscribers.hasOwnProperty(key)) {
          subscriber = this.subscribers[key];
          subscriber.operation(value);
        }
      }
      this.subscribers = {};
    }
  }
}
