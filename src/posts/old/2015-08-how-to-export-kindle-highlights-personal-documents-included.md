---
title: How to Export Kindle Highlights (Personal Documents Included)
date: 2015-08-19T00:00:00Z
type: post
tags: ["outdated","random","tools/software"]
---
#### EDIT: Amazon has finally added the ability to export notes and highlights by email. This post is outdated.

<!--more-->

I love highlighting in books, makes finding favorite passages easier. But I also do a lot of research so I need that feature. Unfortunately there aren’t that many devices/apps capable of syncing and exporting highlights. I don’t know why not. One would think this would be a really obvious feature in any app that allows hghlighting. Apparently not. For example, the only way I can really get highlights from a PDF is by going through Goodreader. Acrobat can’t do this!

And for ebooks, the Kindle can’t do this either! I don’t know why. It’s ridiculous. That, not being able to access personal docs on the Windows Kindle app, and the fact that you can’t scroll in the Kindle app have always made me want to ditch it, but no other app can sync with my Kindle… sigh. I’ve considered getting a different ereader brand next time (the Keyboard is seriously outdated at this point) but none have good sync options.

Technically with Amazon you can sort of export highlights if you bought the books from them (it’s easy to access them in a way that lets you copy), but not your personal documents. If you try to search for how to do this most of the guides are about this method which is useless for personal documents. There is a way to export your personal document highlights from your kindle itself and I’ll go over it quickly, but I don’t know if it works with newer kindles. The new method I found is as far as I know almost undocumented and will work from any iOS device, possibly even Android.

# From Your Kindle

There is of course the Clippings.txt but this file is ONLY updated if you make a highlight from your kindle, which makes it useless if you read anywhere else as well. It’s also a mess going through it.

The better method is getting them from the .MBP files in your Kindle. Highlights are stored inside these alongside your books with each file corresponding to a book. You can copy them over to your computer and then use this little program, MBP Reader, (place it in the same folder as your highlights) to extract them. Just double-click and it’ll create a bunch of txt files containing the highlights for each book.

Now according to the people that created the [MBP reader](http://www.angelfire.com/ego2/idleloop/mbp_reader.html), Amazon changed the file type in response to this. Why???!!! and no before you ask you can’t copy an entire book like this, there’s a clipping limit still in place. But on my Kindle Keyboard this still works. Maybe they only did this on the newer ones? I don’t know. But this is one way to get your highlights. And for the most part I’d do it this way if you can because it’s slightly easier and the clipping limit, although still there, is larger. You’ll know if you hit it because the text file will just have a number and no highlights.

# From Your iPad/iPhone (possibly Android as well)

NOTE: This has a clipping limit. In fact the clipping is smaller than what’s even shown on the notes summary screen of the iPad. It seems like it’s 50 words like the copyright limit (that’s about 3 lines in the iPad notes summary screen). Getting your clippings from the .MBP files allows for quite a bit more, hence why I prefer it.

There are times when using the first method is impossible though.

For example, I recently wanted to read a very large book (it had lots of images) on my iPad. It was a .mobi and making it into a PDF ruined the formatting. You can’t email a book over 25mb to your Kindle address because of Gmail’s file limit. I’ve tried different email services that claimed to be able to send big files (if anybody knows one that works, leave a link), but eventually I gave up and manually transferred the book through iTunes onto the Kindle app. The thing is this won’t sync the highlights so even if I put the book in my Kindle Keyboard the .MBP file won’t be generated. I thought well, come to worse, I would just use the fool proof third method described below, but I really didn’t want to by the time I’d read the book because I’d highlighted a lot of stuff.

I searched around and apparently according to this [Stack Exchange question](http://apple.stackexchange.com/questions/114800/exporting-highlights-from-kindle-personal-documents-to-a-txt-file) the Kindle App used to keep an SQlite file called AnnotationStorage. This is literally the only place I’ve ever seen a proper answer to this problem and it’s not even the first answer. Also the average user probably has no idea what an SQL Database even is and nobody else seems to have bothered to detail the process. So I thought I’d do it.

## Instructions

### Step 1

Okay first we’ll need to get the files. You’ll need some way to access your iPad/iPhone device’s internal files. This is a piece of cake if you’re jailbroken (iFile). If you’re not there’s supposedly desktop applications that do allow you to see App folder but I haven’t tried them (the Stack Exchange answer mentions iFunBox Classic).

### Step 2

Depending on your iOS version the Applications folder will be in different places. Now I imagine this file probably also exists on Android, but I don’t have an android device to try. If anybody knows, leave a comment.

*   Pre iOS8 in __/private/var/mobile/Applications__ and it’s easy to find the Kindle folder.

*   Post iOS8 it’s a nightmare. You’ll have to go to __/private/var/mobile/Containers/Data/Application__ and then you’ll see a bunch of folders with different numbers. I believe this number changes occasionally. You could still attempt to bookmark it though, but it’s likely you’re going to have to do this every single time. It might be easier to just know the approximate size of the folder.

*   You’re going to have to go one by one and open then go into the folders to determine which is the Kindle app.If you’ve manually transferred a book it’s easier to check the __APPNUMBER/Documents/__ of each app as you’ll immediately see the .MOBI for your book there. Otherwise check all __APPNUMBER/Library__ folders, the Kindle one should contain folders named ACX, AmazonADs, etc. and the AnnotationStorage will be there.

### Step 3

Now if you’re not there already navigate to /Library in the Kindle folder. Here like I said you’ll find the AnnotationStorage file (ignore the other AnnotationStorage -smh and -wal files). With iFile you can just select it, zip it, and email it to yourself to get it on your computer. Or you can use an app or SSH, but get it onto your computer somehow.

### Step 4

Now you’ll need an SQLite reader. There are many (the Stack Exchange answer mentioned [DBBrowser](http://sqlitebrowser.org/)) I used a firefox Add-on called [SQLite Manager](https://addons.mozilla.org/en-US/firefox/addon/sqlite-manager/) because I already had it and the search function is better. DB Browser doesn’t seem to be able to search for fragments of a cell.

### Step 5

Rename the file to __AnnotationStorage.sqlite.__

### Step 6

Open it with whatever program you want. You’re going to want to go to __Tables > ZANNOTATION__ and switch the view so you can see the table. In SQLite Manager that’s just the Browse & Search tab. It’s going to look kind of like an Excel sheet. The important columns are __ZRAWBOOKID__. If you sort by this, you’ll sort by book. If you can’t find your book you can search __ZUSERTEXT__ for a phrase in a highlight then get the book ID from that highlight and search by the book ID. Another important column is __ZRAWANNOTATIONTYPE__ if you just want to get your notes or something.

### Step 7

To export the data you need to highlight the rows you want then __Right Click > Copy as CVS (MSExcel Compatible)__. Or you can run an SQL Query to get just the columns you want then copy from that. In SQLite Manager just go to Execute SQL, paste your preferred query and hit Run SQL. Make sure there’s at least a space between each line or format it as shown. Either should work.

Here’s a basic query that will get everything and order it by book then the location.

Select * From ZANNOTATION Group By ZRAWSTART Order By ZRAWBOOKID ASC
