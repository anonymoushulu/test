var stream = require('stream')

module.exports = CSVParser;

CSVParser.prototype = Object.create(stream.Transform.prototype, {
    constructor: {value: CSVParser}
})

function CSVParser(options) {
    options = options || {};
    options.objectMode = true;
    stream.Transform.call(this, options)

    this.value = '';
    this.headers = [];
    this.values = [];
    this.line = 0;
}

CSVParser.prototype._transform = function(chunk, encoding, done) {
    var c;
    var i;

    chunk = chunk.toString();

    for(i = 0; i < chunk.length; i++) {
        c = chunk.charAt(i);

        if(c === ',') {
            this.addValue();
        } else if (c === '\r') {
            this.addValue();
            if(this.line > 0) {
                //console.log('headers:', this.headers)
                this.push(this.toObject())
            }
            this.values = [];
            this.line++;
            i++;
        } else {
            this.value += c;
        }
    }

    done();
}

CSVParser.prototype.toObject = function() {
    var i;
    var obj = {};
    for (i = 0; i < this.headers.length; i++) {
        obj[this.headers[i]] = this.values[i];
    }
    //console.log(obj);
    return obj;
}

CSVParser.prototype.addValue = function() {
    if (this.line === 0) {
        this.headers.push(this.value);
    } else {
        this.values.push(this.value);
    }
    this.value = '';
}