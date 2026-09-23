import { Href, Link } from "expo-router";
import { Alert } from "react-native";
import { openBrowserAsync, WebBrowserPresentationStyle } from "expo-web-browser";
import { useMemo, type ComponentProps } from "react";
import { useAppLocale } from '@/src/core/i18n/AppLocaleProvider';
import { externalLinkCopy } from '@/src/core/i18n/localePreference';

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  const { locale } = useAppLocale();
  const copy = useMemo(() => externalLinkCopy(locale), [locale]);
  return (
    <Link
      target="_blank"
      {...rest}
      accessibilityLabel={rest.accessibilityLabel ?? copy.open}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== "web") {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          try {
            await openBrowserAsync(href, {
              presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
            });
          } catch {
            Alert.alert(copy.failureTitle, copy.failureMessage);
          }
        }
      }}
    />
  );
}
