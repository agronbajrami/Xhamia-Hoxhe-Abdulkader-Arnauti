import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './widget-task-handler';

// Register the widget background task handler
registerWidgetTaskHandler(widgetTaskHandler);

// Keep Expo Router entry at the end so the app works normally
import 'expo-router/entry';
