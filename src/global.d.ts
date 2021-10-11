declare module "*.scss" {
  const content: Record<string, CSSRule>;
  export default content;
}

declare module "*.module.scss" {
  const styles: Record<string, CSSRule>;
  export default styles;
}
