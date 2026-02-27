---
id: 12517
author: Dennis van der Stelt
title: Copy constructors
description: "Download source in attachment\_at the bottom. A while ago I heard the term “copy const..."
pubDate: '2006-06-16T02:59:00'
tags:
  - architecture
  - Development
redirect_from:
  - /dennis/2006/06/16/copy-constructors
  - /blogs/dennis/archive/2006/06/16/copy-constructors.aspx
---
Download source in attachment at the bottom.

A while ago I heard the term “copy constructor” for the first time from a C++ developer. A copy constructor is a constructor which takes a (single) parameter of an existing object of the same type as the constructor’s class. It’s used to create an deep copy of the passed object, instead of creating a shallow copy. With a shallow copy, you’d create a reference to the values of the original object, as show in the following code: 
<span>  

<span></span>

<div>  

<span>Customer</span> cust1 = <span>new</span> <span>Customer</span>();

<span>Customer</span> cust2;

cust2 = cust1;

cust1.FirstName = <span>“Dennis”</span>;

cust1.LastName = <span>“van der Stelt”</span>;

<span>Console</span>.WriteLine(cust2.FullName);

<span>// Outputs : Dennis van der Stelt</span>
</div></span>  

As you can see, we tell cust2 to be like cust1, which is what it exactly does. This is basic behavior everyone should be aware of. Even when you pass a reference type (like our Customer class) to a method by value, you’ll still only get the reference to the object. 

But let’s have a look at our Customer class. A few details are worth mentioning. First the *default constructor*, without any parameters. I’ve included it because when we’re done, we still want to be able to create a customer object without passing anything. The second detail we’ll discuss is the *BirthDate* property. It immediately sets a private field with the current age of the customer. Probably better would be to calculate ones age when we retrieve this value, but for the sake of the demo we want it done this way. Last detail to look at is the *FirstName* property. When we request the first name, we’ll get it capitalized. 

<div>  

<span>public</span> <span>class</span> <span>Customer</span>

{

  <span>private</span> <span>string</span> _firstName;

  <span>private</span> <span>string</span> _lastName;

  <span>private</span> <span>DateTime</span> _birthDate;

  <span>private</span> <span>int</span> _age;

  <span>public</span> Customer() { }

  <span>public</span> <span>string</span> FirstName

  {

    <span>get</span>

    {

      <span>string</span> value = _firstName.Substring(0, 1).ToUpper() + _firstName.Substring(1, _firstName.Length – 1).ToLower();

      value.Trim();

      <span>return</span> value;

    }

    <span>set</span> { _firstName = <span>value</span>; }

  }

  <span>public</span> <span>string</span> LastName

  {

    <span>get</span> { <span>return</span> _lastName; }

    <span>set</span> { _lastName = <span>value</span>; }

  }

  <span>public</span> <span>DateTime</span> BirthDate

  {

    <span>get</span> { <span>return</span> _birthDate; }

    <span>set</span>

    {

      _birthDate = <span>value</span>;

      _age = (<span>DateTime</span>.Now.Year – _birthDate.Year) – (_birthDate.AddYears(<span>DateTime</span>.Now.Year – _birthDate.Year) > <span>DateTime</span>.Now ? 1 : 0);

    }

  }

  <span>public</span> <span>string</span> FullName

  {

    <span>get</span> { <span>return</span> FirstName + <span>” “</span> + LastName; }

  }

  <span>public</span> <span>int</span> Age

  {

    <span>get</span> { <span>return</span> _age; }

  }

}
</div>  

Imagine you’d want a copy of this customer. You can take care of this in some other class and copy all values. But you’ll get the first name of your customer capitalized, and that might not be what you want or need. And shouldn’t this functionality be in the Customer class itself? For this we create a copy constructor, as shown in the next example: 

<div>  

<span>///</span><span> </span><span><summary></summary></span>

<span>///</span><span> Copy constructor, creates a deep copy of passed object.</span>

<span>///</span><span> </span><span></span>

<span>///</span><span> </span><span><param name="”customer”"></span>

<span>public</span> Customer(<span>Customer</span> customer)

{

  <span>this</span>._firstName = customer._firstName;

  <span>this</span>._lastName = customer._lastName;

  <span>this</span>.BirthDate = customer.BirthDate;

}
</div>  

As you can see, the new constructor takes one parameter of the same type as its own class. When analyzing this constructor, we see a deep copy of the *firstname* and *lastname* fields, but not for the *birthdate* field. 

As said, we probably want a deep copy of the *firstname*, so we won’t get our original *firstname* capitalized. This is possible, because every class can see the private members of any (instantiated) class of the same type, which is default OO behavior. So our constructor can actually see the private fields *_firstName* and *_lastName* of the passed class.However with the birthdate, we’d want to set its value through the *BirthDate* property. That way, the age is immediately set, which would not happen had we set the private field *_birthDate*. 

So now we can start using our copy constructor to copy our original customer, like this: 

<div>  

cust2 = <span>new</span> <span>Customer</span>(cust1);

cust2.FirstName = <span>“Laura”</span>;

<span>string</span> msg = <span>string</span>.Format(<span>“{0} is married to {1}”</span>, cust1.FullName, cust2.FullName);

<span>Console</span>.WriteLine(msg);
</div>  

So now you know what a copy constructor is and how to use it. Be careful with every copy, to select the right method, using either the fields or properties. There’s no single solution, as you can see in the above example. But if you’re not sure, it’s probably better to always use deep copies and use the private fields, instead of the properties.
