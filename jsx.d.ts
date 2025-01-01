/**
 * JSX IntrinsicElements for native DOM
 */
export namespace JSX {
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
  export interface IntrinsicElements extends JSX.HTMLDOMElements {}
}
