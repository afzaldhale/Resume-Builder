/**
 * Migration stabilization scaffold.
 *
 * This module will become the pure theme resolution engine.
 */

export interface ThemeOverride {
  [key: string]: string | undefined;
}

export type ThemeTokenKey = string;

export const mergeThemeColors = (
  _templateId: number,
  _colors?: ThemeOverride
): ThemeOverride => ({
  // placeholder; actual behavior will be implemented later.
});

export const resolveTheme = (
  _templateId: number,
  _themeData?: ThemeOverride
): ThemeOverride => mergeThemeColors(_templateId, _themeData);
