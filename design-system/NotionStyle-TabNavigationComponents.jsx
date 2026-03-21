// ============================================
// NOTION-STYLE TAB NAVIGATION COMPONENTS
// React Native + Tailwind Implementation
// ============================================

import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

// ============================================
// 1. TAB BAR COMPONENT
// ============================================

export const TabBar = ({
  tabs = [],
  activeTab = null,
  onTabPress = null,
  showTopBorder = true,
}) => {
  return (
    <SafeAreaView
      edges={['bottom']}
      className={`
        bg-white
        ${showTopBorder ? 'border-t border-gray-200' : ''}
      `}
    >
      <View
        className="
          flex flex-row
          justify-around
          items-end
          pt-3 pb-5
          px-0
        "
      >
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onPress={() => onTabPress?.(tab.id)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

// ============================================
// 2. TAB ITEM COMPONENT
// ============================================

export const TabItem = ({
  tab = {},
  isActive = false,
  onPress = null,
}) => {
  const iconColor = isActive ? '#1A1A1A' : '#BDBDBD';
  const textColor = isActive ? 'text-gray-900' : 'text-gray-400';
  const textWeight = isActive ? 'font-medium' : 'font-normal';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="
        flex flex-col
        items-center
        gap-1
        flex-1
        py-2
      "
    >
      {/* Icon */}
      <View className="w-6 h-6">
        {typeof tab.icon === 'function' ? (
          tab.icon({ color: iconColor, size: 24 })
        ) : typeof tab.icon === 'string' ? (
          <Text className="text-2xl">{tab.icon}</Text>
        ) : (
          tab.icon
        )}
      </View>

      {/* Label */}
      <Text
        className={`
          text-xs
          transition-colors duration-150
          ${textColor}
          ${textWeight}
        `}
      >
        {tab.label}
      </Text>

      {/* Active Indicator Dot */}
      <View
        className={`
          w-1 h-1
          bg-black
          rounded-full
          transition-opacity duration-150
          ${isActive ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </TouchableOpacity>
  );
};

// ============================================
// 3. CUSTOM TAB BAR FOR REACT NAVIGATION
// ============================================

export const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <TabBar
      tabs={state.routes.map((route, index) => ({
        id: route.name,
        label: descriptors[route.key].options.tabBarLabel || route.name,
        icon: descriptors[route.key].options.tabBarIcon,
      }))}
      activeTab={state.routes[state.index].name}
      onTabPress={(tabId) => {
        const event = navigation.emit({
          type: 'tabPress',
          target: state.routes.find(r => r.name === tabId)?.key,
          preventDefault: () => {},
        });

        if (!event.defaultPrevented) {
          navigation.navigate(tabId);
        }
      }}
    />
  );
};

// ============================================
// 4. EXAMPLE SVG ICON COMPONENTS
// ============================================

export const HomeIcon = ({ color = '#1A1A1A', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const TransactionIcon = ({ color = '#1A1A1A', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 16V4m0 12l-3-3m3 3l3-3M17 8v12m0-12l-3 3m3-3l3 3" />
  </svg>
);

export const SettingsIcon = ({ color = '#1A1A1A', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m5.08-5.08l4.24-4.24" />
  </svg>
);

export const PocketIcon = ({ color = '#1A1A1A', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9l6-7 6 7" />
    <path d="M6 9v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9" />
    <circle cx="12" cy="4" r="1" />
  </svg>
);

export const MoreIcon = ({ color = '#1A1A1A', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="5" cy="12" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
  </svg>
);

// ============================================
// 5. USAGE EXAMPLES
// ============================================

export const BottomTabNavigationExample = () => {
  const [activeTab, setActiveTab] = React.useState('home');

  const tabs = [
    {
      id: 'home',
      label: 'Beranda',
      icon: HomeIcon,
    },
    {
      id: 'pocket',
      label: 'Pockets',
      icon: PocketIcon,
    },
    {
      id: 'transaction',
      label: 'Transaksi',
      icon: TransactionIcon,
    },
    {
      id: 'settings',
      label: 'Pengaturan',
      icon: SettingsIcon,
    },
  ];

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    console.log('Navigated to:', tabId);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return <HomeScreenContent />;
      case 'pocket':
        return <PocketScreenContent />;
      case 'transaction':
        return <TransactionScreenContent />;
      case 'settings':
        return <SettingsScreenContent />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Content */}
      {renderContent()}

      {/* Tab Bar */}
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={handleTabPress}
        showTopBorder={true}
      />
    </View>
  );
};

// ============================================
// 6. SCREEN CONTENT EXAMPLES
// ============================================

const HomeScreenContent = () => (
  <View className="flex-1 justify-center items-center bg-white">
    <Text className="text-2xl font-semibold text-gray-900">
      Home
    </Text>
    <Text className="text-gray-600 mt-2">
      This is the home screen
    </Text>
  </View>
);

const PocketScreenContent = () => (
  <View className="flex-1 justify-center items-center bg-white">
    <Text className="text-2xl font-semibold text-gray-900">
      Pockets
    </Text>
    <Text className="text-gray-600 mt-2">
      This is the pockets screen
    </Text>
  </View>
);

const TransactionScreenContent = () => (
  <View className="flex-1 justify-center items-center bg-white">
    <Text className="text-2xl font-semibold text-gray-900">
      Transactions
    </Text>
    <Text className="text-gray-600 mt-2">
      This is the transactions screen
    </Text>
  </View>
);

const SettingsScreenContent = () => (
  <View className="flex-1 justify-center items-center bg-white">
    <Text className="text-2xl font-semibold text-gray-900">
      Settings
    </Text>
    <Text className="text-gray-600 mt-2">
      This is the settings screen
    </Text>
  </View>
);

// ============================================
// 7. REACT NAVIGATION INTEGRATION EXAMPLE
// ============================================

/*
// In your navigation setup:

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Beranda',
            tabBarIcon: ({ color, size }) => (
              <HomeIcon color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Pockets"
          component={PocketScreen}
          options={{
            tabBarLabel: 'Pockets',
            tabBarIcon: ({ color, size }) => (
              <PocketIcon color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Transactions"
          component={TransactionScreen}
          options={{
            tabBarLabel: 'Transaksi',
            tabBarIcon: ({ color, size }) => (
              <TransactionIcon color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Pengaturan',
            tabBarIcon: ({ color, size }) => (
              <SettingsIcon color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
*/

// ============================================
// 8. ADVANCED: ANIMATED TAB BAR
// ============================================

import { Animated } from 'react-native';

export const AnimatedTabBar = ({
  tabs = [],
  activeTab = null,
  onTabPress = null,
}) => {
  const [animValue] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    // Could add animation here if needed
  }, [activeTab]);

  return (
    <SafeAreaView edges={['bottom']} className="bg-white border-t border-gray-200">
      <View className="flex flex-row justify-around items-end pt-3 pb-5 px-0">
        {tabs.map((tab, index) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onPress={() => onTabPress?.(tab.id)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

// ============================================
// 9. ALTERNATIVE: WITH BADGE SUPPORT
// ============================================

export const TabItemWithBadge = ({
  tab = {},
  isActive = false,
  onPress = null,
  badge = null,
}) => {
  const iconColor = isActive ? '#1A1A1A' : '#BDBDBD';
  const textColor = isActive ? 'text-gray-900' : 'text-gray-400';
  const textWeight = isActive ? 'font-medium' : 'font-normal';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex flex-col items-center gap-1 flex-1 py-2 relative"
    >
      {/* Icon */}
      <View className="w-6 h-6 relative">
        {typeof tab.icon === 'function' ? (
          tab.icon({ color: iconColor, size: 24 })
        ) : (
          tab.icon
        )}
        
        {/* Badge */}
        {badge && (
          <View className="absolute -top-2 -right-2 bg-red-600 rounded-full w-5 h-5 flex items-center justify-center">
            <Text className="text-white text-xs font-bold">
              {badge}
            </Text>
          </View>
        )}
      </View>

      {/* Label */}
      <Text className={`text-xs transition-colors duration-150 ${textColor} ${textWeight}`}>
        {tab.label}
      </Text>

      {/* Active Indicator */}
      <View
        className={`
          w-1 h-1
          bg-black
          rounded-full
          transition-opacity duration-150
          ${isActive ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </TouchableOpacity>
  );
};

// ============================================
// 10. EXPORT ALL
// ============================================

export default {
  TabBar,
  TabItem,
  CustomTabBar,
  AnimatedTabBar,
  TabItemWithBadge,
  HomeIcon,
  TransactionIcon,
  SettingsIcon,
  PocketIcon,
  MoreIcon,
  BottomTabNavigationExample,
};
