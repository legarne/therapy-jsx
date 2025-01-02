# @therapy/jsx

[![JSR](https://jsr.io/badges/@therapy/jsx)](https://jsr.io/@therapy/jsx)

## Description

@therapy/jsx provides a custom JSX factory for working with native HTML
elements. The package adds compatibility to the native DOM with a simple and
familiar JSX workflow.

## Permissions

@therapy/jsx does not require any additional permissions.

@therapy/jsx/add-types requires the following permissions:

- read
- write

## Installation

```bash
deno add jsr:@therapy/jsx

# Add jsx.d.ts types for IntrinsicElements
deno run jsr:@therapy/jsx/add-types
```

### Usage and Examples

#### IntrinsicElements & Types

The JSX namespace can be added with `deno run @therapy/jsx/add-types`, which will add a `jsx.d.ts`
file and automatically configure the `deno.json` to use it.

It is this following type:

```ts
declare namespace JSX {
  interface AdditionalProps {
    children?: HTMLElement;
    style?: Partial<CSSStyleDeclaration>;
    ref?: string;
  }

  type HTMLDOMElements = {
    [K in keyof HTMLElementTagNameMap]: Omit<
      Partial<HTMLElementTagNameMap[K]>,
      "style"
    > &
      AdditionalProps;
  };

  interface IntrinsicElements extends HTMLDOMElements {}
}
```

`AdditionalProps` can be extended if you require more props that all elements should inhereit.

Make sure that your `denoJson.compilerOptions.lib` include `"dom"` and `"deno.ns"`.

#### Basic Example

The jsx function creates `HTMLElement` as if `document.createElement()` was called with little other side effects.

```tsx
import { jsx } from "@therapy/jsx";

const docElement = document.createElement("div");
docElement.innerHTML = `<span>Hello World</span>`;

const jsxElement: HTMLDivElement = (
  <div>
    <span>Hello World</span>
  </div>
);
```

#### Props

JSX Elements support most html properties that exist on an element. For example,
a style and onclick prop.

```tsx
import { jsx } from "@therapy/jsx";

const el: HTMLDivElement = (
  <div onclick={() => console.log("Goodbye World")}>
    <span style={{ color: "blue" }}>Hello World</span>
  </div>
);
```

Note that the jsx factory uses built-in properties on elements as they are, and does not use
casings or patters that are familiar to React or similar, with the exception of `style`.

```ts
import { jsx } from "@therapy/jsx";

// note onclick, and not onClick
const el: HTMLDivElement = <div onclick={() => console.log("Goodbye World")} />;
```

You can attach custom properties to elements that are accessible after creation.

```ts
import { jsx } from "@therapy/jsx";

const el: HTMLDivElement = (
  <div
    dataObj={{ foo: true, bar: false }}
    strAtr={"An attribute"}
    boolAtr
  />
);

console.log(el.dataObj, el.strAtr, el.boolAtr);
/**
 * { foo: true, bar: false }, An attribute, true
 */

 // For strings and booleans, they will also be available in an element's attributes member
 console.log(el.attributes);
 // [stratr, boolatr]
```

Custom properties like this will cause type errors, so you will need to augment your type file.
There are different methods available, but here is an example if using the `jsx.d.ts` file from `@therapy/jsx/add-types`.

```ts
declare namespace JSX {
  interface AdditionalProps {
    children?: HTMLElement;
    style?: Partial<CSSStyleDeclaration>;
    ref?: string;
  }

  type HTMLDOMElements = {
    [K in keyof HTMLElementTagNameMap]: Omit<
      Partial<HTMLElementTagNameMap[K]>,
      "style"
    > &
      AdditionalProps;
  } & {
    div: {
      dataObj: { foo: true; bar: false };
      strAtr: string;
      boolAtr: boolean;
    };
  };

  interface IntrinsicElements extends HTMLDOMElements {}
}
```

`AdditionalProps` can also be used, if you would like the props to be applied globally.

#### Fragment

There is a unique export of the package that provides a document fragment.

```tsx
import { jsx, Fragment } from "@therapy/jsx";

const el: HTMLElement = (
  <Fragment>
    <span>Hello</span>
    <span>Goodbye</span>
  </Fragment>
);
```

#### Async Elements

JSX Element values are allowed to be asynchronous.

```tsx
import { jsx } from "@therapy/jsx";

const val = new Promise((res) => {
  setTimeout(() => res(Math.random().toString()), 5000);
});

const el: HTMLSpanElement = <span>{await val}</span>;
```

#### Element Arrays

`@therapy/jsx` array-like elements don't need keys or references, but they must be spread
after creation.

```tsx
import { jsx } from "@therapy/jsx";

const names = ["Tom", "Bob", "Pete"];

const nameElements: HTMLSpanElement[] = names.map((name) => {
  return <span>{name}</span>;
});

const container: HTMLDivElement = <div>{...nameElements}</div>;
```

## License

MIT
