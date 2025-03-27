import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that a variable named `foo` can only be assigned a specific value, provided by options.',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          requiredValue: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const expectedValue = context.options[0]?.requiredValue || 'bar';

    return {
      // Performs action in the function on every variable declarator
      VariableDeclarator(node) {
        // Check if a `const` variable declaration
        if ('kind' in node.parent && node.parent.kind === 'const') {
          // Check if variable name is `foo`
          if (node.id.type === 'Identifier' && node.id.name === 'foo') {
            // Check if value of variable is "bar"
            if (
              node.init &&
              node.init.type === 'Literal' &&
              node.init.value !== expectedValue
            ) {
              /*
               * Report error to ESLint. Error message uses
               * a message placeholder to include the incorrect value
               * in the error message.
               * Also includes a `fix(fixer)` function that replaces
               * any values assigned to `const foo` with "bar".
               */
              context.report({
                node,
                message:
                  'Value other than "{{ expectedValue }}" assigned to `const foo`. Unexpected value: "{{ actualValue }}".',
                data: {
                  expectedValue,
                  actualValue: String(node.init.value),
                },
                fix(fixer) {
                  return fixer.replaceText(node.init, `"${expectedValue}"`);
                },
              });
            }
          }
        }
      },
    };
  },
};

export default rule;
