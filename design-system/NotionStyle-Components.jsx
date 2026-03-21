// ============================================
// NOTION-STYLE DESIGN SYSTEM
// Reusable React Native Components
// ============================================

// ============================================
// 1. TAILWIND CONFIG SETUP
// ============================================
// Add this to your tailwind.config.js (or tailwind.config.ts)

/*
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'doodle': '4px 4px 2px rgba(0, 0, 0, 1), 0px 6px 3px rgba(0, 0, 0, 0.3)',
        'doodle-sm': '3px 3px 1px rgba(0, 0, 0, 0.5)',
        'doodle-lg': '6px 6px 3px rgba(0, 0, 0, 1), 0px 8px 4px rgba(0, 0, 0, 0.4)',
      },
      scale: {
        '102': '1.02',
        '101': '1.01',
        '95': '0.95',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
}
*/

// ============================================
// 2. INPUT FIELD COMPONENT
// ============================================

import React from 'react';
import { TextInput, View } from 'react-native';

export const InputField = ({
  placeholder = "Enter text...",
  value,
  onChangeText,
  disabled = false,
  variant = "default", // default | error | success
  ...props
}) => {
  const getBorderColor = () => {
    switch(variant) {
      case 'error':
        return 'border-red-500';
      case 'success':
        return 'border-green-500';
      default:
        return 'border-black';
    }
  };

  return (
    <View className="w-full">
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#999999"
        editable={!disabled}
        className={`
          w-full
          px-4 py-3
          border-2 ${getBorderColor()}
          rounded-lg
          bg-white
          text-black
          text-base
          ${disabled ? 'opacity-50' : ''}
        `}
        style={{
          fontFamily: 'Inter',
        }}
        {...props}
      />
    </View>
  );
};

// ============================================
// 3. BUTTON COMPONENT
// ============================================

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export const Button = ({
  label = "Button",
  onPress,
  disabled = false,
  variant = "primary", // primary | secondary | outline
  size = "md", // sm | md | lg
  icon = null,
  ...props
}) => {
  // Size variants
  const getSizeClasses = () => {
    switch(size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default: // md
        return 'px-6 py-3 text-base';
    }
  };

  // Style variants
  const getVariantClasses = () => {
    switch(variant) {
      case 'secondary':
        return 'bg-black';
      case 'outline':
        return 'bg-white border-2 border-black';
      default: // primary
        return 'bg-black border-3 border-black';
    }
  };

  const getTextColor = () => {
    return variant === 'outline' ? 'text-black' : 'text-white';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      className={`
        ${getSizeClasses()}
        ${getVariantClasses()}
        rounded-lg
        flex flex-row items-center justify-center
        gap-2
        transition-all duration-200
        ${disabled ? 'opacity-50' : ''}
      `}
      style={{
        shadowColor: disabled ? 'transparent' : '#000',
        shadowOffset: disabled ? { width: 0, height: 0 } : { width: 4, height: 4 },
        shadowOpacity: disabled ? 0 : 1,
        shadowRadius: disabled ? 0 : 2,
        elevation: disabled ? 0 : 8,
      }}
      {...props}
    >
      {icon && icon}
      <Text
        className={`
          ${getTextColor()}
          font-bold
          tracking-tight
        `}
        style={{
          fontFamily: 'DM Sans',
          fontWeight: '700',
          letterSpacing: -0.5,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ============================================
// 4. CARD COMPONENT
// ============================================

import React from 'react';
import { View, TouchableOpacity } from 'react-native';

export const Card = ({
  children,
  onPress = null,
  variant = "default", // default | hover-effect | elevated
  padding = "lg", // sm | md | lg
  className = "",
  ...props
}) => {
  const getPaddingClass = () => {
    switch(padding) {
      case 'sm':
        return 'p-4';
      case 'md':
        return 'p-5';
      default: // lg
        return 'p-6';
    }
  };

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
      className={`
        ${getPaddingClass()}
        border-2 border-black
        rounded-xl
        bg-white
        ${className}
      `}
      style={{
        shadowColor: variant === 'elevated' ? '#000' : 'transparent',
        shadowOffset: variant === 'elevated' ? { width: 4, height: 4 } : { width: 0, height: 0 },
        shadowOpacity: variant === 'elevated' ? 1 : 0,
        shadowRadius: variant === 'elevated' ? 2 : 0,
        elevation: variant === 'elevated' ? 8 : 0,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

// ============================================
// 5. TOGGLE/SWITCH COMPONENT
// ============================================

import React, { useState } from 'react';
import { TouchableOpacity, View, Animated } from 'react-native';

export const Toggle = ({
  isActive = false,
  onToggle,
  disabled = false,
}) => {
  const [animValue] = useState(new Animated.Value(isActive ? 1 : 0));

  const handleToggle = () => {
    if (!disabled) {
      onToggle?.(!isActive);
      Animated.timing(animValue, {
        toValue: !isActive ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const dotPosition = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 20],
  });

  return (
    <TouchableOpacity
      onPress={handleToggle}
      disabled={disabled}
      className={`
        relative
        w-12 h-7
        rounded-full
        border-2 border-black
        ${isActive ? 'bg-black' : 'bg-white'}
        transition-all duration-200
        ${disabled ? 'opacity-50' : ''}
      `}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <Animated.View
        className={`
          absolute
          w-5 h-5
          rounded-full
          top-1
          ${isActive ? 'bg-white' : 'bg-black'}
        `}
        style={{
          left: dotPosition,
        }}
      />
    </TouchableOpacity>
  );
};

// ============================================
// 6. BADGE/TAG COMPONENT
// ============================================

import React from 'react';
import { View, Text } from 'react-native';

export const Badge = ({
  label,
  variant = "default", // default | success | error | warning
  size = "md", // sm | md | lg
  icon = null,
}) => {
  const getVariantClasses = () => {
    switch(variant) {
      case 'success':
        return 'bg-green-50 border-green-300 text-green-700';
      case 'error':
        return 'bg-red-50 border-red-300 text-red-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-300 text-yellow-700';
      default:
        return 'bg-white border-black text-black';
    }
  };

  const getSizeClasses = () => {
    switch(size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default: // md
        return 'px-3 py-1.5 text-sm';
    }
  };

  return (
    <View
      className={`
        inline-flex
        flex-row
        items-center
        gap-1
        border-2
        rounded-full
        ${getSizeClasses()}
        ${getVariantClasses()}
      `}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 2,
      }}
    >
      {icon && icon}
      <Text
        className="font-bold"
        style={{
          fontFamily: 'Inter',
          fontWeight: '600',
          fontSize: 12,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

// ============================================
// 7. DIVIDER COMPONENT
// ============================================

import React from 'react';
import { View } from 'react-native';

export const Divider = ({
  variant = "horizontal", // horizontal | vertical
  className = "",
}) => {
  return (
    <View
      className={`
        ${variant === 'vertical' ? 'w-0.5 h-12' : 'w-full h-0.5'}
        bg-black
        my-6
        ${className}
      `}
    />
  );
};

// ============================================
// 8. USAGE EXAMPLES
// ============================================

/*

// Input Field
<InputField
  placeholder="Enter your name"
  value={name}
  onChangeText={setName}
/>

// Primary Button
<Button
  label="Get Started"
  onPress={() => handleSubmit()}
  variant="primary"
  size="md"
/>

// Secondary Button (Outline)
<Button
  label="Cancel"
  onPress={() => goBack()}
  variant="outline"
/>

// Card
<Card padding="lg" variant="elevated" onPress={() => navigateToDetail()}>
  <Text className="text-xl font-bold mb-2">Card Title</Text>
  <Text className="text-gray-600">Card content goes here</Text>
</Card>

// Toggle
<Toggle
  isActive={isNotificationEnabled}
  onToggle={setIsNotificationEnabled}
/>

// Badge
<Badge
  label="In Progress"
  variant="warning"
/>

*/

// ============================================
// 9. FULL FORM EXAMPLE COMPONENT
// ============================================

export const FormExample = () => {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    isActive: false,
  });

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  return (
    <View className="flex-1 bg-white p-6 gap-5">
      {/* Title */}
      <Text className="text-3xl font-bold text-black mb-2">
        Create New Task
      </Text>

      {/* Input: Title */}
      <View className="gap-2">
        <Text className="text-sm font-bold text-black">Task Title</Text>
        <InputField
          placeholder="Enter task title"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />
      </View>

      {/* Input: Description */}
      <View className="gap-2">
        <Text className="text-sm font-bold text-black">Description</Text>
        <InputField
          placeholder="Enter task description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Divider */}
      <Divider />

      {/* Toggle: Active */}
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-black">Active Task</Text>
        <Toggle
          isActive={formData.isActive}
          onToggle={(val) => setFormData({ ...formData, isActive: val })}
        />
      </View>

      {/* Badges */}
      <View className="flex-row gap-2 flex-wrap">
        <Badge label="Important" variant="error" />
        <Badge label="In Progress" variant="warning" />
        <Badge label="Done" variant="success" />
      </View>

      {/* Buttons */}
      <View className="flex-row gap-3 mt-4">
        <Button
          label="Cancel"
          variant="outline"
          size="md"
          onPress={() => {}}
          className="flex-1"
        />
        <Button
          label="Create Task"
          variant="primary"
          size="md"
          onPress={handleSubmit}
          className="flex-1"
        />
      </View>
    </View>
  );
};

// ============================================
// 10. COLOR REFERENCE
// ============================================

/*
NOTION-STYLE COLOR PALETTE:

Primary:
  Black: #000000
  White: #FFFFFF

Neutrals:
  Dark Gray: #333333
  Gray: #666666
  Light Gray: #999999
  Off-white: #F5F5F5
  Very Light: #F9F9F9

Accents (optional):
  Green: #A8E6CF
  Blue: #B3E5FC
  Red: #FF6B6B
  Yellow: #FFD93D

Use case mapping:
  Text primary: #000000
  Text secondary: #666666
  Borders: #000000
  Backgrounds: #FFFFFF
  Hover backgrounds: #F9F9F9
  Disabled elements: #999999
*/
