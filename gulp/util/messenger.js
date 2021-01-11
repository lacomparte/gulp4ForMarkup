const ansiHTML = require('ansi-html');
const colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
ansiHTML.setColors(colors);
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const browserSync = require('browser-sync').get('server');

module.exports = function() {
    return {
        send: function(title, message) {
            return browserSync.sockets.emit('fullscreen:message', {
                title: title,
                titleStyles: 'position:fixed;top:0;right:0;left:0;margin:0;padding:20px;height:20px;line-height:15px;font-size:20px;line-height:1;color:#e36049;background-color:rgba(0,0,0,0.9);',
                wrapperStyles: 'overflow-y:auto;position:fixed;top:60px;right:0;bottom:0;left:0;line-height:1;color:#fff;background-color:rgba(0,0,0,0.9);',
                preStyles: 'padding:20px;color:#fff;font-family:Menlo,Consolas,monospace;line-height:1.4;letter-spacing:0.05em',
                body: ansiHTML(entities.encode(message)),
                timeout: 1000 * 60 * 10
            });
        },

        clear: function() {
            return browserSync.sockets.emit('fullscreen:message:clear');
        }
    };
};
