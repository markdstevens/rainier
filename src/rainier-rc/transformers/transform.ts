import type { RainierRC } from '../types';

export function transform<T extends keyof RainierRC>(
  rainierRC: RainierRC | null,
  fieldName: T,
  defaultConfiguration: string,
  transformer: (configValue: RainierRC[keyof RainierRC]) => string
): string {
  return rainierRC
    ? rainierRC[fieldName]
      ? transformer(rainierRC[fieldName])
      : transformer(defaultConfiguration)
    : transformer(defaultConfiguration);
}
