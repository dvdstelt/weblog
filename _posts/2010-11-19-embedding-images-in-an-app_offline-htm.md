---
layout: post
id: 484324
author: Dennis van der Stelt
date: 20101119 010341
title: Embedding images in an app_offline.htm
description: We have a public website running that we needed to take offline for maintenance. So w...
categories:
    - ASP.NET
redirect_from:
  - "/dennis/2010/11/19/embedding-images-in-an-app_offline-htm"
  - "/blogs/dennis/archive/2010/11/19/embedding-images-in-an-app_offline-htm.aspx"
---

We have a public website running that we needed to take offline for maintenance. So we created an app_offline.htm file to put on the website. The result is, as we all (should) know, the website goes completely offline immediately. Every webpage and every file cannot be accessed from the web any longer.

The problem with this is that images also aren’t accessible anymore. One option is to place the images you need on another domain and link to those. I don’t like this solution to begin with, but our problem was that our website runs under SSL. You get an https:// url with that, resulting in the fact that if you try to access images from any other domain than the original site, you’ll get warnings in the browser. Something not preferred. End users might think the site isn’t secure or anything.

You have the option however, to embed images into your HTML as Base64 encoded images. This looks like this:


```xml
<img src="data:image/gif;base64,R0lGODlC9AIcAAAAAAAAAMwAAZgAAmQAAzA...">
```

Of course I kept the Base64 image very short, because they can result in insane long strings. Question however is, how do you get the Base64 encoded string? Here to the rescue, the C# code. 🙂


```csharp
class Program
{
    static void Main(string[] args)
    {
        Image image = Image.FromFile(@"C:templogo.gif");

        string result = ImageToBase64(image, ImageFormat.Gif);

        Console.WriteLine(result);
    }

    /// <summary>
    /// Images to base64.
   /// </summary>
    /// <param name="image">The image.
    /// <param name="format">The format.
    /// <returns></returns>
    private static string ImageToBase64(Image image, ImageFormat format)
    {
        using (var ms = new MemoryStream())
        {
            image.Save(ms, format);
            var imageBytes = ms.ToArray();

            var base64String = Convert.ToBase64String(imageBytes);

            return base64String;
        }
    }
}
```

Have fun!
