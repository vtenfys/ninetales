export default ({ types: t }) => ({
  visitor: {
    JSXElement(path) {
      if (path.openingElement.name.name !== "Dehydrate") {
        return;
      }

      path.replaceWith(
        t.jSXElement(
          t.jSXOpeningElement(t.jSXIdentifier("Dehydrate"), [], true),
          null,
          [],
          true
        )
      );
    },
  },
});
