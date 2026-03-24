export function getApiErrorMessage(error: unknown, fallback: string): string {
  const apiError = error as {
    error?: { message?: string };
    message?: string;
    status?: number;
  };

  if (typeof apiError?.error?.message === 'string' && apiError.error.message.trim()) {
    return apiError.error.message;
  }

  if (typeof apiError?.message === 'string' && apiError.message.trim()) {
    return apiError.message;
  }

  if (typeof apiError?.status === 'number') {
    return `Request failed with status ${apiError.status}.`;
  }

  return fallback;
}
