import { HttpException, HttpStatus } from '@nestjs/common';

type AsyncFunction<T = unknown> = (...args: unknown[]) => Promise<T>;

export function HandleHttpErrors() {
  return function <T>(
    _target: unknown,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<AsyncFunction<T>>,
  ): TypedPropertyDescriptor<AsyncFunction<T>> {
    const originalMethod = descriptor.value as AsyncFunction<T>;

    descriptor.value = async function (...args: unknown[]): Promise<T> {
      try {
        const result = (await originalMethod.apply(this, args)) as T;
        return result;
      } catch (e) {
        throw new HttpException(
          e instanceof Error ? e.message : 'Unknown error',
          HttpStatus.BAD_REQUEST,
        );
      }
    };
    return descriptor;
  };
}
