import React, { Component, type ErrorInfo, type ReactNode, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { safeErrorMessage } from '@/src/core/errors/errorMessage';
import { useAppLocale } from '@/src/core/i18n/AppLocaleProvider';
import { errorBoundaryCopy } from '@/src/core/i18n/localePreference';

type BoundaryCopy = ReturnType<typeof errorBoundaryCopy>;
type Props = { children: ReactNode; copy: BoundaryCopy };
type State = { hasError: boolean; message: string };

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: safeErrorMessage(error, 'The screen could not be displayed.') };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
      console.error('[AppErrorBoundary]', safeErrorMessage(error), info.componentStack);
    }
  }

  retry = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    const { copy } = this.props;
    const message = this.state.message || copy.screenFailed;
    return (
      <View style={styles.root}>
        <Text style={styles.eyebrow}>{copy.eyebrow}</Text>
        <Text accessibilityRole="header" style={styles.title}>{copy.title}</Text>
        <Text accessibilityLiveRegion="assertive" style={styles.message}>{message}</Text>
        <Button accessibilityLabel={copy.retry} mode="contained" onPress={this.retry} style={styles.button}>{copy.retry}</Button>
        <Text style={styles.hint}>{copy.hint}</Text>
      </View>
    );
  }
}

export function AppErrorBoundary({ children }: { children: ReactNode }) {
  const { locale } = useAppLocale();
  const copy = useMemo(() => errorBoundaryCopy(locale), [locale]);
  return <ErrorBoundary copy={copy}>{children}</ErrorBoundary>;
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: '#F8FAFC' },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, color: '#4F46E5', marginBottom: 12 },
  title: { fontSize: 26, lineHeight: 32, fontWeight: '800', color: '#122033', textAlign: 'center' },
  message: { maxWidth: 340, marginTop: 12, color: '#667085', lineHeight: 21, textAlign: 'center' },
  button: { marginTop: 22 },
  hint: { maxWidth: 320, marginTop: 18, color: '#98A2B3', fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
