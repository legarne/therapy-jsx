declare namespace JSX {
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

  interface IntrinsicElements extends JSX.HTMLDOMElements {}
}
