import { COMPONENT_NAME, SERVER_PROPERTY } from "../constants";

export default ({ types: t }) => ({
  visitor: {
    JSXElement(path) {
      // skip if not a Dehydrate component
      if (path.node.openingElement.name.name !== COMPONENT_NAME) {
        return;
      }

      const serverDehydrateMemberExpression = t.jsxMemberExpression(
        t.jsxIdentifier(COMPONENT_NAME),
        t.jsxIdentifier(SERVER_PROPERTY)
      );

      // replace `<Dehydrate>xyz</Dehydrate>`
      // with `<Dehydrate.Server>xyz</Dehydrate.Server>`
      path.node.openingElement.name = serverDehydrateMemberExpression;
      if (path.node.closingElement !== null) {
        path.node.closingElement.name = serverDehydrateMemberExpression;
      }

      // replace `<Dehydrate>foo<bar /></Dehydrate>`
      // with `<Dehydrate>{() => 'foo'}{() => <bar />}</Dehydrate>`
      path.node.children = path.node.children.map(child =>
        t.arrowFunctionExpression(
          [], // params

          // convert JSXText to a string literal, replacing repeated whitespace
          // with a single space and removing leading/trailing whitespace
          child.type === "JSXText"
            ? t.stringLiteral(child.value.replace(/\s+/g, " ").trim())
            : child
        )
      );
    },
  },
});
