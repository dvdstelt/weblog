namespace HelloWorld;

public static class Program
{
    #region Main
    public static void Main(string[] args)
    {
        var name = args.Length > 0 ? args[0] : "world";
        var greeter = new Greeter();
        Console.WriteLine(greeter.Greet(name));
    }
    #endregion
}

public class Greeter
{
    #region Greet
    public string Greet(string name) => $"Hello, {name}!";
    #endregion

    #region Farewell
    public string Farewell(string name) => $"Goodbye, {name}. See you around!";
    #endregion
}
