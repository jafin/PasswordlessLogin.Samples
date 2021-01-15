namespace VueWithApi.Config
{
    public static class SpaConfig
    {
        public static ISpaConfig GetConfig(AppConfig appConfig)
        {
            return appConfig.FrontEnd switch
            {
                FrontEndType.React => new ReactSpaConfig(),
                FrontEndType.VueJS => new VueSpaConfig(),
                _ => new VueSpaConfig()
            };
        }
    }
}