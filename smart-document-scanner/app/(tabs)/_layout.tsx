import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'web' ? 10 : Math.max(insets.bottom, 8);
  return <Tabs screenOptions={{ headerShown:false, tabBarActiveTintColor:'#4F46E5', tabBarInactiveTintColor:'#98A2B3', tabBarButton:HapticTab, tabBarLabelStyle:{fontSize:11,fontWeight:'700',marginTop:-2}, tabBarStyle:{height:58 + bottomPadding,paddingTop:6,paddingBottom:bottomPadding,backgroundColor:'#FFFFFF',borderTopColor:'#EAECF0',borderTopWidth:1}, tabBarItemStyle:{borderRadius:14,marginHorizontal:3,marginVertical:3}, tabBarHideOnKeyboard:true }}>
    <Tabs.Screen name="index" options={{ title:'Scan', tabBarAccessibilityLabel:'Scan documents', tabBarIcon:({color})=><IconSymbol name="camera.fill" size={24} color={color}/> }} />
    <Tabs.Screen name="gallery" options={{ title:'Documents', tabBarAccessibilityLabel:'Document library', tabBarIcon:({color})=><IconSymbol name="doc.text.fill" size={23} color={color}/> }} />
    <Tabs.Screen name="settings" options={{ title:'Pro', tabBarAccessibilityLabel:'Pro and Settings', tabBarIcon:({color})=><IconSymbol name="sparkles" size={23} color={color}/> }} />
  </Tabs>;
}
