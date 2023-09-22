const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname,'./src/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'twilio-sms.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../../node_modules/@salesforce-ux/design-system/assets'),
                    to: path.resolve(__dirname, 'dist/design-system')
                },
            ]}),
    ],
}