// Generated by CoffeeScript 1.9.1
(function() {
  var async, build, exec, green, log, ref, reset, spawn, which;

  ref = require('child_process'), spawn = ref.spawn, exec = ref.exec;

  which = require('which');

  async = require('async');

  green = '\x1B[0;32m';

  reset = '\x1B[0m';

  log = function(message, color, explanation) {
    return console.log(color + message + reset + ' ' + (explanation || ''));
  };

  build = function(callback) {
    return async.parallel({
      copyFile: function(next) {
        var cmd, copy, options;
        cmd = which.sync('rsync');
        options = ['-qrc', './', '.app', '--exclude=*.coffee'];
        copy = spawn(cmd, options);
        copy.stdout.pipe(process.stdout);
        copy.stderr.pipe(process.stderr);
        return copy.on('exit', function(status) {
          return next(null, status);
        });
      },
      compile: function(next) {
        var cmd, coffee, options;
        options = ['-c', '-b', '-o', '.app', './'];
        cmd = which.sync('coffee');
        coffee = spawn(cmd, options);
        coffee.stdout.pipe(process.stdout);
        coffee.stderr.pipe(process.stderr);
        return coffee.on('exit', function(status) {
          return next(null, status);
        });
      }
    }, function(err, results) {
      if (err) {
        return console.log(err);
      } else {
        if (results.copyFile === 0 && results.compile === 0) {
          return log('build success', green);
        }
      }
    });
  };

  task('build', function() {
    return build(function() {
      return log(":)", green);
    });
  });

  task('dev', 'start dev env', function() {
    var cmd, coffee, options;
    options = ['-c', '-b', '-w', '-o', '.app', './'];
    cmd = which.sync('coffee');
    coffee = spawn(cmd, options);
    coffee.stdout.pipe(process.stdout);
    coffee.stderr.pipe(process.stderr);
    return log('Watching coffee files', green);
  });

  task('debug', 'start debug env', function() {
    var app, cmd, coffee, inspector, options;
    options = ['-c', '-b', '-w', '-o', '.app', 'src'];
    cmd = which.sync('coffee');
    coffee = spawn(cmd, options);
    coffee.stdout.pipe(process.stdout);
    coffee.stderr.pipe(process.stderr);
    log('Watching coffee files', green);
    app = spawn('node', ['--debug', 'server']);
    app.stdout.pipe(process.stdout);
    app.stderr.pipe(process.stderr);
    inspector = spawn('node-inspector');
    inspector.stdout.pipe(process.stdout);
    inspector.stderr.pipe(process.stderr);
    return exec('hostname -i', function(err, stdout, stderr) {
      var ip;
      ip = '127.0.0.1';
      if (!err) {
        ip = stdout.replace(/\s$/, '');
      }
      return console.log('open chrome and debug by visit: http://' + ip + ':8080/debug?port=5858');
    });
  });

}).call(this);
