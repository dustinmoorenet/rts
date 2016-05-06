module.exports = {
    entry: {
        app: './src/js/index.js',
    },
    output: {
        path: './dist',
        filename: '[name].js',
        chunkFilename: '[id].js',
        sourceMapFilename: '[file].map',
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
    resolve: {
        modulesDirectories: ['node_modules', 'src'],
    },
};
