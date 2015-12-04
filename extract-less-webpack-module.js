var _less = null, 
	_imports = [],

	newModulesExports = {};

function LessVisitor( options ) {
  this.isPreEvalVisitor = false;
}
LessVisitor.prototype = {
  run: function( root ) {
	    var visitor = new _less.visitors.ImportVisitor(_imports, function() {});
	    visitor.visitRuleset(root);
	    var variables = root.variables();
	    if( variables ) {
	      for( var varName in variables ) {
	        var variable = variables[varName];
	        if( variable.variable ) {
	        	try {
	        		var key = variable.name;
	        		var value = variable.value.eval(visitor.context).toCSS();
	        		newModulesExports[ _imports.rootFilename ][key] = value;
	        	} catch( e ) {
	        		console.log("解析Less参数失败：");
	        		console.log(e);
	        	}
			}
		}
    }

  }
}

function LessPreProcessor() {};
LessPreProcessor.prototype = {
  process: function (css, extra) {
  	if( extra.imports.rootFilename === extra.fileInfo.rootFilename && extra.fileInfo.rootFilename === extra.fileInfo.filename ) {
	    _imports = extra.imports;
	    var rootFilename = _imports.rootFilename;
	    newModulesExports[rootFilename] = newModulesExports[rootFilename] || {};
	  }
    return css;
  }
};

// Less Plugin
function LessPlugin(options) {
    this.options = options;
};
LessPlugin.prototype = {
  install: function(less, pluginManager) {
		_less = less;
    pluginManager.addPreProcessor( new LessPreProcessor() );
    pluginManager.addVisitor( new LessVisitor() );
  },
  minVersion: [2, 0, 0]
};


// Webpack Plugin
function WebpackPlugin() {
}
WebpackPlugin.prototype.apply = function(compiler) {
  compiler.plugin("compilation", function(compilation, params) {
    compilation.plugin('revive-modules', function(modules, records) {

      for( var i = 0; i < modules.length; i++ ) {
        var mod = modules[i];
        if( mod && mod.userRequest ) {
        	var newSourece = newModulesExports[ mod.userRequest ];
        	if( newSourece && mod._source ) {
	          mod._source._value = 'module.exports = ' + JSON.stringify(newSourece) + ';';
        	}
        }
      }

    });    
  });

};

module.exports = {
	getLessPlugin: function() {
		return new LessPlugin();
	},

	getWebpackPlugin: function() {
		return new WebpackPlugin();
	}
};