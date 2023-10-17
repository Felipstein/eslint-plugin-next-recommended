# `eslint-plugin-next-recommended`

This ESLint plugin helps in developing projects with NextJS, using the App Router feature.

## Installation

Before getting started, ensure that you have ESLint installed.

You can then install this plugin using:

```sh
# npm
npm install -D eslint-plugin-next-recommended

# yarn
yarn add -D eslint-plugin-next-recommended

# pnpm
pnpm install -D eslint-plugin-next-recommended
```

## Usage

To start using the plugin, implement it in your ESLint configuration file as follows:

```js
{
  "plugins": [
    // ...
    "next-recommended"
  ]
}
```

I also recommend that you extend the rules set by default, so that you don't need to add rule by rule inside your ESLint configuration file:

```js
{
  "extends": [
    // ...
    "plugin:next-recommended/recommended"
  ]
}
```

### Custom Configuration

Currently, there isn't much customization to be done, but you can customize the severity of all rules.
It is not necessary to implement the code below, but it is an example of how you could modify the severity of each one.

```js
{
  "rules": {
    "next-recommended/require-use-client": "warn",
    "next-recommended/unnecessarily-client-declaration": "warn",
    "next-recommended/async-component-no-hooks": "error",
    "next-recommended/async-server-actions": "off",
    "next-recommended/async-exported-server-actions": "off",
    "next-recommended/export-server-actions-only": "warn"
  }
}
```

## Rules
`next-recommended/require-use-client`
This rule enforces that hooks and interactivity are available only for files declared as "use client". It helps maintain consistency and aligns with Next.js documentation.

`next-recommended/unnecessarily-client-declaration`
This rule identifies client-side components that are declared with "use client" but lack interactivity, highlighting unnecessary declarations.
You can configure this rule to automatically remove the "use client" statement when unnecessary, just follow the example:
```js
{
  "rules": {
    "next-recommended/unnecessarily-client-declaration": ["warn", { "autoFix": true }],
  }
}
```

`next-recommended/async-component-no-hooks`
For asynchronous components declared as async, this rule disallows the usage of hooks. Asynchronous components are intended for Server Side execution and do not support client-side-specific functionality like hooks. This error can often result from inadvertently adding 'use client' to a module originally written for the server. Refer to Next.js documentation for additional context.

`next-recommended/async-server-actions`
This rule ensures that server actions are declared as asynchronous functions, aligning with best practices for server-side functionality.

`next-recommended/async-exported-server-actions`
In server action files, this rule enforces that all exported functions are asynchronous, maintaining consistency and preventing unintended errors.

`next-recommended/export-server-actions-only`
For server action files, this rule allows only the export of functions related to server actions. Exporting anything other than functions within this context may raise exceptions in Next.js.

## Future Features:
- Rule to control exports within a page;
- Tests.

<hr/>

Please feel free to make suggestions or report bugs. Let's improve this plugin together.
