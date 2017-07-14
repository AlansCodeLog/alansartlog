var taglist = "3d, 3d model, acrylics, anatomy, art supplies, art-books, artwork, colored pencil, digital, diy, fanart, for sale, graphite, ink marker, lifehacks, mixed-media, oils, outdated, patreon only content, perspective, photogrammetry, photography, portfolio, random, recording/editing tools, regard3d, reviews, sculpting, sold, studies, tools/software, tutorials, uncategorized, videos, watercolors, woodworking"
taglist =  taglist.split(", ").sort()

console.log(taglist.join(", "));
console.log(taglist.join("\r\n"))

var snippetlist = []

for (tag in taglist) {
    let index = Number(tag) + 1
    if (index.toString().length < taglist.indexOf(taglist[taglist.length]).toString().length) {
        index = 0 + index.toString()
    }
    snippetlist[tag] = "${"+index+":"+taglist[tag]+", }"
}
console.log(snippetlist.join(""));