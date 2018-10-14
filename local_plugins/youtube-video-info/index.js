module.exports = plugin;
const request = require('sync-request');
const fs = require('fs-extra');

function plugin(id, YTAPI, opts) {
	opts = opts || {clean_cache: false}
	//SETUP CACHE
	if (typeof opts.clean_cache !== "undefined" && opts.clean_cache == true) {
		fs.removeSync('cache.youtube_video_info.json')
	}
	fs.ensureFileSync('cache.youtube_video_info.json')
	var cache = fs.readJsonSync('cache.youtube_video_info.json', { throws: false })
	if (cache == null) {
		cache = { youtube_video_info: {} }
	}
	function check_cache(id) {
		if (typeof cache.youtube_video_info !== "undefined" && typeof cache.youtube_video_info[id] !== "undefined") {
			if (cache.youtube_video_info[id] == "error") {
				console.log("youtube_video_info cached error on image: " + id)
			}
			return true
		} else {
			return false
		}
	}

	if (check_cache(id)) {
		console.log("Got Video from Cache", id)
		return cache.youtube_video_info[id]
	} else {
		console.log("Getting Video", id)
		var html = request('GET', 'https://www.googleapis.com/youtube/v3/videos', {
			qs: {
				'id': id,
				'part': 'snippet',
				'key': YTAPI
			}
		});
		html = JSON.parse(html.body.toString())
		if (typeof html.items == "undefined" || typeof html.items[0] == "undefined") {
			console.log("No Video: " + id, html)
			return {}
		}
		let vid = {}
		vid.title = html.items[0].snippet.title
		vid.description = html.items[0].snippet.description
		if (vid.description.length > 2000) { //because spaces
			vid.description = vid.description.slice(0, 2030).replace(/(\r|\r\n|\n)+/gm, " ") + "..."
		} else {
			vid.description = vid.description.replace(/(\r|\r\n|\n)+/gm, " ")
		}
		if (vid.description.length > 2036) {//2048 limit - cdata stuff
			throw vid.description.length + "video description too long with added paragraphs: " + vid.title + " " + video
		}
		vid.published = html.items[0].snippet.publishedAt
		vid.thumbnail_url = html.items[0].snippet.thumbnails.default.url
		vid.tags = html.items[0].snippet.tags
		cache.youtube_video_info[id] = vid
		fs.writeJsonSync('cache.youtube_video_info.json', cache)
		return vid
		//console.log(typeof vid.title, typeof vid.description, typeof vid.published, typeof vid.thumbnail_url, typeof vid.tags)
		//console.log(vid.title, vid.description, vid.published, vid.thumbnail_url, vid.tags)
	}
}
    