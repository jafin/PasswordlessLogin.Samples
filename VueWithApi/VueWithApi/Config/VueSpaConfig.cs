namespace VueWithApi.Config
{
    public class VueSpaConfig : ISpaConfig
    {
        public string SourcePath { get; set; } = "ClientApp_Vue";
        public FrontEndType FrontEnd { get; } = FrontEndType.VueJS;
    }
}