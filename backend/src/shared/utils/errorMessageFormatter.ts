export function formatMessage(
  template: string,
  params: Record<string, string>,
): string {
  let message = template;

  for (const key in params) {
    const regex = new RegExp(`{{${key}}}`, "g");
    message = message.replace(regex, params[key]);
  }

  return message;
}
