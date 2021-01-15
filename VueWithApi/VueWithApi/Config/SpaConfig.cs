namespace VueWithApi.Config
{
    public class SpaConfig
    {
        public static ISpaConfig GetConfig(AppConfig appConfig)
        {
            switch (appConfig.FrontEnd)
            {
                case FrontEndType.React:
                    return new ReactSpaConfig();
                case FrontEndType.VueJS:
                    return new VueSpaConfig();
                default:
                    return new VueSpaConfig();
            }
        }
    }
}