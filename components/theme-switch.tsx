"use client";

import { type FC } from "react";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import { Switch } from "@heroui/react";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const isLight = theme === "light" || isSSR;

  const onChange = () => {
    setTheme(isLight ? "dark" : "light");
  };

  return (
    <Switch
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      className={className}
      isSelected={isLight}
      size='lg'
      onChange={onChange}>
      <Switch.Control className='border-none bg-transparent group-data-[selected=true]:bg-transparent'>
        <Switch.Thumb className='bg-transparent shadow-none'>
          <Switch.Icon>
            {!isLight && !isSSR ? (
              <MoonFilledIcon size={22} />
            ) : (
              <SunFilledIcon size={22} />
            )}
          </Switch.Icon>
        </Switch.Thumb>
      </Switch.Control>
    </Switch>
  );
};
