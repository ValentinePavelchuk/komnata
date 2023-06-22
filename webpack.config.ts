import path from 'path';
import webpack from 'webpack';
import HTMLWebpackPlugin from "html-webpack-plugin";
import {} from 'webpack-dev-server';
import HtmlMinimizerPlugin from "html-minimizer-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ESLintWebpackPlugin from "eslint-webpack-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import StylelintWebpackPlugin from "stylelint-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import {glob} from "glob";

const htmlPagesGenerated:any[] = [];
const pages = glob.sync(path.resolve(__dirname, 'src', '*.hbs'), {
    ignore: path.resolve(__dirname, 'src/components', '**', '*.hbs')
});

pages.forEach((page, index) => {
    const pageName = path.basename(page, '.hbs');
    const outputFilename = `${pageName}.html`;
    htmlPagesGenerated.push(
        new HTMLWebpackPlugin({
            template: path.resolve(page),
            filename: path.resolve(__dirname, "build", outputFilename),
            publicPath: "./",
        })
    );
});

// Dynamically scan and retrieve all partial directories
const partialsDir = path.resolve(__dirname, 'src/components');
const partialPaths = glob.sync(path.resolve(__dirname, 'src/components', '**'));
const partialPaths2 = glob.sync(path.resolve(__dirname, 'src/components', '**'), {
    ignore: [
        path.resolve(__dirname, 'src/components', '**', '*.scss'),
        path.resolve(__dirname, 'src/components', '**', '*.hbs')
    ],
});

console.log(partialPaths2, "PAAAAAATH")
const config:webpack.Configuration = {
    context: path.join(__dirname, 'src'),
    entry: path.resolve(__dirname, 'src', 'index.ts'),
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, 'build'),
        publicPath: "",
        clean: true
    },
    optimization: {
        usedExports: true,
        minimizer: [
            new HtmlMinimizerPlugin(),
            new CssMinimizerPlugin(),
            //new TerserPlugin(),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        plugins: [
                            "imagemin-gifsicle",
                            "imagemin-mozjpeg",
                            "imagemin-pngquant",
                            "imagemin-svgo",
                        ],
                    },
                },
                generator: [
                    {
                        preset: "webp",
                        implementation: ImageMinimizerPlugin.imageminGenerate,
                        options: {
                            plugins: ["imagemin-webp"],
                        },
                    },
                ],
            }),
        ]
    },
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: "src"
        },
        compress: true,
        port: 8000,
        hot: true,
        historyApiFallback: true,
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.hbs"),
            filename: path.resolve(__dirname, "build", "index.html"),
            publicPath: "./",
        }),
        new MiniCssExtractPlugin(),
        new CopyPlugin({
            patterns: [{
                context: path.resolve(__dirname, 'src', 'images'),
                from: path.resolve(__dirname, 'src', 'images'),
                to: 'images/'
            }]
        }),
        new ESLintWebpackPlugin(),
        new StylelintWebpackPlugin(),
        new webpack.ProgressPlugin(),
        ...htmlPagesGenerated
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name].[hash][ext]'
                }
            },
            {
                test: /\.html$/i,
                type: "asset/resource",
            },
            {   test: /\.hbs$/,
                loader: "handlebars-loader",
                options: {
                    partialDirs: [...partialPaths],
                }
            },
            {
                test: /\.(scss|css)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', "postcss-loader", 'sass-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            styles: path.resolve(__dirname, 'src/styles/'),
            components: path.resolve(__dirname, 'src/components/'),
        },
    }
}
export default config;