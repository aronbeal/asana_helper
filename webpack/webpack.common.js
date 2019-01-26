const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		popup: path.join(__dirname, '../src/popup.ts'),
		options: path.join(__dirname, '../src/options.ts'),
		background: path.join(__dirname, '../src/background.ts'),
		content_script: path.join(__dirname, '../src/content_script.ts')
	},

	plugins: [
		// new CleanWebpackPlugin([path.join(__dirname,  '/../dist') ], {
		// 	root: path.join(__dirname),
		// 	// exclude: [ 'shared.js' ],
		// 	verbose: true,
        //     dry: false,
        //     watch: true,
        //     allowExternal: true
        // }),
		new CopyWebpackPlugin([
            {from:"src/assets/*", to: "assets", flatten: true},
            {from:"src/pages/*", to: "pages", flatten: true},
            {from:"src/manifest.json", to: ".", flatten: true}
        ])
	],
	output: {
		path: path.join(__dirname, '../dist'),
		filename: '[name].js'
	},
	optimization: {
		splitChunks: {
			name: 'vendor',
			chunks: 'initial'
		}
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
            }
		]
	},
	resolve: {
		extensions: [ '.ts', '.tsx', '.js' ]
	}
};
