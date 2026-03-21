// ============================================
// NOTION-STYLE CARD LIST COMPONENT
// React Native + Tailwind Implementation
// ============================================

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// ============================================
// 1. CARD LIST ITEM COMPONENT
// ============================================

export const CardListItem = ({
  icon = null,
  title = "Item Title",
  subtitle = null,
  action = null,
  actionColor = "red", // red | green | blue | black
  onPress = null,
  disabled = false,
  testID = null,
}) => {
  const getActionColorClass = () => {
    switch(actionColor) {
      case 'green':
        return 'text-green-700';
      case 'blue':
        return 'text-blue-600';
      case 'black':
        return 'text-gray-900';
      default: // red
        return 'text-red-600';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.85}
      testID={testID}
      className={`
        flex flex-row items-center gap-4
        px-5 py-4
        bg-white
        border-2 border-gray-300
        rounded-2xl
        transition-all duration-150
        ${disabled ? 'opacity-60' : ''}
      `}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Icon Section */}
      {icon && (
        <View
          className="
            w-14 h-14
            flex-shrink-0
            flex items-center justify-center
            bg-gray-100
            border-2 border-gray-300
            rounded-xl
          "
        >
          {typeof icon === 'string' ? (
            <Text className="text-2xl">{icon}</Text>
          ) : (
            icon
          )}
        </View>
      )}

      {/* Content Section */}
      <View className="flex-1 gap-1">
        {/* Title */}
        <Text
          className="text-base font-semibold text-gray-900"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>

        {/* Subtitle */}
        {subtitle && (
          <Text
            className="text-sm font-normal text-gray-600"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Action Section */}
      {action && (
        <View className="flex-shrink-0">
          {typeof action === 'string' ? (
            <Text
              className={`
                text-lg font-semibold text-right
                ${getActionColorClass()}
              `}
              numberOfLines={1}
            >
              {action}
            </Text>
          ) : (
            action
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

// ============================================
// 2. CARD LIST CONTAINER COMPONENT
// ============================================

export const CardList = ({
  items = [],
  onItemPress = null,
  containerPadding = "p-6",
  gap = "gap-3",
  emptyMessage = "No items found",
  renderCustom = null,
}) => {
  if (items.length === 0) {
    return (
      <View className={`${containerPadding} bg-white flex-1 justify-center items-center`}>
        <Text className="text-gray-500 text-center">
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <View className={`${containerPadding} bg-white flex-1 ${gap}`}>
      {items.map((item, index) => (
        <View key={item.id || index}>
          {renderCustom ? (
            renderCustom(item)
          ) : (
            <CardListItem
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              action={item.action}
              actionColor={item.actionColor}
              onPress={() => onItemPress?.(item)}
              disabled={item.disabled}
            />
          )}
        </View>
      ))}
    </View>
  );
};

// ============================================
// 3. USAGE EXAMPLES
// ============================================

// Example 1: Expense List
export const ExpenseListExample = () => {
  const expenses = [
    {
      id: 1,
      icon: '🍽️',
      title: 'Makan',
      subtitle: 'TOKO KOPI TUKU HARAPAN INDAH',
      action: '-Rp 159.000',
      actionColor: 'red',
    },
    {
      id: 2,
      icon: '☕',
      title: 'Makan',
      subtitle: 'COURTSIDE BREW',
      action: '-Rp 88.000',
      actionColor: 'red',
    },
    {
      id: 3,
      icon: '💰',
      title: 'Tagihan',
      subtitle: null,
      action: '-Rp 350.000',
      actionColor: 'red',
    },
    {
      id: 4,
      icon: '🍦',
      title: 'Makan',
      subtitle: 'es krim',
      action: '-Rp 10.000',
      actionColor: 'red',
    },
    {
      id: 5,
      icon: '🍜',
      title: 'Makan',
      subtitle: 'MIE GACOAN',
      action: '-Rp 43.638',
      actionColor: 'red',
    },
  ];

  return (
    <CardList
      items={expenses}
      onItemPress={(item) => console.log('Expense clicked:', item)}
      containerPadding="p-6"
      gap="gap-3"
      emptyMessage="No expenses recorded"
    />
  );
};

// Example 2: Task List
export const TaskListExample = () => {
  const tasks = [
    {
      id: 1,
      icon: '✅',
      title: 'Complete project',
      subtitle: 'Due today',
      action: 'Done',
      actionColor: 'green',
    },
    {
      id: 2,
      icon: '⏳',
      title: 'Review code',
      subtitle: 'Due tomorrow',
      action: 'In Progress',
      actionColor: 'blue',
    },
    {
      id: 3,
      icon: '🔲',
      title: 'Write documentation',
      subtitle: 'Due next week',
      action: 'Not Started',
      actionColor: 'black',
    },
  ];

  return (
    <CardList
      items={tasks}
      onItemPress={(item) => console.log('Task clicked:', item)}
    />
  );
};

// Example 3: Menu/Product List
export const MenuListExample = () => {
  const menu = [
    {
      id: 1,
      icon: '🍔',
      title: 'Burger Deluxe',
      subtitle: 'Grilled beef, special sauce',
      action: 'Rp 85.000',
      actionColor: 'black',
    },
    {
      id: 2,
      icon: '🍕',
      title: 'Margherita Pizza',
      subtitle: 'Fresh mozzarella, basil',
      action: 'Rp 120.000',
      actionColor: 'black',
    },
    {
      id: 3,
      icon: '🥗',
      title: 'Caesar Salad',
      subtitle: 'Crispy greens, parmesan',
      action: 'Rp 65.000',
      actionColor: 'black',
    },
  ];

  return (
    <CardList
      items={menu}
      onItemPress={(item) => console.log('Menu item clicked:', item)}
    />
  );
};

// ============================================
// 4. CUSTOMIZABLE ICON COMPONENT
// ============================================

export const IconCircle = ({
  icon = null,
  backgroundColor = "bg-gray-100",
  borderColor = "border-gray-300",
  size = "w-14 h-14",
}) => {
  return (
    <View
      className={`
        flex-shrink-0
        flex items-center justify-center
        ${backgroundColor}
        border-2 ${borderColor}
        rounded-xl
        ${size}
      `}
    >
      {typeof icon === 'string' ? (
        <Text className="text-2xl">{icon}</Text>
      ) : (
        icon
      )}
    </View>
  );
};

// ============================================
// 5. ADVANCED: CARD WITH CUSTOM ACTIONS
// ============================================

export const CardListItemAdvanced = ({
  icon = null,
  title = "Item Title",
  subtitle = null,
  actionLabel = null,
  actionColor = "red",
  onPress = null,
  disabled = false,
  onActionPress = null,
  rightContent = null,
  tags = [],
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.85}
      className={`
        flex flex-col gap-3
        px-5 py-4
        bg-white
        border-2 border-gray-300
        rounded-2xl
        transition-all duration-150
        ${disabled ? 'opacity-60' : ''}
      `}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Top Row: Icon, Content, Action */}
      <View className="flex flex-row items-center gap-4">
        {icon && (
          <IconCircle icon={icon} />
        )}

        <View className="flex-1 gap-1">
          <Text className="text-base font-semibold text-gray-900">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm font-normal text-gray-600">
              {subtitle}
            </Text>
          )}
        </View>

        {rightContent || (
          <View className="flex-shrink-0">
            <Text className={`text-lg font-semibold text-right ${
              actionColor === 'green' ? 'text-green-700' :
              actionColor === 'blue' ? 'text-blue-600' :
              actionColor === 'black' ? 'text-gray-900' :
              'text-red-600'
            }`}>
              {actionLabel}
            </Text>
          </View>
        )}
      </View>

      {/* Tags/Metadata Row */}
      {tags.length > 0 && (
        <View className="flex flex-row gap-2 flex-wrap">
          {tags.map((tag, idx) => (
            <TagBadge key={idx} label={tag.label} variant={tag.variant} />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

// ============================================
// 6. TAG/BADGE COMPONENT
// ============================================

export const TagBadge = ({
  label = "Tag",
  variant = "default",
}) => {
  const getVariantStyles = () => {
    switch(variant) {
      case 'success':
        return 'bg-green-100 border-green-300 text-green-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-300 text-yellow-700';
      case 'error':
        return 'bg-red-100 border-red-300 text-red-700';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  return (
    <View
      className={`
        px-2.5 py-1
        border border-gray-300
        rounded-full
        ${getVariantStyles()}
      `}
    >
      <Text className="text-xs font-medium">
        {label}
      </Text>
    </View>
  );
};

// ============================================
// 7. FULL SCREEN EXAMPLE
// ============================================

export const ExpenseTrackerScreen = () => {
  const [expenses, setExpenses] = React.useState([
    {
      id: 1,
      icon: '🍽️',
      title: 'Makan',
      subtitle: 'TOKO KOPI TUKU HARAPAN INDAH',
      action: '-Rp 159.000',
      actionColor: 'red',
    },
    {
      id: 2,
      icon: '☕',
      title: 'Makan',
      subtitle: 'COURTSIDE BREW',
      action: '-Rp 88.000',
      actionColor: 'red',
    },
    {
      id: 3,
      icon: '💰',
      title: 'Tagihan',
      action: '-Rp 350.000',
      actionColor: 'red',
    },
  ]);

  const handleItemPress = (item) => {
    console.log('Item pressed:', item);
    // Navigate to detail or edit screen
  };

  const handleAddExpense = () => {
    console.log('Add expense');
    // Open add expense dialog/screen
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-semibold text-gray-900">
          Recent Expenses
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Total: Rp 597.638
        </Text>
      </View>

      {/* List */}
      <CardList
        items={expenses}
        onItemPress={handleItemPress}
        containerPadding="p-6"
        gap="gap-3"
        emptyMessage="No expenses recorded. Add one to get started!"
      />

      {/* Action Button */}
      <View className="px-6 pb-6">
        <TouchableOpacity
          onPress={handleAddExpense}
          className="
            px-6 py-3
            bg-black
            rounded-lg
            items-center
          "
        >
          <Text className="text-white font-semibold">
            Add Expense
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ============================================
// 8. TAILWIND CONFIG NEEDED
// ============================================

/*
Add to tailwind.config.js:

module.exports = {
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E8E8E8',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#999999',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#1A1A1A',
        },
        red: {
          600: '#E63946',
          700: '#D32F2F',
        },
        green: {
          700: '#2E7D32',
        },
        blue: {
          600: '#1565C0',
        },
      },
      boxShadow: {
        'soft': '0px 2px 4px rgba(0, 0, 0, 0.05)',
        'soft-md': '0px 4px 12px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
}
*/

// ============================================
// 9. EXPORT ALL COMPONENTS
// ============================================

export default {
  CardListItem,
  CardList,
  CardListItemAdvanced,
  IconCircle,
  TagBadge,
  ExpenseTrackerScreen,
  ExpenseListExample,
  TaskListExample,
  MenuListExample,
};
