// Settings Screen - Configure Google Apps Script URL

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../theme';
import { validateUrl } from '../utils/validation';
import { getScriptUrl, setScriptUrl } from '../services/storage';
import { testConnection } from '../services/googleSheets';

export default function SettingsScreen() {
  const [scriptUrl, setScriptUrlState] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  // Load saved URL on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const savedUrl = await getScriptUrl();
    if (savedUrl) {
      setScriptUrlState(savedUrl);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    // Validate URL
    if (!scriptUrl.trim()) {
      Alert.alert('Validation Error', 'Please enter a Script URL');
      return;
    }

    if (!validateUrl(scriptUrl)) {
      Alert.alert(
        'Invalid URL',
        'Please enter a valid HTTPS URL. The URL must start with https://'
      );
      return;
    }

    setSaving(true);
    const success = await setScriptUrl(scriptUrl);
    setSaving(false);

    if (success) {
      Alert.alert('Success', 'Settings saved successfully!');
    } else {
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const handleTestConnection = async () => {
    if (!scriptUrl.trim()) {
      Alert.alert('No URL', 'Please enter and save a Script URL first');
      return;
    }

    setTesting(true);
    const result = await testConnection(scriptUrl);
    setTesting(false);

    Alert.alert(
      result.success ? 'Success' : 'Error',
      result.message
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your Google Apps Script integration</Text>
      </View>

      {/* Google Script URL */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Google Apps Script URL</Text>
        <Text style={styles.helpText}>
          Enter the web app URL from your deployed Google Apps Script. This is where your
          product data will be saved.
        </Text>
        
        <TextInput
          style={styles.input}
          value={scriptUrl}
          onChangeText={setScriptUrlState}
          placeholder="https://script.google.com/..."
          placeholderTextColor={theme.colors.disabled}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />

        {/* Status indicator */}
        {scriptUrl && (
          <View style={styles.statusContainer}>
            {validateUrl(scriptUrl) ? (
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, styles.statusDotSuccess]} />
                <Text style={styles.statusText}>Valid HTTPS URL</Text>
              </View>
            ) : (
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, styles.statusDotError]} />
                <Text style={[styles.statusText, styles.statusTextError]}>
                  Invalid URL (must use HTTPS)
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.button, saving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Save Settings</Text>
        )}
      </TouchableOpacity>

      {/* Test Connection Button */}
      <TouchableOpacity
        style={[styles.secondaryButton, testing && styles.buttonDisabled]}
        onPress={handleTestConnection}
        disabled={testing || !scriptUrl}
      >
        {testing ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <Text style={styles.secondaryButtonText}>Test Connection</Text>
        )}
      </TouchableOpacity>

      {/* Help Section */}
      <View style={styles.helpSection}>
        <Text style={styles.helpSectionTitle}>How to get your Script URL:</Text>
        <Text style={styles.helpSectionText}>
          1. Create a new Google Sheet{'\n'}
          2. Go to Extensions → Apps Script{'\n'}
          3. Paste the provided script code{'\n'}
          4. Deploy as Web App{'\n'}
          5. Copy the URL and paste it above
        </Text>
      </View>

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>DukaScan v1.0.0</Text>
        <Text style={styles.footerSubtext}>Scan. Record. Manage.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  helpText: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  statusContainer: {
    marginTop: theme.spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  statusDotSuccess: {
    backgroundColor: theme.colors.success,
  },
  statusDotError: {
    backgroundColor: theme.colors.error,
  },
  statusText: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
  },
  statusTextError: {
    color: theme.colors.error,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
  helpSection: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
  },
  helpSectionTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  helpSectionText: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  footerText: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  footerSubtext: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.disabled,
  },
});
