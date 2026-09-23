export const CAPTURE_ANNOUNCEMENT_DELAY_MS = 140;

export type CaptureAnnouncementSequenceOptions = {
  announce: () => void;
  navigate: () => void;
  waitMs?: number;
  wait?: (milliseconds: number) => Promise<void>;
};

const defaultWait = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

/**
 * Announces capture success before moving to Review. Keeping this sequence in a
 * pure orchestration boundary makes the accessibility contract deterministic
 * and avoids coupling tests to React Navigation or native accessibility APIs.
 */
export async function announceBeforeNavigation({ announce, navigate, waitMs = CAPTURE_ANNOUNCEMENT_DELAY_MS, wait = defaultWait }: CaptureAnnouncementSequenceOptions) {
  announce();
  await wait(waitMs);
  navigate();
}
