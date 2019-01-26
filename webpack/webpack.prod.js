const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
	plugins: [
        // Ensure we have a clean build.
		new CleanWebpackPlugin([ path.join(__dirname, '/../dist') ], {
			root: path.join(__dirname),
			// exclude: [ 'shared.js' ],
			verbose: true,
			dry: false,
			watch: true,
			allowExternal: true
		})
	]
});
