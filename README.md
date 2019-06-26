# smart-console-interactions

> A JavaScript library to interact with SmartConsole Extension Platform

## Installation

```
$ npm install smart-console-interactions
```

## Basic Usage

```jsx
import SmartConsoleInteractions from 'smart-console-interactions';
.
.
const interactions = new SmartConsoleInteractions(demoInteraction);
const context = await this.interactions.getContextObject();
```

## API

**Functions**

- `query` - Execute query to get objects from the Security Management API.
- `getContextObject` -Extension context provided by SmartConsole.
- `requestCommit` - Request SmartConsole user to execute list of commands. Used by extensions to apply changes by SmartConsole user private session.
- `navigate` - Request SmartConsole to navigate to a rule.
- `closeExtensionWindow` - Request SmartConsole to close the extension window.

See [SmartConsole Extension Developer Guide](https://sc1.checkpoint.com/documents/SmartConsole/Extensions/index.html?ref=git) for additional information.

