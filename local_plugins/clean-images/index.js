const fs = require("fs-extra")

module.exports = plugin;

function plugin(opts){
   return function(files, metalsmith, done){
      if ((opts.only_dev == true && process.env.NODE_ENV == "dev") || opts.only_dev == false) {
         var uploads_list = fs.readdirSync("resources/uploads")
         var images_list = fs.readdirSync("resources/images")
         var full_list = []
         for (file of uploads_list) {
            full_list.push("/resources/uploads/"+file)
         }
         for (file of images_list) {
            full_list.push("/resources/images/"+file)
         }
         var in_use = []
         for (file in files) {
            var post = files[file]
            if (opts.only_dev == false) {
               if ((typeof post.draft !== "undefined" && post.draft == true) || (typeof post.published !== "undefined" && post.published == false) || (typeof post.status !== "undefined" && post.status == "draft")) {
                  continue
               }
            }
            if (file !== "resources/index.json") {
               if (typeof post.thumbnail_url !== "undefined") {
                  var src = post.thumbnail_url
                  if (src.indexOf("resources") !== -1) {
                     for (list_item of full_list) {
                        if (list_item.indexOf(src.slice(0,-4)) !== -1 && in_use.indexOf(list_item) == -1) {
                           in_use.push(list_item)
                        }
                     }
                  }
               }
               var contents = files[file].contents.toString()
               contents.replace(/is_thumb.*?src=\"(.*?)\"/g, function(match, src){
                  if (src.indexOf("resources") !== -1) {
                     for (list_item of full_list) {
                        if (list_item.indexOf(src.slice(0,-12)) !== -1 && in_use.indexOf(list_item) == -1) {
                           in_use.push(list_item)
                        }
                     }
                  }
               })
               contents.replace(/src=\"(.*?)\"/g, function(match, src){
                  if (src.indexOf("resources") !== -1) {
                     for (list_item of full_list) {
                        if (list_item.indexOf(src) !== -1 && in_use.indexOf(list_item) == -1) {
                           in_use.push(list_item)
                           //console.log(list_item);
                        }
                     }
                  }
               })
            }
         }
         for (item of opts.ignore) {
            for (item_list of full_list) {
               if(item_list.indexOf(item) !== -1) {
                  in_use.push(item_list)
               }
            }
         }
         for (item of in_use) {
            var index = full_list.indexOf(item);
            if (index !== -1) {
               full_list.splice(index,1)
            }
         }
         fs.ensureDirSync("unused_images")
         for (file of full_list) {
            console.log("Unused: ", file);
               fs.moveSync(file.slice(1,file.length), "unused_images/"+file.slice("/resources/".length, file.length), {overwrite:true})
               fs.removeSync("unused_images/==LIST.txt")
               fs.writeFileSync("unused_images/==LIST.txt", full_list.join("\r\n"))
         }
      }
      done()
   }
}
