/**
 * Themed components for TAKVIM app
 */

import { COLORS } from '@/constants/Colors';
import { ColorValue, Text as DefaultText, View as DefaultView } from 'react-native';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

// Define which COLORS keys are single colors (not arrays)
type SingleColorKeys = 'primary' | 'primaryLight' | 'primaryDark' | 'secondary' | 'accent' | 'accentLight' |
  'white' | 'gold' | 'goldLight' | 'goldDark' | 'background' | 'backgroundSecondary' | 'backgroundGradientStart' |
  'backgroundGradientEnd' | 'card' | 'cardLight' | 'cardHover' | 'teal' | 'purple' | 'blue' | 'orange' |
  'text' | 'textSecondary' | 'textMuted' | 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' |
  'success' | 'warning' | 'error';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: SingleColorKeys
): ColorValue {
  // Always use dark theme for this app
  const colorFromProps = props.dark;

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return COLORS[colorName] as ColorValue;
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
