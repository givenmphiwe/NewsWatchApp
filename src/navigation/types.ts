import { NavigationHelpersContext } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type DrawerParamList = {
  Tabs: NavigationHelpersContext<TabParamList>;
};