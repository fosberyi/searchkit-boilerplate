import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import compression from 'compression';
import _ from 'lodash';

module.exports = {
  start: function(prodMode) {

    const env = {
      production: process.env.NODE_ENV === 'production'
    };

    const express = require('express');
    const app = express();
    app.use(compression())
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(methodOverride())

    const port = Number(process.env.PORT || 3000);

    if (!env.production) {
      const webpack = require('webpack');
      const webpackMiddleware = require('webpack-dev-middleware');
      const webpackHotMiddleware = require('webpack-hot-middleware');
      const config = require('../webpack.dev.config.js');
      const compiler = webpack(config);

      app.use(webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: 'src',
        stats: {
          colors: true,
          hash: false,
          timings: true,
          chunks: false,
          chunkModules: false,
          modules: false
        }
      }));

      app.use(webpackHotMiddleware(compiler));


    } else {
      app.use('/static', express.static(__dirname + '/dist'));
    }

    app.get('*', function(req, res) {
      res.render('index');
    });

    app.listen(port, function () {
      console.log('server running at localhost:3000, go refresh and see magic');
    });
  }
}
