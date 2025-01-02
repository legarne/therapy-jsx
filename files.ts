const dTs = `declare namespace JSX {
  interface AdditionalProps {
    children?: HTMLElement;
    style?: Partial<CSSStyleDeclaration>;
    ref?: string;
  }

  type HTMLDOMElements = {
    [K in keyof HTMLElementTagNameMap]:
      & Omit<
        Partial<HTMLElementTagNameMap[K]>,
        "style"
      >
      & AdditionalProps;
  };

  interface IntrinsicElements extends HTMLDOMElements {}
}`;

export default {
  "./jsx.d.ts": dTs,
};
