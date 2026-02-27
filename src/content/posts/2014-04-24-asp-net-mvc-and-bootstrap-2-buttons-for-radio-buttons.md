---
id: 578685
author: Dennis van der Stelt
title: ASP.NET MVC and Bootstrap 2 buttons for radio buttons
description: I’ve been struggling with HTML, CSS, Bootrap 2 and jQuery for some time now. I’ve don...
pubDate: '2014-04-24T10:53:39'
image: /images/asp-net-mvc-and-bootstrap-2-buttons-for-radio-buttons/header.png
tags:
  - asp.net
  - Development
  - Bootstrap 2
  - HTML
  - jQuery
  - MVC
redirect_from:
  - /dennis/2014/04/24/asp-net-mvc-and-bootstrap-2-buttons-for-radio-buttons
  - /blogs/dennis/archive/2014/04/24/asp-net-mvc-and-bootstrap-2-buttons-for-radio-buttons.aspx
---
I’ve been struggling with HTML, CSS, Bootrap 2 and jQuery for some time now. I’ve done my fair share of HTML Tables in the past, but since DIV and CSS came up, I ditched HTML in favor of stateful applications with ClickOnce, WPF, etc. And of course quite some background processing with the occasional console application and lots of Windows Services and NServiceBus services. But now I’m back in the wonderful world of HTML and CSS. And it’s quite the learning curve.

![radiobuttons](/images/asp-net-mvc-and-bootstrap-2-buttons-for-radio-buttons/radiobuttons.png)Today I wanted to convert some checkboxes into Bootstrap buttons. So instead of the old, ugly radiobuttons you get some nicer looking buttons. With Boostrap 3 this is real easy, but with Bootstrap 2 this is a bit harder. Because in Bootstrap 2 you have to replace the radiobuttons for buttons, which in Bootstrap 3 isn’t necessary.

Here’s my MVC Razor code for the buttons


```xml
<div class="btn-group" data-toggle="buttons-radio" id="myButtonGroup">
@foreach (var item in Model.MyOptions)
{
<button type="button" class="btn btn-default @(item.DefaultValue ? " active"="" :="" "")"="" value="@item.Id" name="MyOptions">@item.Value</button>
}
@Html.HiddenFor(s => s.MyFinalChoice, new { @Value = Model.AvailableOptions.Where(s => s.DefaultValue).First().Id })
</div>
```

Now I have a ViewModel for this and a property on my model which supplies the available options, as can seen below. Notice first though that in the Razor code above, on line 6, I’m using LINQ to get the (first) default value, but if there is no default value, this code will crash.


```csharp
public class ExampleViewModel
{
	[Required(ErrorMessage = "Geef een keuze op voor MyFinalChoice.")]
	public int? MyFinalChoice { get; set; }

	public IEnumerable<selectableitem> AvailableOptions
	{
		get
		{
			return new[] {
				new SelectableItem(1, "Eerste keuze", true),
				new SelectableItem(2, "Tweede keuze"),
				new SelectableItem(3, "Derde keuze")
			};
		}
	}
}

/// <summary>
/// Selectable item for SelectList, Radiobuttons and Checkboxes
/// </summary>
public class SelectableItem
{
	public SelectableItem()
	{

	}

	public SelectableItem(int id, string value = "", bool defaultValue = false)
	{
		Id = id;
		Value = value;
		DefaultValue = defaultValue;
	}

	public int Id { get; private set; }
	public string Value { get; private set; }
	public bool DefaultValue { get; set; }
}
```

On line 4 you can see the property I want to be filled with the correct option. On line 6 you can see the property that provide me with the available options. This is what we iterate through in the Razor code. From line 22 and on you see an additional class I use to specify a type that’s easily usable in my view models. When this works, you should end up with the following rendered code.


```xml
<div class="btn-group" data-toggle="buttons-radio" id="myButtonGroup">
		<button type="button" class="btn btn-default active" value="1" name="MyOptions">Eerste keuze</button>
		<button type="button" class="btn btn-default " value="2" name="MyOptions">Tweede keuze</button>
		<button type="button" class="btn btn-default " value="3" name="MyOptions">Derde keuze</button>
		<input value="1" id="MyFinalChoice" type="hidden" value="1">
</div>
```

Some HTML on the hidden field is left out for clarity. There’s some HTML5 Bootstrap attributes in there which don’t matter now. What we see now are the three options rendered within a button group and a hidden field which already holds the value of our selected button, because we selected the (first) default value of our AvailableOptions. These three buttons should be our replacement for radio buttons.

So now we need some code for when a button is clicked, so that the hidden field will get updated. We create eventhandlers for the click event of each button.


```xml
$('#myButtonGroup .btn').click(function () {
  var values = $(this).val();
  $('#MyFinalChoice').val(values);
});
```

And that’s it. Run this jQuery code after the proper controls have been read/rendered by the browser and it should work. Now the MVC part is standard hidden field and this should work on postback. The jQuery part might be a little trickier to get working so I got an example [right here on JSFiddle](http://jsfiddle.net/N8Q56/1/).</selectableitem>
