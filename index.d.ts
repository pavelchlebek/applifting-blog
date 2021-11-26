/**
 * Simple string alias for a more concise typings involving ID of entities.
 */
declare type ID = string
/**
 * Simple alias to better annotate where ISO datetime is expected
 */
declare type ISODateTime = string
/**
 * Either specified type or null
 */
declare type Nullable<TType> = TType | null
/**
 * Shortcut for `Nullable<ID>`
 */
declare type NullableID = Nullable<ID>
/**
 * Declare all type properties as Nullable
 */
declare type AllNullable<TObject> = {
  [TKey in keyof TObject]: Nullable<TObject[TKey]>
}
/**
 * Simple alias for `Record<string, V = any>` for string key based objects.
 */
declare type Dictionary<TValue = any> = Record<string, TValue>
/**
 * Shortcut for `ReadonlyArray<T>`
 */
declare type RoA<TItem> = ReadonlyArray<TItem>
/**
 * Useful for denoting untyped function without losing callable flag.
 */
declare type AnyFunction = (...args: any[]) => any
/**
 * Make properties of object writable again
 */
declare type Writeable<TObject> = { -readonly [TKey in keyof TObject]: TObject[TKey] }
/**
 * use to describe that the component does not expect any props (so that we wouldn't pass any by accident)
 */
declare type NoChildren = {
  children?: never
}
/**
 * returns the type that is wrapped inside the provided promise type
 */
declare type PromisedType<TPromise> = TPromise extends PromiseLike<infer TInferredType>
  ? TInferredType
  : TPromise
/**
 * turns all properties of provided type into partials (OriginalType | undefined)
 */
declare type RecursivePartial<TObject> = {
  [key in keyof TObject]?: TObject[key] extends (infer TInferredType)[]
    ? RecursivePartial<TInferredType>[]
    : TObject[key] extends object
    ? RecursivePartial<TObject[key]>
    : TObject[key]
}
/**
 * just a shorthand for the React.ComponentProps helper
 */
declare type PropsOf<TComponent> = React.ComponentProps<TComponent>
