---
id: 476345
author: Dennis van der Stelt
title: Oslo Customizing and Extending the Visual Design Experience
description: Together with Alex Thissen, Paul Gielens, Marco Stolk and Dries Marckmann we’ve been ...
pubDate: '2008-10-29T09:54:19'
tags:
  - M Language
  - Oslo
  - PDC08
redirect_from:
  - /dennis/2008/10/29/oslo-customizing-and-extending-the-visual-design-experience
  - /blogs/dennis/archive/2008/10/29/oslo-customizing-and-extending-the-visual-design-experience.aspx
---
Together with Alex Thissen, Paul Gielens, Marco Stolk and Dries Marckmann we’ve been reflecting our thoughts on “M”. Right now we’re all at another Oslo talk about Quadrant.
**Why “Quadrant”?** * As more software becomes more model-driven, the volume of data in the system grows 
* We need a tool that lets people query, update, and visualize that data in ways that make sense for the task at hand. 
**What is “Quadrant”?** * “Quadrant” is a tool for interacting with data
    * Flexible, focused design surfaces 
    * Default experiences over arbitrary data 
    * Rich declarative customization 
* “Quadrant” is completely data-driven, every bit of data in SQL Server. 

“Quadrant” is the tool to work with. You have a canvas where you can drag everything you’re working with on that canvas. Icons that are blue can be dragged out and placed on the canvas again to get a full view on that item again. That way you can drill down in all models. Everything of course in WPF and this provides a great visual experience, or at least this is the idea I get from looking at the screen.

Terminology and features in quadrant
* <u>Canvas          
</u>You can use the canvas to view the model. The model is loaded by Quadrant and you can drag models onto the canvas. 
* <u>Repository Explorer</u>         
At the bottom-left corner you have the explorer from which you can select everything related to applications, models, workflows, activities, etc. Everything that is data and is represented as a model. 
* <u>Shapes</u>         
Shapes are the squares on the canvas and are a model or a part of a model 
* <u>Hyper icons          
</u>Hyper icons are the blue icons I talked about. They can be dragged out of the shape and become a new shape themselves. 

[![IMG_3234](/images/oslo-customizing-and-extending-the-visual-design-experience/img_5f00_3234_5f00_thumb_5f00_629b7330.jpg)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/IMG_5F00_3234_5F00_7B5AC040.jpg)  [![IMG_3235](/images/oslo-customizing-and-extending-the-visual-design-experience/img_5f00_3235_5f00_thumb_5f00_0ad5aa12.jpg)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/IMG_5F00_3235_5F00_7089F0C6.jpg)  [![IMG_3236](/images/oslo-customizing-and-extending-the-visual-design-experience/img_5f00_3236_5f00_thumb_5f00_5615023c.jpg)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/IMG_5F00_3236_5F00_77189AB0.jpg) 
**Using Quadrant Takeaways** * “Quadrant” connects people to data 
* Diverse data sets 
* Diverse interaction styles 
* Extensible
    * Create new or extend existing models 
    * Create new or extend existing editing experiences 
**[![IMG_3238](/images/oslo-customizing-and-extending-the-visual-design-experience/img_5f00_3238_5f00_thumb_5f00_360a3532.jpg)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/IMG_5F00_3238_5F00_34698F2B.jpg) ** **Customizing “Quadrant” Takeaways** * Quadrant is a model-driven application 
* Customization via data stored in repository 
* View specification based on query/functional evaluation 
**Quadrant Architecture** The shell and surface has some core services like drag/drop, undo/redo, error handling, search, etc. The composition engine is getting data from a dataflow engine, giving queryable data, having target data, configuration and view state, which is all coming from M.

[![IMG_3239](/images/oslo-customizing-and-extending-the-visual-design-experience/img_5f00_3239_5f00_thumb_5f00_1add2c58.jpg)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/IMG_5F00_3239_5F00_2D861441.jpg) 
**Where are we?** * “Quadrant” is a flexible tool for interacting with diverse data 
* “Quadrant” uses the repository for both specification and state
