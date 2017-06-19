const elasticlunr = require("elasticlunr");

module.exports = plugin;

function plugin(opts){
    var index = elasticlunr(function () {
        for (field of opts.fields) {
            this.addField(field);
        }
        this.setRef(opts.ref);
    });
    opts.filter = opts.filter || true
        return function(files, metalsmith, done){
            for (file in files) {
                if (opts.filter(files[file])) {
                    var post = {}
                    for (field of opts.fields) {
                        if (field == "contents") {
                            var content = files[file][field].toString()
                        } else {
                            var content = files[file][field]
                        }
                        if (typeof opts.modify_content !== "undefined") {
                            content = opts.modify_content(content)
                        }
                        post[field] = content
                    }
                    post[opts.ref] = files[file][opts.ref]
                    index.addDoc(post)
                }
            }
            index = JSON.stringify(index)
            files[opts.path] = {contents: index}
            done()
        }
    }
    