const sharp = require("sharp")
const fs = require("fs-extra")
const slug = require("slug")
const sizeOf = require("image-size")
var path = require('path')

opts = {}
opts.dimensions = [1000, 300]
opts.input_path = process.argv[2] || "images-to-import"
// opts.output_path = "../../resources/uploads/"
opts.output_path = process.argv[3] || "temporary"
opts.main = 1000
opts.force_lowercase = true
opts.before = process.argv[4] || false
opts.overwrite = JSON.parse(process.argv[5]) || false
opts.delete = JSON.parse(process.argv[6]) || false
console.log(opts);
fs.ensureDirSync(opts.output_path)
var allowed = ["png","jpg","jpeg", "webp", "tiff", "gif", "svg"]
var files = fs.readdirSync(opts.input_path)
for (file of files) {
    var dimensions = sizeOf(path.join(opts.input_path,file))
    var ratio = dimensions.width / dimensions.height
    var extension =  path.extname(file)
    if (!allowed.includes(extension.slice(1,extension.length).toLowerCase())) {continue}
    for (size of opts.dimensions) {
        if (dimensions.height > size || dimensions.width > size) {
            function output(file, dimensions, ratio) {
                var shrink_ratio = ratio < 1 ? dimensions.width / size : size / dimensions.height
                var new_height = ratio < 1 ? Math.round(dimensions.height / shrink_ratio) : Math.round(size)
                var new_width = ratio < 1 ? Math.round(size) : Math.round(dimensions.width * shrink_ratio)
                var file_name = slug(file.slice(0, file.length - extension.length))
                if (size !== opts.main) {
                    file_name = file_name + "-"+new_width+"x"+new_height
                }
                if (opts.force_lowercase) {
                    file_name = file_name.toLowerCase()
                }
                if (opts.before) {
                    file_name = opts.before + "-" + file_name
                }
                file_name = file_name+extension
                fs.readFile(path.join(opts.input_path,file)).then(data=> {
                    if (fs.existsSync(path.join(opts.output_path, file_name)) && opts.overwrite == false) {
                        console.log(file_name + " already exists.");
                        return
                    } else {
                        return sharp(data).resize(new_width, new_height).toFile(path.join(opts.output_path, file_name))
                    }
                }).then((info, err) => {
                    if (err) {console.log(err)}
                    if (opts.delete == true) {
                        return fs.remove(path.join(opts.input_path, file))
                    }
                })
            }
            output(file, dimensions, ratio)
        }
    }
}