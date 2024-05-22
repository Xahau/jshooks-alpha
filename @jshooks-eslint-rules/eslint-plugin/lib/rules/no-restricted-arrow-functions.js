module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow most functions.",
      category: "JS Hooks",
      recommended: false,
    },
    messages: {
      OnlyHookCbFns: "Functions are only allowed if assigned to a top level variable named 'Hook' / 'Callback', or closure in an Array method",
      OnlyTopLevelFn: "Functions are only allowed at the application top level.",
    },
    schema: [], // no options
  },
  create(context) {
    return {
      VariableDeclarator(node) {
        const { id, init } = node;
        if (init && (init.type === "ArrowFunctionExpression" || init.type === "FunctionDeclaration" || init.type === "FunctionExpression")) {
          if (id.type !== "Identifier" || !(id.name === "Hook" || id.name === "Callback")) {
            context.report({ node: init, messageId: "OnlyHookCbFns" });
          } else if (node.parent.parent.type !== "Program") {
            // Not top level
            context.report({ node: init, messageId: "OnlyTopLevelFn" });
          }
        }
      },
      ArrowFunctionExpression(node) {
        const parent = node.parent;
        
        if (parent && parent.type === 'VariableDeclarator' && (parent.id.name === 'Hook' || parent.id.name === 'Callback')) {
          return;
        }

        if (parent && parent.callee && parent.callee.object && parent.callee.object.type) {
          if (parent.callee.object.type === "ArrayExpression") {
            // Array closure. e.g. map reduce filter
            return
          }
        }
        
        context.report({ node: node, messageId: "OnlyHookCbFns" });
      },
      FunctionExpression(node) {
        const parent = node.parent;
        
        if (parent && parent.type === 'VariableDeclarator' && (parent.id.name === 'Hook' || parent.id.name === 'Callback')) {
          return;
        }

        if (parent && parent.callee && parent.callee.object && parent.callee.object.type) {
          if (parent.callee.object.type === "ArrayExpression") {
            // Array closure. e.g. map reduce filter
            return
          }
        }
        
        context.report({ node: node, messageId: "OnlyHookCbFns" });
      }
    };
  },
};
