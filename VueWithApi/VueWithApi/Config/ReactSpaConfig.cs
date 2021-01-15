namespace VueWithApi.Config
{
    public class ReactSpaConfig : ISpaConfig
    {
        public string SourcePath { get; set; } = "ClientApp_React";
        public FrontEndType FrontEnd { get; set; } = FrontEndType.React;
    }
}