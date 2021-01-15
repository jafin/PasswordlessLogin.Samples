namespace VueWithApi
{
    public enum FrontEndType
    {
        VueJS,
        React
    }

    public class AppConfig
    {
        public FrontEndType FrontEnd { get; set; } = FrontEndType.VueJS;
    }
}