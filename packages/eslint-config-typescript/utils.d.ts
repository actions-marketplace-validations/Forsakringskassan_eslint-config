export function hash(value: string): string;
export function add(...values: number[]): number;
export function take<T>(it: Generator<T>, n: number): T[];
export function join(values: string[]): Promise<string>;
