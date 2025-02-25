export interface ConfigBaseProps {
  persistNavigation: "always" | "dev" | "prod" | "never";
  catchErrors: "always" | "dev" | "prod" | "never";
  exitRoutes: string[];
  APP_NAME: string; // Application Name
}

export type PersistNavigationConfig = ConfigBaseProps["persistNavigation"];

const BaseConfig: ConfigBaseProps = {
  // Navigation persistence settings
  persistNavigation: "dev",

  // Error-catching settings
  catchErrors: "always",

  // Routes that will exit the app if the back button is pressed (Android only)
  exitRoutes: ["Welcome"],

  // App metadata
  APP_NAME: "Where Is My Elfie",
};

export default BaseConfig;
