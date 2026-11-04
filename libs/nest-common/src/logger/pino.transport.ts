import pretty from 'pino-pretty';

export default function build(opts: Record<string, unknown>) {
  return pretty({
    ...(opts as Parameters<typeof pretty>[0]),
    messageFormat: (log: Record<string, unknown>, messageKey: string) => {
      const rawContext = log['context'];
      const context = rawContext
        ? typeof rawContext === 'object'
          ? (rawContext as Record<string, unknown>)['context'] ?? JSON.stringify(rawContext)
          : rawContext
        : null;
      const msg = log[messageKey];
      const coloredMsg = `\x1B[36m${String(msg ?? '')}\x1B[0m`;
      if (context) {
        return `\x1B[33m[${String(context)}]\x1B[0m ${coloredMsg}`;
      }
      return coloredMsg;
    },
  });
}
