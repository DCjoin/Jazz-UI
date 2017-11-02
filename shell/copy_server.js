var fs = require( 'fs' ),
    stat = fs.stat;

var copy = function( src, dst ){
    fs.readFile( src, function( err, data ){
        if( err ){
            throw err;
        }
        fs.writeFile(dst, data, (err) => {
          if (err) throw err;
          console.log('Server file has been saved!');
        });
    });
};
copy('./src/server/release_server.js', './build/release_server.js');
copy('./src/server/metadata_sp.xml', './build/metadata_sp.xml');
copy('./src/server/onelogin_metadata.xml', './build/onelogin_metadata.xml');
copy('./src/server/SE-SP.pem', './build/SE-SP.pem');