let csvFormatData="Data,Halum,Galum"
var fs = require('fs');
var stream = fs.createWriteStream("my_file.csv");
stream.once('open', function(fd) {
  stream.write(csvFormatData);

  stream.end();
});