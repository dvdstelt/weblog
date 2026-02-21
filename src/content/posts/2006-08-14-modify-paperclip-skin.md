---
id: 13405
author: Dennis van der Stelt
title: Modify paperclip skin
description: Because I sometimes want to paste source code into my posts, I want my skins to be a ...
pubDate: '2006-08-14T04:01:00'
tags:
  - Blogging
  - Community Server
redirect_from:
  - /dennis/2006/08/14/modify-paperclip-skin
  - /blogs/dennis/archive/2006/08/14/modify-paperclip-skin.aspx
---
Because I sometimes want to paste source code into my posts, I want my skins to be a little wide. Source code is often much wider than normal text. I really like the new Community Server 2.0 paperclip skin, but it wasn’t wide enough. So I changed it a bit. These are the steps I took:
1. First, choose the appropriate skin. I chose “Paperclip Cactus”  
2. View your weblog, right click it in Internet Explorer (or any browser) and choose “View Source” to view the html source. Now you want to find the .css file that belongs to your current skin and skin-style. For Paperclip Cactus this is in the HTML as “/Themes/Blogs/paperclip/style/style.css” and “/Themes/Blogs/paperclip/style/cactus.css”, of which the first would be [right here](/Themes/Blogs/paperclip/style/style.css) on this community. The first stylesheet if for Paperclip overall, the second one are overrides for the Cactus style specific.  
3. Now comes the hard part, as you’ll have to figure out which elements in the style-sheet must be changed according to your wishes. To make the Paperclip wider, you need the following parts:  
    1. #nav  
    2. #main  
    3. #content  
    4. #masthead
4. Now I chose to make everything a few hundred pixels wider. I believe it was 300 pixels. I also included an extra large header image I created myself. The code should be like this:  

<div>  

#nav

{

  width: 1092px;

}

#main {

  width: 834px;

}

#content

{

  width: 1092px;

}

#masthead 

{

  background-image: url(/Themes/Blogs/paperclip/images/customer-pen.jpg);

  width: 1104px;

}
</div>I probably made a mistake on the “customer” part in the name, it should’ve been “custom” 😉  
5. Now create your own header. I could nowhere find a Photoshop file or anything else, so I have torn apart the original and create my own .psd, [download it here](/files/folders/misc/entry13406.aspx).  
6. Go to your Control Panel in Community Server, select “Global Settings” and “Change how my blog looks” again. Select the tab “CSS Overrides” and insert the code above.

And you’re done… Have fun!
