---
layout: post
id: 481304
author: Dennis van der Stelt
date: 20090310 123144
title: Attach to debugger script and shortcut
description: I got sick of manually attaching to the webserver (either aspnet_wp.exe on WinXP or w...
categories:
    - Development
    - Visual Studio 2005
    - Visual Studio 2008
    - Visual Studio 2010
redirect_from:
  - "/dennis/2009/03/10/attach-to-debugger-script-and-shortcut"
  - "/blogs/dennis/archive/2009/03/10/attach-to-debugger-script-and-shortcut.aspx"
---

I got sick of manually attaching to the webserver (either aspnet_wp.exe on WinXP or w3wp.exe on Win2003 or later). You can have a macro for that, incl. a shortcut key. I got this from somewhere on the web, but forgot where. If I find out, I’ll of course post it here. But I constantly have to search my sent items in Outlook for this bit of script when I tell someone about this. So here it’s on my weblog.
* Press ALT-F11 (Macro IDE)       
A new Windows pops up 
* In the Project Explorer on the left, choose "Add new Item" 
* Choose a Module and name it "AttachToWebServer" 
* Paste the code below (and overwrite anything that was already there) 
* Close this Window 
* In Visual Studio, do "Tools" -> "Options" -> "Environment" -> "Keyboard" 
* In the textbox for "Show commands containing" type "AttachToWebServer" 
* In the "Press shortcut keys" press ALT F10       
It’s currently bound to something you’re not using anyway 😉
* Press "Assign" and "Ok"

Now go to your web application project and press ALT+F10 and you’re in debug mode, attached to the webserver. Press F5 in your browser (of course in the correct website) and you’re done!

Here’s the code:

Imports System
Imports EnvDTE80
Imports System.Diagnostics

Public Module AttachToWebServer

    Public Sub AttachToWebServer()

        Dim AspNetWp As String = "aspnet_wp.exe"
        Dim W3WP As String = "w3wp.exe"

        If Not (AttachToProcess(AspNetWp)) Then
            If Not AttachToProcess(W3WP) Then
                System.Windows.Forms.MessageBox.Show(String.Format("Process {0} or {1} Cannot Be Found", AspNetWp, W3WP), "Attach To Web Server Macro")
            End If
        End If

    End Sub

    Public Function AttachToProcess(ByVal ProcessName As String) As Boolean

        Dim Processes As EnvDTE.Processes = DTE.Debugger.LocalProcesses
        Dim Process As EnvDTE.Process
        Dim ProcessFound As Boolean = False

        For Each Process In Processes
            If (Process.Name.Substring(Process.Name.LastIndexOf("") + 1) = ProcessName) Then
                Process.Attach()
                ProcessFound = True
            End If
        Next

        AttachToProcess = ProcessFound

    End Function

End Module
