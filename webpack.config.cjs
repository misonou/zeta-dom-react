const { createBaseWebpackConfig, createUMDExternal, createUMDLibraryDefinition, getPaths } = require('@misonou/build-utils');
const path = require('path');
const paths = getPaths();

function getRelativeModulePath(filename, modulePath) {
    var relPath = path.relative(path.dirname(filename), modulePath).replace(/\\/g, '/');
    if (relPath[0] !== '.') {
        relPath = './' + relPath;
    }
    return relPath;
}

/**
 * @param {import("@babel/core")} babel
 * @return {{ visitor: import("@babel/core").Visitor<{ filename: string }> }}
 */
function babelPlugin(babel) {
    const modulePath = path.resolve('src/env.umd.js');
    const { types: t, template } = babel;
    return {
        visitor: {
            Program(path, s) {
                const pDecl = path.get('body')
                    .filter(p => p.isVariableDeclaration())
                    .flatMap(p => p.get('declarations'))
                    .find(p => t.isIdentifier(p.node.id, { name: 'IS_DEV' }));

                if (pDecl) {
                    const nodeToInsert = template.ast(`import { IS_DEV } from '${getRelativeModulePath(s.filename, modulePath)}';`);
                    const lastImport = path.get('body').findLast(p => p.isImportDeclaration());
                    if (lastImport) {
                        lastImport.insertAfter(nodeToInsert);
                    } else {
                        path.unshiftContainer('body', nodeToInsert);
                    }
                    if (pDecl.parentPath.node.declarations.length === 1) {
                        pDecl.parentPath.remove();
                    } else {
                        pDecl.remove();
                    }
                }
            }
        }
    };
}

module.exports = {
    ...createBaseWebpackConfig({
        hoistImports: ['react'],
        babelPlugins: [babelPlugin]
    }),
    entry: {
        'zeta-dom-react': './src/entry.js',
        'zeta-dom-react.min': './src/entry.js',
    },
    output: {
        path: paths.dist,
        filename: '[name].js',
        library: createUMDLibraryDefinition('zeta-dom-react', 'zeta.react', '*')
    },
    externals: {
        'react': createUMDExternal('react', 'React'),
        'react-dom': createUMDExternal('react-dom', 'ReactDOM')
    }
};
