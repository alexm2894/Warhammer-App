export function microphoneError(error: unknown): string {
  const name = error instanceof Error ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") return "Microphone access is blocked. Allow microphone access for this site and your browser in Windows privacy settings. If this is an embedded preview, open the site in Chrome or Edge.";
  if (name === "NotFoundError") return "No microphone was found. Connect a microphone and set it as your default input device.";
  if (name === "NotReadableError" || name === "AbortError") return "The microphone could not be opened. Check your input device and whether another app is using it exclusively.";
  return "The microphone test could not start. Open the site in Chrome or Edge on PC, or Safari on iPad, and try again.";
}
