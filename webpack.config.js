const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PAGES = fs.readdirSync('./src/components/pages/').filter(fileName => fileName.endsWith('.pug'));
const FileManagerPlugin = require('filemanager-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const configureCopy = () => {
    return [
        // {from: 'src/video/', to: 'video/'},
        {from: 'src/images/', to: 'images/'},
        {from: 'src/fonts/', to: 'fonts/'},
        // {from: 'src/js/', to: 'js/'},
        // {from: 'src/css/', to: 'css/'}
    ]
};

module.exports = {
    mode: 'development',

    entry: {
        index: './src/index.js'
    },

    output: {
        filename: 'js/temp-index.min.js',
        path: path.resolve(__dirname, 'docs')
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                },
                generator: {
                    filename: 'js/[name][ext]'
                },
            },
            {
                test: /\.(svg|png|jpg|gif|jpeg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]'
                },
            },
            {
                test: /\.(mp4)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'video/[name][ext]'
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            {
                test: /\.pug$/,
                use: {
                    loader: 'pug-loader',
                    options: {
                        pretty: true,
                        self: true
                    }
                }
            },
            {
                test: /\.sass$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    // 'style-loader', // style nodes from js strings
                    'css-loader',
                    'sass-loader',
                ]
            }, {
                test: /\.css$/i,
                use: [
                    {
                        loader: "style-loader",
                        options: {
                            insert: "body",
                        },
                    },
                    "css-loader",
                ],
            },
        ]
    },

    devServer: {
        port: 8080,
        hot: true,
        open: true,
    },

    plugins: [
        new FileManagerPlugin({
            events: {
                onStart: {
                    delete: ['docs'],
                },
            }
        }),
        new CopyWebpackPlugin({
            patterns: configureCopy()
        }),
        new MiniCssExtractPlugin({
            filename: 'css/style.css',
            chunkFilename: '[id].css',
        }),
        ...PAGES.map(page => new HtmlWebPackPlugin({
                template: `./src/components/pages/${page}`,
                filename: `${page.replace(/\.pug/, '.html')}`,
                file: require('./src/data/index.json'),
                cache: false,
                minify: {
                    html5                          : true,
                    collapseWhitespace             : true,
                    minifyCSS                      : true,
                    minifyJS                       : true,
                    minifyURLs                     : true,
                    removeAttributeQuotes          : true,
                    removeComments                 : true, // false for Vue SSR to find app placeholder
                    removeEmptyAttributes          : true,
                    removeOptionalTags             : true,
                    removeRedundantAttributes      : true,
                    removeScriptTypeAttributes     : true,
                    removeStyleLinkTypeAttributes  : true,
                    useShortDoctype                : true
                }
            })
        )
    ],

    optimization: {
        minimizer: [new TerserPlugin(), new CssMinimizerPlugin(),],

        minimize: true,

        splitChunks: {
            cacheGroups: {
                vendors: {
                    priority: -10,
                    test: /[\\/]node_modules[\\/]/
                }
            },

            chunks: 'async',
            minChunks: 1,
            minSize: 30000,
            name: false
        }
    }
};
