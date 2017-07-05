const elasticlunr = require("elasticlunr");

module.exports = plugin;

function plugin(opts){
    opts.filter = opts.filter || function(file){return true}
        return function(files, metalsmith, done){
            var files_index = {}
            for (file in files) {
                if (opts.filter(files[file])) {
                   let post = {}
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
                    let id = files[file][opts.ref]
                    files_index[id] = post
                }
            }
            files_index = JSON.stringify(files_index)
            files[opts.path] = {contents: files_index}
            done()
        }
    }
    