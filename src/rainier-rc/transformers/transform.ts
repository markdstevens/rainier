import { RainierRC } from '../rainier-rc';

export function transform<T extends keyof RainierRC>(
  rainierRC: RainierRC | null,
  fieldName: T,
  defaultConfiguration: string,
  transformer: (configValue: string) => string
): string {
  return rainierRC
    ? rainierRC[fieldName]
      ? transformer(rainierRC[fieldName])
      : transformer(defaultConfiguration)
    : transformer(defaultConfiguration);
}