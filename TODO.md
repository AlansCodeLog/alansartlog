- [x] Filter sitemap 404 and unseen pages.
- [x] Improve sitemap.
- [x] Link to rss url in header
    {{ if .RSSLink }}
    <link href="{{ .RSSLink }}" rel="alternate feed" type="application/rss+xml" title="{{ .Site.Title }}" />
    {{ end }}
    … with the autodiscovery link specified by the line with rel="alternate".

    The .RSSLink will render the appropriate RSS feed URL for the section, whether it’s everything, posts in a section, or a taxonomy.

    N.b., if you reference your RSS link, be sure to specify the mime type with type="application/rss+xml".
- [x] improve nav.
        <a href="{{ .URL }}" type="application/rss+xml" target="_blank">{{ .SomeText }}</a>
- [x] Filter rss content?
    data-src="(.*?)"(.*?)src=".*?"
    src="$1" $2
- [x] HTTPS Check
- [x] Second Check
- [ ] Third Check
- [x] Clean Images Check
- [x] Cleanup
- [x] Check tag rss feeds.
- [x] RSS icon
- [x] absolute links