import { useEffect, useState } from "react";
import { createProvider } from "../utils/create-provider";
import { Button } from "../components/button";
import { useClassName } from "../hooks/use-class-name";

type TTabIndex = string | number;

export const [
  /**Provides functionality for building tab-navigation. */
  TabsProvider,
  /**Accesses the properties within a TabsContext. */
  useTabsContext,
] = createProvider({
  contextName: "TabsContext",
  hook: ({
    initialTab = 0,
    onChange,
  }: {
    initialTab?: TTabIndex;
    onChange?: (tab: TTabIndex) => void;
  }) => {
    const [currentTab, setCurrentTab] = useState(initialTab);
    const updateCurrentTab = (tab: TTabIndex) => {
      setCurrentTab(tab);
      onChange?.(tab);
    };

    return {
      currentTab,
      updateCurrentTab,
    };
  },
  extend: (hook) => {
    return {
      Tab: function ({
        children,
        index,
      }: React.PropsWithChildren & { index: TTabIndex }) {
        const { currentTab } = hook();

        return currentTab === index ? children : null;
      },
      Button: function ({
        children,
        index,
        ...props
      }: React.ComponentProps<typeof Button> & { index: TTabIndex }) {
        const { currentTab, updateCurrentTab } = hook();
        const isSelected = index === currentTab;
        const containerClassName = useClassName(
          "border-b-2 xs:w-full md:w-24",
          isSelected ? "border-primary" : "border-transparent",
        );
        return (
          <div className={containerClassName}>
            <Button
              {...props}
              variant='ghost'
              onClick={() => updateCurrentTab(index)}
              paddingEnabled
              fullWidth
            >
              {children}
            </Button>
          </div>
        );
      },
    };
  },
});
