const fs = require('fs-extra');
const request = require('sync-request');
const showdown = require('metalsmith-showdown');
const md = new showdown.expose.Converter({flavor:"github"})
module.exports = {
    clean_cache: false,
    shortcodes: [
    {
        name: "caption",
        replace: function caption (params, match) {
            var inner = md.makeHtml(params.inner)
            return "<figcaption>"+inner+"</figcaption>"
        },
    },
    {
        clean_cache: true,
        name: "gallery",
        replace: function gallery (params, match) {
            return match.replace("figure", "figure thumb=\"true\"")
        },
    },
    {
        name: "figure",
        replace: function figure (params, match, metalsmith) {
            var dir = metalsmith._metadata.site.uploads.slice(1, metalsmith._metadata.site.uploads.length)
            var files = fs.readdirSync(dir)
            
            var inner = params.inner.replace(/!\[(.*?)\]\((.*?)(.\".*?\")?\)/gm, (match, alt, src, title) => {
                var srcname = src.replace(metalsmith._metadata.site.uploads, "").replace(/(.*)\..*/g, "$1")
                var regex_srcname = new RegExp(srcname+"-[0-9]{3,}x[0-9]{3,}.")
                var srcthumb
                if (typeof params.thumb !== "undefined" && params.thumb == true) {
                    files.map(file=> {
                        if (file.match(regex_srcname) !== null) {
                            srcthumb = file.replace(srcname+"-", "").replace(/(.*)\..*/g, "$1")
                        }
                    })
                }
                files.map(file=> {
                    if (file.match(regex_srcname) !== null) {
                        srcthumb = file.replace(srcname+"-", "").replace(/(.*)\..*/g, "$1")
                    }
                })
                if (typeof srcthumb !== "undefined") {
                    var replacement = "<img is_thumb=\"true\" src=\""+src.replace(/(.*)(\..*)/g, "$1-"+srcthumb+"$2")+"\""
                } else {
                    var replacement = "<img src=\""+src+"\""
                }
                if (typeof alt !=="undefined") {
                    replacement = replacement + " alt=\""+alt+"\""
                } else {
                    replacement = replacement + " alt=\"\""
                }
                if (typeof title !=="undefined") {
                    title = title.trim()
                    replacement = replacement + " title="+ title //alt contains quotation marks already
                }
                replacement = replacement + "/>"
                return replacement
            })
            return "\r\n<figure>" + inner + "</figure>\r\n"
        },
    },
    {
        name: "gallery",
        replace: function gallery (params, match) {
            var inner = params.inner.replace(/(\n|\n\n|\r\n|\r)+/gm, "")
            return "\n\n<div class=\"gallery\">"+inner+"</div>\n\n"
        },
    },
    {
        name: "youtube",
        replace: function youtube (params, match) {
            var id = params.id || params.inner.replace(/.*?youtube.com\/(embed\/|watch\?v\=)(.*)/, "$2");
            return "\n\n<div class=\"videowrapper\"><div class=\"lazy-youtube\" data-src=\"https://www.youtube.com/embed/"+id+"?autoplay=1\" style=\"background-image:url(https://img.youtube.com/vi/"+id+"/hqdefault.jpg)\"><button aria-label=\"video play\"></button></div></div>\n\n"
        },
    },
    {
        name: "imgur",
        replace: function imgur (params,match) {
            var id = params.id || params.inner.replace(/.*?imgur.com\/gallery\/(.*?)$/, "$1");
            if (params.type == "single") {
                var data_id = id
            } else if (params.type == "gallery") {
                var data_id = "a/"+id
            } else {
                throw "Incorrect imgur embed type or embed type (single or gallery) not specified:" + match
            }
            return "\n\n<blockquote class=\"imgur-embed-pub\" lang=\"en\" data-id=\""+data_id+"\"><p><a href=\"http://imgur.com/"+id+"\">Imgur Embed</a></p></blockquote><script async src=\"//s.imgur.com/min/embed.js\" charset=\"utf-8\"></script>\n\n"
        },
    },
    {
        name: "instagram",
        replace: function instagram (params, match) {
            var id = params.id || params.inner.replace(/.*?instagram.com...(.*?)$/, "$1")
            var url = "http://api.instagram.com/oembed/?url=http://instagr.am/p/" + id
            var html = request('GET', url);
            html = JSON.parse(html.body)
            data = "\n\n"+html.html +"\n\n"
            return data
        },
    },
    {
        name: "tweet",
        replace: function tweet (params, match) {
            var url = "http://publish.twitter.com/oembed?url=" + params.inner
            var html = request('GET', url);
            html = JSON.parse(html.body)
            data = "\n\n"+html.html +"\n\n"
            return data
        },
    },
    {
        name: "iframe",
        replace: function iframe (params, match) {
            var original = match.replace(/\[/g, "<").replace(/\]/g, ">")
            return "\n\n"+original+"\n\n"
        },
    },
    {
        name: "math",
        replace: function math (params, match) {
            return "\n\n<div class=\"math\">$$"+params.inner+"$$</div>\n\n"
        },
    },
    {
        name: "gist",
        replace: function gist (params, match) {
            var src = typeof params.src !== "undefined" ? "https://gist.github.com/" + params.src + ".js": params.inner
            return"<script src=\""+src+"\"></script>"
        },
    },
    {
        find: /__(.*?)__/g,
        replace: function(match, contents) {
            return "<u>"+contents+"</u>"
        }
    }
    ]
}