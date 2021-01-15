namespace VueWithApi.Config
{
    public interface ISpaConfig
    {
        string SourcePath { get; }
        public FrontEndType FrontEnd { get; }
    }
}