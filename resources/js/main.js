$.extend($.lazyLoadXT, {
	edgeY:  200,
	srcAttr: 'data-src',
	visibleOnly: false,
});
$(document).ready(function () {
		if (typeof window.ontouchstart !== "undefined") {
			$("debug").html("touch")
			$("html").addClass('has_touch');
		}
		$(window).resize(function() {
				detect_flex_wrap(".header nav", "div")
		});
		detect_flex_wrap(".header nav", "div")
		function detect_flex_wrap(parent, child) {
			var wrapped = false;
			var baseline = undefined
			$(parent).children(child).each(function() {
				var current = $(this).position().top;
				baseline = typeof baseline == "undefined" ? current : baseline;
				if (current > baseline) {
						wrapped = true
				}
			});
			if (wrapped == true) {
				$(parent).addClass('wrapped');
			} else {
				$(parent).removeClass('wrapped');
			}
		}
		$("img").on("lazyload", function() {
				//$(".gallery").children(this).unwrap(".lazy-wrapper")
			$(this).parent(".lazy-wrapper").addClass("lazy-wrapper-loaded").removeClass("lazy-wrapper");
		})
		$(".lazy-youtube button").on("click", function() {
			var $this = $(this).parent(".lazy-youtube")
			var src = $this.attr("data-src")
			var iframe = "<iframe class=\"youtube\" frameborder='0' src=\""+src+"\" allowfullscreen></iframe>"
			$this.append(iframe)
			$this.children("iframe").unwrap()
		})
		if($(".masonry")[0]) { //masonry isn't in page unless the element is
				var $masonry = $('.masonry').masonry({
						// options...
						itemSelector: '.masonry-thumb',
						FitWidth: true,
						percentWidth: true,
						gutter: '.gutter',
						transitionDuration: '0.3s',
				});
				$('.masonry img').on("lazyload", function() {
					$masonry.masonry('layout');
				})
		}
		function gallery(div, e) {
			$("#fullscreen-gallery").show().children().css("visibility", "hidden")
			e.preventDefault()
			$("#fullscreen-gallery").find(".lazy-wrapper, .lazy-wrapper-loaded").remove()
			$("#fullscreen-gallery").find("figcaption").remove();
			var index = div.index()
			var total = div.parent(".gallery").children("figure").length - 1;
			var $lazy = div.find(".lazy-wrapper, .lazy-wrapper-loaded")
			$img = $lazy.children("img")
			var $caption = div.find("figcaption")
			if (typeof $img.attr("is_thumb") !== "undefined") {
					var src = $img.attr("src")
					// var width = $img.attr("full_width")
					// var height = $img.attr("full_height")
					src = src.replace(/(.*)-([0-9]+)x([0-9]+)(\..*)/, function(match, groupurl, groupwidth, groupheight, groupext) {
							src = groupurl+groupext
							return src
					})
					$img.attr("data-src", src).attr("src", src).removeClass("lazy-loaded").removeClass("lazy-hidden").addClass("lazy").lazyLoadXT({show:true});
					$img.removeAttr("is_thumb")
			}
			$caption = $caption.clone()
			$caption.appendTo("#fullscreen-gallery .container")
			$lazy = $lazy.clone()
			$lazy.appendTo("#fullscreen-gallery figure")
			var caption_height = typeof $caption.height() !== "undefined"? $caption.height() : 0
			//var margin = typeof caption_height !== "undeifned" && caption_height !== 0 ? $("#fullscreen-gallery img").css("padding").slice(0, -2) : 0
			//var subtract = parseInt(caption_height)
			$("#fullscreen-gallery").find("figure").css("max-height", "calc(100vh - "+caption_height+"px)")
			$lazy.removeClass("lazy-wrapper-loaded").addClass("lazy-wrapper").children("img").lazyLoadXT({show:true});
			$("#fullscreen-gallery").find(".left, .right").show()
			if (index == total) {
				$("#fullscreen-gallery .right").hide()
			}
			if (index == 0) {
				$("#fullscreen-gallery .left").hide()
			}
			if (total < 0) {
				$("#fullscreen-gallery .left, #fullscreen-gallery .right").hide()
			}
			$("#fullscreen-gallery").children().css("visibility", "visible");
			$("#fullscreen-gallery").not(".left, .right").click(function(e){
				if(!($(e.target).hasClass('right') || $(e.target).hasClass('left'))) {
					$(this).fadeOut();
			}
			if ($(e.target).hasClass('right')) {
				var $next = div.parent(".gallery").children("figure").eq(index + 1)
				gallery($next, e)
			} else if ($(e.target).hasClass('left')) {
				var $prev = div.parent(".gallery").children("figure").eq(index - 1)
				gallery($prev, e)
			}
			})
		}
		if ($(".gallery")[0]){
			$(".gallery figure").click(function(e){
				gallery($(this), e)
			})
		}
		$(".single .thumb").click(function(e){
			gallery($(this), e)
		})
		$("pre").each(function() {
			hljs.highlightBlock(this);
		});
		if ($("form")[0]){
			$('.form-dropdown').on('change', function(){
                if($(this).val().toLowerCase() == "other"){
                    $(".dropdown-extra").show().addAtrr("required").required = true;
                }
                else{
                    $(".dropdown-extra").hide().removeAttr("required")
                }
            });
            $('#file').bind('change', function() {
                var original = $(".limit").html()
                var file = this.files[0]
                if ((this.files[0].size/1024/1024).toFixed(2) >= 10) {
                        $(".info").html("");
                        $(".limit").html("Your file is " + (this.files[0].size/1024/1024).toFixed(2) + "MB. It must be less than 10MB.");
                        $(this).val("")
                        return
                } else if (original !== "Upload Limit: 10MB") {
                    $(".limit").html("Upload Limit: 10MB")
                }
                var size = (this.files[0].size/1024/1024).toFixed(2)
                if (size == 0) {
                    size = (this.files[0].size/1024/1024).toFixed(3)
                }
                $(".info").html("Attached: "+this.files[0].name + " ("+ size + "MB) <span class=\"contact-cancel\">Cancel</span>");
                $(".info").on('click', '.contact-cancel', function() {
                    $('#file').val("")
                    $(".info").html("");
					$('.icon-upload-cloud').removeClass("animate-pulse")
                });
            });
            $("form").on("submit", function(){
                if ($('#file').val() !== "" && document.getElementById("form").checkValidity()) {
                    $('.icon-upload-cloud').addClass("animate-pulse")
					$(".file-placeholder").html("Uploading...");
                }
            })
		}
	$(".search-trigger").click(function(){
		$(this).parents(".search-box").toggleClass("search-hide")
		$('.search-results').hide();
		detect_flex_wrap(".header nav", "div")
		$('input#search').focus();
	})
	var index = undefined;
	var searching = false;
	var retries = 0;
	var request = undefined
	$.getJSON('/resources/index.json', function (response) {
		searching = false;
		index = elasticlunr.Index.load(response)
	}).fail(function(jqXHR) {
		request = "fail";
	});
	$('input#search').on('input', function (){
		if (typeof request !== "undefined" && request == "fail") {
			$(".search-trigger").removeClass("animate-spin");
			$('input#search').off()
			var resultdiv = $('.search-results');
			resultdiv.append("<div class=\"no-results\">There was a problem loading the search engine. If this keeps happening,  please contact me.</div>").show();
			return
		}
		if (!searching) {
			searching = true
			var $this = $(this)
			$(".search-trigger").addClass("animate-spin");
			setTimeout(search($this), 1000);
			function search ($this){
				var checkIndex = setInterval(function(){
					retries++
					if(typeof index !== "undefined") {
						clearInterval(checkIndex);
						actual_search($this)
					} else {
						searching = false;
					}
					console.log(retries);
					if (retries == 20) {
						var resultdiv = $('.search-results');
						resultdiv.append("<div class=\"no-results\">Your connection seems slow. Search might take a while to load.</div>").show();
					} 
				}, 1000);
			}
		}
		function actual_search($this) {
			var query = $this.val().toLowerCase();
			var result = index.search(query, {
				fields: {
					title: {boost: 3},
					tags: {boost: 2},
					contents: {boost: 1}
				},
				bool: "AND",
				expand: true
			});
			var resultdiv = $('.search-results');
			resultdiv.empty().hide();
			if (query.length == 0) {
				$(".search-trigger").removeClass("animate-spin");
			} else if (result.length === 0) {
				resultdiv.append("<div class=\"no-results\">0 matches found.</div>").show();
				$(".search-trigger").removeClass("animate-spin");
			} else {
				for (item in result) {
					var item_result = result[item]
					var post = index.documentStore.getDoc(item_result.ref);
					var matchtitle = ""
					var propertieslist = ""
					for (property in post) {
						var matchlist = ""
						var highlighted_total = 0;
						if (property == "permalink"){continue}
						var prop = post[property]
						if (property == "tags") {
							var query_start = 1
						} else {
							var query_start = prop.toLowerCase().indexOf(query.toLowerCase())
						}
						if (query_start !== -1) {
							if (property == "tags") {
								var newlist = prop.slice()
								var entry = ""
								for (tag in newlist) {
									if (newlist[tag].toLowerCase().indexOf(query.toLowerCase()) !== -1) {
										var tag_index = newlist[tag].toLowerCase().indexOf(query.toLowerCase())
										newlist[tag] = newlist[tag].slice(0, tag_index )+"<span class=\"search-match-highlight\">"+newlist[tag].slice(tag_index ,tag_index  +query.length)+"</span>"+newlist[tag].slice(tag_index +query.length, newlist[tag].length)
									}
									newlist[tag] = "<a href=\""+"/tag/"+newlist[tag].replace(/(-|\/)/g, "").replace(/(\'|\"|\(|\)|\[|\]|\?|\+)/g, "").replace(/(\s)+/g, "-").toLowerCase()+"\"><div class=\"tags\">"+newlist[tag]+"</div></a>"
								}
								if (newlist.indexOf("match-highlight") !== -1) {
									entry = entry + newlist.join("")
								}
							} else {
								var start = query_start - 20 >= 0 && property !== "title" && property !== "tags" ? query_start - 20 : 0
								var end = query_start + query.length + 300 <= prop.length && property !== "title" && property !== "tags" ? query_start + query.length + 300 : prop.length
								var entry = prop.slice(start, query_start)+"<span class=\"search-match-highlight\">"+prop.slice(query_start,query_start+query.length)+"</span>"
								var position = []
								var last_query = query_start
								while(last_query <= end) {
									highlighted_total++
									var last_end = last_query + query.length
									var exists = prop.toLowerCase().slice(last_query + query.length, end).indexOf(query.toLowerCase())
									last_query = last_end + exists
									if (exists == -1){
										entry = entry + prop.slice(last_end, end)
										break
									}
									entry = entry + prop.slice(last_end, last_query) + "<span class=\"search-match-highlight\">"+prop.slice(last_query, last_query + query.length)+"</span>"
								}
							}
							if (property !== "title" && property !== "tags") {
								var first_space = entry.indexOf("<") !== 0 ? entry.indexOf(" ") + 1 : 0
								var last_space = entry.lastIndexOf(">") !== entry.length &&  entry.lastIndexOf(" ") > entry.lastIndexOf(">") ? entry.lastIndexOf(" ") : entry.length
								entry = entry.slice(first_space, last_space)
								if (start !== 0) {
									entry = "..." + entry
								}
								if (start + entry.length < end || start + entry.length < prop.length) { 
									entry = entry + "..."
								}
								total_matches = prop.split(query).length - 1
								if (total_matches > highlighted_total) {
									entry = entry+" + <span class=\"more-matches\">"+(total_matches - highlighted_total)+" more matches.</span>"
								}
								var entry = "<div class=\""+property+"\">" +entry + "</div>"
								matchlist = matchlist + entry
							} else if (property == "tags") {
								if (entry !== "") {
									var entry = "<div class=\"taxnms\">" +entry + "</div>"
								}
								matchlist = matchlist + entry
							} else	{
								matchtitle = "<div class=\"search-match-title\"><a href=\""+post.permalink+"\">"+entry+"</a></div>"
							}
						}
						if (matchlist !== "") {
							propertieslist = propertieslist + matchlist
						}
					}
					if (matchtitle == "") {
						matchtitle = "<div class=\"search-match-title\"><a href=\""+post.permalink+"\">"+post.title+"</a></div>"
					}
					if (propertieslist !== "") {
						var postli = "<div class=\"search-match\">"+matchtitle+"<div class=\"search-match-contents\">"+propertieslist+"</div></div>"
						resultdiv.append(postli)
					}
				}
				resultdiv.show();
				$(".search-trigger").removeClass("animate-spin");
			}
			searching = false;
		}
	})
});
