/// <reference types="nativewind/types" />

declare module "react-native-safe-area-context" {
  import { ComponentType } from "react";
  import { ViewProps } from "react-native";
  export const SafeAreaView: ComponentType<ViewProps>;
  export const SafeAreaProvider: ComponentType<ViewProps>;
  export const useSafeAreaInsets: () => {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}
