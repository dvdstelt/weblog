---
id: 578123
author: Dennis van der Stelt
title: Bing Maps on WPF and custom PushPin tutorial for PixelSense
description: I’ve just came back from a trip to Washington DC, where I’ve been at the 50th IAM Int...
pubDate: '2012-10-17T09:17:14'
image: /images/bing-maps-on-wpf-and-custom-pushpin-tutorial-for-pixelsense/header.png
tags:
  - Development
  - PixelSense
  - Silverlight
  - WPF
redirect_from:
  - /dennis/2012/10/17/bing-maps-on-wpf-and-custom-pushpin-tutorial-for-pixelsense
  - /blogs/dennis/archive/2012/10/17/bing-maps-on-wpf-and-custom-pushpin-tutorial-for-pixelsense.aspx
---
I’ve just came back from a trip to [Washington DC](https://www.google.nl/search?q=washington+dc), where I’ve been at the [50th IAM International Moving Annual Meeting](https://ww2.eventrebels.com/er/EventHomePage/CustomPage.jsp?ActivityID=7865&ItemID=29800). This was for my employer TellUs, who’s into lead generation for international removal companies. A lot of people asked for the reason why I went to the states, this is it. And of course because we bought a Microsoft [PixelSense](http://www.microsoft.com/en-us/pixelsense/default.aspx) table which we used to visualize our data on.

The table had to ship however a little before we could finish the applications. After installing them at the convention, everything worked flawlessly. Well, until our sales representatives started working with it. We build a map with thousands of clustered pushpins on it. But there was a problem.
* The push pins did not rotate when sales reps rotated the map!!!  
For some reason we did not test rotation of the map on our desktop monitors. Go figure! 😉

This blogpost is how I solved this issue.
**Creating the map and adding pushpins  
**At the convention, we loaded data and placed push pins on the map. For this tutorial we’ll add them via the double-click event of your mouse. Rotation of the map will occur via clicking on the push pins. The push pins will rotate themselves according to rotation of the map. This tutorial was writing in Visual Studio 2010, because Visual Studio 2012 doesn’t support development for PixelSense (yet). If you are completely unfamiliar with adding push pins to a WPF Bing map, check out [this tutorial on MSDN](http://msdn.microsoft.com/en-us/library/hh709044.aspx).

First, create a new project by pressing CTRL+SHIFT+N and select “WPF Application” under the “Windows” category. You should end up with an almost empty XAML file with a grid in it. Let’s first add the map to it. First add a reference to the Bing assembly that has all the controls. It should be located in one of the following folders
* C:\Program Files\Bing Maps WPF ControlV1\Libraries\Microsoft.Maps.MapControl.WPF.dll
* C:\Program Files (x86)\Bing Maps WPF ControlV1\Libraries\Microsoft.Maps.MapControl.WPF.dll

After having added the reference, add the namespace to the MainWindow.xaml and add the map. You should end up with the following code.


```xml
<window x:class="WpfApplication2.MainWindow" xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" xmlns:m="clr-namespace:Microsoft.Maps.MapControl.WPF;assembly=Microsoft.Maps.MapControl.WPF" title="MainWindow" height="350" width="525">
    <grid>
        <m:map x:name="myMap" credentialsprovider="PutYourOwnKeyHere-ItShouldBeVeryLong"></m:map>
    </grid>
</window>
```

The CredentialsProvider should have a key that you’ve requested on [this page](http://www.bingmapsportal.com/) or follow the short tutorial on [this page](http://msdn.microsoft.com/en-us/library/hh709042.aspx). After adding the key you can already run the application and be able to zoom and pan the map.
**Adding PushPins from code** As you can see in the above code, I’ve already given my map a name via x:Name attribute. This way I can access my map from code-behind. This way I can set up my code for the double-click event on the map so I can add a PushPin on every double-click by the user. We’ll quickly run through the code, which shouldn’t be very complex.


```csharp
public partial class MainWindow : Window
{
    int counter = 0;

    public MainWindow()
    {
        InitializeComponent();

        myMap.MouseDoubleClick += new MouseButtonEventHandler(myMap_MouseDoubleClick);
    }

    private void myMap_MouseDoubleClick(object sender, MouseButtonEventArgs e)
    {
        e.Handled = true;

        Point mousePosition = e.GetPosition(this);
        Location pinLocation = myMap.ViewportPointToLocation(mousePosition);

        Pushpin pin = new Pushpin();
        pin.Location = pinLocation;
        pin.Content = counter += 10;
        pin.MouseDown += new MouseButtonEventHandler(pin_MouseDown);

        myMap.Children.Add(pin);
    }

    private void pin_MouseDown(object sender, MouseButtonEventArgs e)
    {
    }
}
```

On line 3 you see a counter variable, which we’ll use to add unique push pins to our map. In the constructor MainWindow() you can see that we set up the handler for the double-click event. This is standard .NET code. In the myMap_MouseDoubleClick event handler, we first set e.Handled to true. Otherwise the map control will try to handle the click itself as well, making it zoom-in every time we add a push pin. In the next two lines we try to retrieve the exact location where we clicked. This can all be viewed in the MSDN documentation and is standard behavior. Then we instantiate a new Pushpin object, give it the location we just ‘calculated’ and add the value of the counter variable to it as content. As you can see we’ve also already set up the event handler for when we press the pushpin itself. At line 24 we add the Pushpin to the map so that it will be shown. You can now run this application and start double clicking on the map yourself. &lt;p align=”center”&gt;&lt;img style=”padding-left: 0px; padding-right: 0px; padding-top: 0px; border-width: 0px;” title=”map1″ alt=”map1″ src=”/wp-content/uploads/sites/2/2014/01/5001_map1_5f00_thumb_5f00_5b082fd2.png” width=”400″ height=”267″ border=”0″ /&gt;&lt;/p&gt; &lt;strong&gt;Rotating the map &amp;amp; Pushpins &lt;/strong&gt;We will now rotate the map as a reaction of the Pushpin that is being clicked by the user. Edit the event handler for the Pushpin click as follows


```csharp
private void pin_MouseDown(object sender, MouseButtonEventArgs e)
{
    e.Handled = true;

    var pushPinContent = 0;
    var pushPin = sender as Pushpin;
    if (pushPin != null &amp;amp;amp;amp;amp;amp;amp;amp;&amp;amp;amp;amp;amp;amp;amp;amp; pushPin.GetType() == typeof(Pushpin))
        pushPinContent = Convert.ToInt32(pushPin.Content);

    myMap.Heading = (double)pushPinContent;
}
```

As you can see we set the event as being handled again at line 3.The sender of the event should be a Pushpin, so we verify this first and then try to obtain the value of the content of the pin itself. After that, we set the heading of the map, which is the rotation. If you now run the application and start clicking the Pushpins (after adding a few), the map should rotate, but the Pushpins should not.

We can easily fix this by binding the heading property of the Pushpin itself, to the heading of the map control. This can be done by the following code, which should be placed directly before we add the Pushpin to the map control.


```csharp
Binding binding = new Binding();
binding.Source = myMap;
binding.Path = new PropertyPath("Heading");
binding.Mode = BindingMode.OneWay;
pin.SetBinding(Pushpin.HeadingProperty, binding);

myMap.Children.Add(pin);
```
**Customizing the Pushpin** We will now start customizing the Pushpin to make it show completely different from the default Pushpins. For this we need to create a ControlTemplate in the xaml file. First add a section for static resources in the root object, the Window. Then add the template for the Pushpin. In your existing xaml file, just place the following code directly <span style="text-decoration: underline;">before</span> the <grid> element.


```xml
<window.resources>
    <controltemplate x:key="CutomPushpinTemplate" targettype="m:Pushpin">
        <grid x:name="ContentGrid" horizontalalignment="Center" verticalalignment="Center">
            <stackpanel>
                <grid margin="0" width="33" height="33">
                    <rectangle horizontalalignment="Left" margin="-0.208,13.238,0,-0.146" width="10.555" fill="#FF005167" rendertransformorigin="0.5,0.5">
                        <rectangle.rendertransform>
                            <transformgroup>
                                <scaletransform></scaletransform>
                                <skewtransform anglex="-23"></skewtransform>
                                <rotatetransform angle="-12.944"></rotatetransform>
                                <translatetransform></translatetransform>
                            </transformgroup>
                        </rectangle.rendertransform>
                    </rectangle>

                    <rectangle fill="White" stroke="#FF005167" radiusx="5" radiusy="5"></rectangle>

                    <contentpresenter horizontalalignment="Center" verticalalignment="Center" content="{TemplateBinding Content}" contenttemplate="{TemplateBinding ContentTemplate}" margin="0" textblock.fontfamily="Segoe UI" textblock.fontweight="Bold" textblock.foreground="#FFB8D30B">
                    </contentpresenter>
                </grid>
            </stackpanel>
        </grid>
    </controltemplate>
</window.resources>
```

You can see we added a ControlTemplate which has a TargetType for our Pushpin objects. This we will bind to our Pushpins later. I’ve made the Pushpins look a bit like our TellUs logo and for this I needed a rectangle with rounded corners. Directly behind it I placed another rectangle that I skewed and rotated a bit to make it look a bit like a balloon. Then I added a ContentPresenter that should show the numerical value and I’ve also added some font settings to it. Nothing spectacular, but it’s nice if you know how to do it! 😉

Now we move back to our code again and we need to do three things.
1. Locate the control template for our Pushpin
2. Bind it to our Pushpin
3. Set the PositionOrigin of our PushPin.

This setting of the PositionOrigin is important to us, because our customized Pushpin should be placed to the top and to the right of where we click. I’ve included some code that we already had for additional clarity of where to put the code.


```csharp
ControlTemplate template = (ControlTemplate)this.FindResource("CutomPushpinTemplate");
Pushpin pin = new Pushpin(); 
pin.Template = template; 
pin.PositionOrigin = PositionOrigin.BottomLeft; 
pin.Location = pinLocation; 
pin.Content = counter += 10; 
pin.MouseDown += new MouseButtonEventHandler(pin_MouseDown);
```

If we run our application again it should look like this after adding a few Pushpins and rotating them.

<figure class="is-layout-flex wp-block-gallery-1 wp-block-gallery columns-2 is-cropped">
* <figure>![](/images/bing-maps-on-wpf-and-custom-pushpin-tutorial-for-pixelsense/8865_map2_5f00_thumb_5f00_0061fd74.png)</figure>
* <figure>![](/images/bing-maps-on-wpf-and-custom-pushpin-tutorial-for-pixelsense/0777_map3_5f00_thumb_5f00_7f7971bc.png)</figure>

</figure>
**Adding custom styling based on content of the Pushpin** Now one really interesting thing to do is setting the size of the content/text of the Pushpin based on the number. If we start adding a lot of Pushpins this way and we start adding pins that have a numerical value of higher than 999, the font is too big so the value will fall outside of the boundaries of the pin.

For this we need a ValueConverter first. Based on the value that is inside the content of the Pushpin, we’ll return the FontSize. This FontSize then needs to be set to the style of the ContentPresenter. First let’s have a look at the ValueConverter. Add this directly beneath your MainWindow class, so that (in this tutorial) we don’t have the additional hassle of namespace problems.


```csharp
public class PushPinContentConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        int pushPinContentValue;
        if (int.TryParse(value.ToString(), out pushPinContentValue))
        {
            if (pushPinContentValue &amp;amp;amp;amp;amp;amp;amp;gt;= 1000)
                return 12;
            else
                return 15;
        }

        // If convert fails!
        return 14;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
```

As you can see we try to extract the content from the Pushpin and if the value is higher than (or equally to) a 1000, we’ll lower the FontSize. Now we need to add this converter to the static resources of the Window in the xaml. First add a namespace reference (as seen in line 5) and then add it as a resource itself (as seen in line 9).


```xml
<window x:class="WpfApplication1.MainWindow" xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" xmlns:m="clr-namespace:Microsoft.Maps.MapControl.WPF;assembly=Microsoft.Maps.MapControl.WPF" xmlns:local="clr-namespace:WpfApplication1" title="MainWindow" width="700" height="500">
    <window.resources>

    <local:pushpincontentconverter x:key="MyContentConverter"></local:pushpincontentconverter>
```

Finally we need to add the styling to the ContentPresenter. The only thing changed is the element <contentpresenter.style> and the elements within it.


```xml
<contentpresenter horizontalalignment="Center" verticalalignment="Center" content="{TemplateBinding Content}" contenttemplate="{TemplateBinding ContentTemplate}" margin="0" textblock.fontfamily="Segoe UI" textblock.fontweight="Bold" textblock.foreground="#FFB8D30B">
    <contentpresenter.style>
        <style>
            <Setter Property="TextBlock.FontSize" Value="{Binding Path=Content, RelativeSource={RelativeSource TemplatedParent}, Converter={StaticResource MyContentConverter}}" />
        </style>
    </contentpresenter.style>
</contentpresenter>
```

I advise you to no start the counter variable at 0, but at 970, for your own testing pleasure. It’d be a whole lot of clicks if you started at 0 to see the results at Pushpin 1000 and higher.
**Conclusion** All in all it is not so difficult to add a custom Pushpin, rotate it according to the map rotation and have the content sized based on its value. But information is fragmented and (for example) setting a ControlTemplate is mostly only shown in code if you start searching for it. I hope it’s beneficial for you to see it all in one place.

[Download the entire solution here](/files/WPFBingAndCustomizedPushpins.zip).

If this was usable, leave a comment and tell me your problems and/or results. Thanks!</contentpresenter.style></window.resources></window></grid>
