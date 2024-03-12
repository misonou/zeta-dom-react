const { createBaseWebpackConfig, createUMDExternal, createUMDLibraryDefinition, getPaths } = require('@misonou/build-utils');
const path = require('path');
const paths = getPaths();

module.exports = {
    ...createBaseWebpackConfig(),
    entry: {
        'zeta-dom-react': './src/entry.js',
        'zeta-dom-react.min': './src/entry.js',
    },
    output: {
        path: paths.dist,
        filename: '[name].js',
        library: createUMDLibraryDefinition('zeta-dom-react', 'zeta.react', '*')
    },
    resolve: {
        alias: {
            [path.resolve('src/env.js')]: path.resolve('src/env.umd.js')
        }
    },
    externals: {
        'react': createUMDExternal('react', 'React'),
        'react-dom': createUMDExternal('react-dom', 'ReactDOM')
    }
};
