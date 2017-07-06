const metalsmith = require('metalsmith')
const fs = require('fs-extra');
const layouts = require('metalsmith-layouts')
const addExtension = require('metalsmith-layouts-add-extension')
const organizer = require('metalsmith-organizer')
const ejs = require('ejs')
const autoprefixer = require('metalsmith-autoprefixer');
//const htmlMinifier = require("metalsmith-html-minifier");
const moment = require('moment');
const shortcodes = require('metalsmith-shortcodes-replace');
const shortcodes_config = require('./shortcodes.js')
const lazyloader = require('metalsmith-lazyloader');
const request = require('sync-request');
const showdown = require('metalsmith-showdown');
const md = new showdown.expose.Converter({flavor:"github"})
//const uglify = require('metalsmith-uglify');
const related = require ('metalsmith-related-posts');
const sizeOf = require('image-size');
const title_svg_content = fs.readJsonSync("./resources/styles-parts/styles svgs/logos.json")
const sass = require('metalsmith-sass');
const probe = require("probe-image-size");
const search = require("search");//TODO
const path = require("path")
// const clean_images = require("clean-images");
const minify = require('html-minifier').minify;
// const CleanCSS = require("clean-css")
const UglifyJS = require("uglify-js")
const FileHound = require('filehound');

if (typeof process.env.TRAVIS == "undefined") {
    var YTAPI = require("./env_variables.js").YTAPI
} else {
    var YTAPI = process.env.YTAPI
}

var include_drafts = false;
if (process.env.NODE_ENV == "dev") {
    include_drafts = true;
}
if (fs.existsSync("./public")) {
    // delete all but images
    var public_files = fs.readdirSync("./public")
    if (typeof public_files !== "undefined") {
        public_files.forEach(file => {
            if (file !== "resources") {
                fs.removeSync("./public/"+file)
            }
        });
    }
    fs.removeSync("./public/resources/index.json")
}

metalsmith(__dirname)
.metadata({
    site: {
        //url:"localhost:8080",
        url: "https://alansartlog.com",
        debug: false,
        big_header: true,
        title_svg: title_svg_content.mix_optimized,
        title: 'Alan\'s Art Log',
        show_title: true,
        description: "Paintings, sketches, tutorials, videos, and art related DIY projects.",
        rss_category: "Art",
        favicon: "/resources/images/pencil-logo-icon-150x150.jpg",
        show_description: true,
        author: "Alan North",
        email: "alansartlog@gmail.com",
        copyright_start_year: 2017,
        copyright_notice: "All rights reserved unless otherwise stated.",
        uploads: "/resources/uploads/",
        theme_images: "/resources/images/",
        discuss_src:"//alansartlog.disqus.com/embed.js",
        google_tag_manager: "GTM-WSFDZJ",
        thumb_above: true,
        nav_links: {
            About: "/about",
            Contact: "/contact",
            Artwork: "/artwork",
            Store: "https://gumroad.com/alansartlog",
        },
        social_links : {
            Youtube: {
                icon: "icon-youtube",
                href: "http://youtube.com/alansartlog",
            },
            Twitter: {
                icon: "icon-twitter",
                href: "http://twitter.com/alansartlog",
            },
            Instagram: {
                icon: "icon-instagram-1",
                href: "https://www.instagram.com/alansartlog/",
            },
            Facebook: {
                icon: "icon-facebook-squared",
                href: "https://www.facebook.com/alansartlog/",
            },
            Patreon: {
                icon: "icon-patreon", //mine
                href: "https://www.patreon.com/alansartlog",
            },
            Newsletter: {
                icon: "icon-mail",
                href: "http://feeds.specificfeeds.com/alansartlog?subParam=followPub",
                alt: "Subscribe through Email"
            },
            RSS: {
                icon: "icon-rss",
                href: "http://alansartlog.com/rss",
                alt: "Subscribe through RSS"
            },
            // Reddit: {
            //     href: "https://www.reddit.com/user/alansartlog/",
            // },
            // Instructables: {
            //     href: "http://www.instructables.com/member/alansartlog/",
            // },
            // deviantART: {
            //     href: "http://alansartlog.deviantart.com",
            // },
        }
        //project_links
        //project_links_menu_limit
    }
})
.source('./src')
.destination('./pre-public')
.ignore(function(filepath, stats) {
    if (filepath.match(/.*?\.cat5/) !== null) {
        return true
    } else {
        return false
    }
})
.use(related ({
    min_tags: 2,
    max_posts: 5,
    min_posts: 2,
}))
.use(shortcodes(shortcodes_config))
.use(showdown({//markdown
    convert : ["thumbnail_caption", "contents"],
    options: {
    omitExtraWLInCodeBlocks: true,
    strikethrough: true,
    tables: true,
    tasklists: true,
    ghMentions: true,
    requireSpaceBeforeHeadingText: true
  },
}))
// .use(clean_images({
//     only_dev: false,
//     ignore: ["pencil-logo-icon"]
// }))
.use(lazyloader({
    clean_cache: false,
    after: "</div>",
    before: "<div class=\"lazy-wrapper\">",
    lazy_attribute: "data-src",
    svg: true,
    add_noscript: true,
    fetch_size: true,
    force_absolute: true
}))
.use(organizer({
    delete_originals: true,
    permalink_group: "posts",
    drafts: include_drafts,
    //make_safe
    groups: [
        {   group_name: "posts",
            type: "post",
            path: "{date}/{num}/{title}",
            date_format: "YYYY/MM",
            date_page_layout: "index-list-item/index-list-item",
            num_format: "page/{num}",
            per_page: 10,
            add_prop: [{search: true}],
        },
        {   group_name: "index",
            type: "post",
            page_layout: "index",
            path: "{num}",
            num_format: "page/{num}",
            per_page:10,
        },
        {   group_name: "tags",
            type: "post",
            page_layout: "index",
            //page_layout: "page-tags", ???
            expose: "tags",
            path: "{group}/{expose}/{num}",
            num_format: "page/{num}",
            per_page:10,
        },
        {   group_name: "artwork",
            tags: "artwork",
            thumbnail_url: true,
            expose: "tags",
            page_layout: "index-masonry-thumb",
            path: "{group}/{num}",
            num_format: "page/{num}",
            per_page: 30,
        },
        {   group_name: "pages",
            type: "page",
            path: "{title}",
            override_permalink_group: true,
        },
        {   group_name: "error",
            type: "error",
            path: "{title}",
            override_permalink_group: true,
            no_folder: true
        },
        {   group_name: "rss",
            type: "post",
            path: "{group}",
            change_extension: ".xml",
            page_layout: "rss",
            page_only: true
        },
        {   group_name: "tag_rss",
            type: "post",
            page_layout: "rss",
            expose: "tags",
            path: "tags/{expose}/rss",
            page_only: true,
            change_extension: ".xml"
        },
        {   group_name: "sitemap",
            page_layout: "sitemap",
            path: "{group}",
            page_only: true,
            change_extension: ".xml",
            no_folder: true,
            //override_permalink_group: true
        },
	]
}))
.use(search({
    path: "resources/index.json",
    modify_content: function(file_prop){
        if (!Array.isArray(file_prop)) {
            return file_prop = file_prop.replace(/(\r|\n)+/g, " ").replace(/<[^>]*>/g, "")//.toLowerCase();
        } else {return file_prop}
    },
    filter: function(file) {
        if (include_drafts) {
            var condition = file.type !== "post" || (post.draft == true || post.draft == "true" || post.published == false || post.published == "false" || post.status == "draft")
        } else {
            var condition = file.type !== "post"
        }
        if (condition) {
            return false
        } else {
            return true
        }
    },
    fields: ["title", "contents", "tags"],
    ref: "permalink"

}))
.use(addExtension({
    layout_extension: ".ejs"
}))
.use(layouts({
    engine: 'ejs',
    directory: './layouts',
    default: 'post.ejs',
    partials: "layouts/partials",
    partialExtension: ".ejs",
    //rename: true,
    moment: moment,
    sizeOf: sizeOf,
    fs: fs,
    probe: probe,
    request: request,
    YTAPI: YTAPI,
    exposeConsolidate: {debug: true, delimiter: "%", rmWhitespace: true}
}))
// .use(sitemap({
//     hostname: "http://alansartlog.com/",
//     modifiedProperty: "mod-date",
//     omitExtension: true
// }))
// .use(htmlMinifier("*.html", {
//     //removeComments: true,
// }))
.build(function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('HTML');
        fs.ensureDirSync("./public")
        var pre_public_files = fs.readdirSync("./pre-public")
        if (typeof pre_public_files !== "undefined") {
            pre_public_files.forEach(file => {
                fs.moveSync("./pre-public/"+file, "./public/"+file)
            });
        }
        fs.removeSync("pre-public")
        console.log('Copied pre-public to public')
        rest_of_copies();
    }
});

function rest_of_copies() {
    fs.copySync("README.md", "./public/README.md")
    fs.copySync("./src_other/", "./public/")
    metalsmith(__dirname)
    .source('./resources/styles')
    .use(sass())
    .use(autoprefixer())
    .destination('./public/resources/styles')
    .build(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            // var css_file_main = fs.readFileSync("public/resources/styles/style.css").toString()
            // css_file_main = new CleanCSS().minify(css_file_main);
            // fs.writeFileSync("public/resources/styles/style.css", css_file_main, {overwrite:true})
            console.log('Styles');
        }
    });
    metalsmith(__dirname)
    .source('./resources/styles-parts/fontello')
    .destination('./public/resources/styles/fontello')
    .build(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Fontello');
        }
    });

    metalsmith(__dirname)
    .source('./resources/images')
    .destination('./public/resources/images')
    .build(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Images!');
        }
    });
    metalsmith(__dirname)
    .source('./resources/js')
    .destination('./public/resources/js')
    // .use(uglify({
    //     nameTemplate:'[name].[ext]'
    // }))
    .build(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            var javascript_file = fs.readFileSync("public/resources/js/main.js", "utf8")
            javascript_file = UglifyJS.minify(javascript_file, {compress: true, mangle: true}).code
            fs.writeFileSync("public/resources/js/main.js", javascript_file, {overwrite:true})
            console.log('JS');
        }
    });
    if (fs.existsSync("./resources/uploads")) {
        fs.ensureDirSync("./public/resources/uploads")
        var images_existing = fs.readdirSync("./public/resources/uploads")
        var images_to_copy = fs.readdirSync("./resources/uploads")
        for (i of images_to_copy) {
            if (!images_existing.includes(i)) {
                console.log("Copied "+i);
                fs.copySync('./resources/uploads/'+i, './public/resources/uploads/'+i, {overwrite: false, preserveTimestamps: true})
            }
        }
        for (i of images_existing) {
            if (!images_to_copy.includes(i)) {
                fs.removeSync('./public/resources/uploads/'+i)
                console.log("Removed "+i);
            }
        }
        console.log("Checked Images");
    } else {
        console.log("no uploads folder");
    }
    //delete extra files
    var redirected_artwork = fs.readdirSync("./public/tags/artwork")
    for (file of redirected_artwork) {
        if (file !== "index.html" && file !== "rss") {
            fs.removeSync("./public/tags/artwork/"+file)
        } else if (file == "rss") {
            fs.moveSync("./public/tags/artwork/"+file, "./public/artwork/"+file)
        }
    }
    //minify everything
    var files_html = FileHound.create()
    .paths('public')
    .ext('html')
    .findSync();
    for (file of files_html) {
        var content = fs.readFileSync(file).toString()
        content = minify(content)
        fs.writeFileSync(file, content, {overwrite:true})
    }


}
