import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = ({ style }) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'es', name: 'Español' },
  ];

  return (
    <View style={[styles.container, style]}>
      {languages.map(({ code, name }) => (
        <TouchableOpacity
          key={code}
          style={[styles.button, i18n.language === code && styles.activeButton]}
          onPress={() => i18n.changeLanguage(code)}
        >
          <Text
            style={[
              styles.buttonText,
              i18n.language === code && styles.activeButtonText,
            ]}
          >
            {name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: 'rgba(52,152,219,0.2)',
  },
  activeButton: {
    backgroundColor: '#3498db',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  activeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default LanguageSwitcher;
