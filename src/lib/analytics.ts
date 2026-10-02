// Product analytics (PostHog, EU cloud), loaded by ConsentBanner.astro only after analytics consent.
// Events fired before PostHog has loaded wait in a small queue, but only when consent was given;
// without consent they are dropped, never stored.

type Properties = Record<string, unknown>;

export function track(event: string, properties: Properties = {}): void {
  const posthog = window.posthog;
  if (posthog?.__loaded) {
    posthog.capture(event, properties);
  } else if (window.flavoryConsent?.analytics) {
    (window.flavoryAnalyticsQueue ??= []).push([event, properties]);
  }
}

// Anonymous PostHog IDs, handed to the WooCommerce checkout so the purchase joins the same journey.
export function analyticsIds(): { distinctId: string; sessionId: string | undefined } | null {
  const posthog = window.posthog;
  if (!posthog?.__loaded) return null;
  return { distinctId: posthog.get_distinct_id(), sessionId: posthog.get_session_id?.() };
}
