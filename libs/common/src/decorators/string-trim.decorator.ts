import { Transform, TransformFnParams } from "class-transformer";

export function Trim(): (target: any, key: string) => void {
    return Transform(({ value }: TransformFnParams) => {
        return typeof value === 'string' ? value.trim() : value;
    });
}