---
layout: post
id: 457979
author: Dennis van der Stelt
date: 20080229 024244
title: Getting data from Excel the fast way, using LINQ
description: David, Alex and me just needed to get a load of data from some Excel sheets and work ...
categories:
    - .NET Framework 3.5
    - LINQ
    - Visual Studio 2008
redirect_from:
  - "/dennis/2008/02/29/getting-data-from-excel-the-fast-way-using-linq"
  - "/blogs/dennis/archive/2008/02/29/getting-data-from-excel-the-fast-way-using-linq.aspx"
---

[David](http://dmf-software.co.uk/), [Alex](http://www.alexthissen.nl/) and me just needed to get a load of data from some Excel sheets and work with the data. What’s better than to load the data into a DataSet using OleDB and process it using LINQ to DataSets?

Make sure you know what the format of your columns is and that the first row in your sheet holds the name of the column. Then below would be what you need for code.


```csharp
string filename = @”C:myfile.xls”;

string connectionString = "Provider=Microsoft.Jet.OLEDB.4.0;” +
                "Data Source=” + filename + ";” +
                "Extended Properties=Excel 8.0;”;

OleDbDataAdapter dataAdapter = new OleDbDataAdapter("SELECT * FROM [Sheet1$]”, strConn);
DataSet myDataSet = new DataSet();

dataAdapter.Fill(myDataSet, "ExcelInfo”);

DataTable dataTable = myDataSet.Tables["ExcelInfo”];

var query = from r in dataTable.AsEnumerable()
            select new
            {
                RelationNr = r.Field<double>("RelationNumber”),
                ClientName = r.Field<string>("ClientName”),
            };

foreach (var item in query)
{
    Console.WriteLine(item.ClientName);              
}
</string></double>
```
