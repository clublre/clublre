"use client";

import { type FC } from "react";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import { Switch } from "@heroui/react";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
}

/**
 * ThemeSwitch — light/dark toggle built on HeroUI v3's Switch compound.
 *
 * Anatomy (per HeroUI v3 docs):
 *   <Switch>
 *     <Switch.Content>
 *       <Switch.Control>
 *         <Switch.Thumb>
 *           <Switch.Icon>{icon}</Switch.Icon>
 *         </Switch.Thumb>
 *       </Switch.Control>
 *     </Switch.Content>
 *   </Switch>
 */
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
      <Switch.Content>
        <Switch.Control className='border-none bg-transparent group-data-[selected=true]:bg-transparent'>
          <Switch.Thumb className='bg-transparent shadow-none'>
            <Switch.Icon>
              {!isLight && !isSSR ? (
                <MoonFilledIcon size={16} />
              ) : (
                <SunFilledIcon size={16} />
              )}
            </Switch.Icon>
          </Switch.Thumb>
        </Switch.Control>
      </Switch.Content>
    </Switch>
  );
};
