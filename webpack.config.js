

module.exports = {
    entry: './app.js',
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    devtool:"cheap-source-map",
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css"},
            { test: /\.js$/, exclude: /node_modules, zmap/,
                loader: "babel"    
            },
            { test: /\.png$/, loader: "url-loader?mimetype=image/png" }
        ]
    },
}