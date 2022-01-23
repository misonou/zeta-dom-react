export type PrimitiveClassName = undefined | string | Record<string, string | number | boolean | undefined>;
export type ClassName = PrimitiveClassName | ClassNameProvider;

export interface ClassNameProvider {
    getClassNames(): ClassName | ClassName[];
}

export function classNames(...args: ClassName[]): string;
