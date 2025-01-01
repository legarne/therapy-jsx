/**
 * JSX IntrinsicElements for native DOM
 */
declare global {
  namespace JSX {
    type HTMLDOMElements = {
      [K in keyof HTMLElementTagNameMap]:
        & Omit<
          Partial<HTMLElementTagNameMap[K]>,
          "style"
        >
        & {
          children?: HTMLElement;
          ref?: string;
          style?: Partial<CSSStyleDeclaration>;
        };
    };

    /**
     * JSX IntrinsicElements for native DOM
     */

    interface IntrinsicElements extends HTMLDOMElements {}
  }
}

function _parseChildren(children: any[]) {
  return children.map((child) => {
    if (typeof child === "string") return document.createTextNode(child);
    return child;
  });
}

function _handleElement(
  element: string,
  properties: Record<string, any> | null,
  children: any[],
) {
  const el = document.createElement(element) as
    & Record<string, any>
    & HTMLElement;

  if (properties) {
    Object.keys(properties).forEach((key) => {
      if (key === "style") {
        const { ...styleObj } = properties[key];
        Object.keys(styleObj).forEach((styleKey) => {
          el.style[styleKey as any] = styleObj[styleKey];
        });
      } else if (key === "className") {
        const classes: string[] = properties[key].split(" ");
        el.classList.add(...classes);
      } else el[key] = properties[key];

      // sets attributes if they are strings or booleans
      if (typeof properties[key] === "string") {
        el.setAttribute(key, properties[key]);
      }
      if (typeof properties[key] === "boolean") {
        if (properties[key]) el.setAttribute(key, "");
        else el.removeAttribute(key);
      }
    });
  }

  _parseChildren(children).forEach((child) => {
    el.appendChild(child);
  });

  return el;
}

type ElementFunc = (...el: any) => HTMLElement;

function _htmlFactory(
  element: string | ElementFunc,
  properties: Record<string, any> | null,
  ...children: any[]
): HTMLElement {
  if (typeof element === "function" && element.name === "_fragmentFactory") {
    return element(...children);
  }
  if (typeof element === "function") return element({ children });

  return _handleElement(element, properties ?? null, children);
}

/**
 * A custom JSX factory function that creates and returns plain `HTMLElement`.
 * There are a few special rules:
 *   - The `style` prop takes in an object of CSSProperties
 *   - If 'className' is used, multiple classes will be split by a space, and each will be added to the classList
 *   - Any prop will be added to the element object as a key/value (and member in the case of a custom WebComponent)
 *   - Strings and booleans will also be added to the attributes of an element
 */
export const jsx = _htmlFactory;

type JsxC<T extends Record<any, any> = any> = (
  props: T & { children?: HTMLElement[] },
) => Node;

/**
 * A fragment-like component that groups multiple child elements without adding
 * an additional wrapper element.
 *
 * It creates a `DocumentFragment` and appends all child `HTMLElement` to it.
 *
 * @param props - Props object containing optional children.
 * @returns A document fragment containing all provided child elements.
 */
export const Fragment: JsxC = ({ children }) => {
  const docFrag = document.createDocumentFragment();
  children.forEach((child: HTMLElement) => docFrag.appendChild(child));

  return docFrag;
};
