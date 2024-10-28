import { expectTypeOf } from "expect-type";
import { Dispatch, DispatchWithoutAction, SetStateAction } from "react";
import { createDependency, Dependency, DependencyConsumer, DependencyProvider, useDependency, useEagerReducer, useEagerState, useEventTrigger, useRefInitCallback } from "../src/hooks";
import { ChoiceField, ChoiceFieldProps, ChoiceFieldState, ChoiceItem, DateField, DateFieldState, FieldType, FormContext, FormFieldProps, FormFieldState, FormObject, FormValidateEvent, FormValidationChangeEvent, MultiChoiceField, MultiChoiceFieldProps, MultiChoiceFieldState, NumericField, NumericFieldState, TextField, TextFieldState, ToggleField, ToggleFieldState, ValidateResult, ValidationError, useFormContext, useFormField } from "../src/form";
import { DataView } from "../src/dataView";
import React from "react";

const _: unknown = {};

// -------------------------------------
// hooks.d.ts

expectTypeOf(useEagerReducer((_1: number, _2: string) => 1, 1)).toEqualTypeOf<[number, Dispatch<string>]>;
expectTypeOf(useEagerReducer((_1: number, _2: string) => 1, () => 1)).toEqualTypeOf<[number, Dispatch<string>]>;
expectTypeOf(useEagerReducer((_1: number) => 1, 1)).toEqualTypeOf<[number, DispatchWithoutAction]>;
expectTypeOf(useEagerReducer((_1: number) => 1, () => 1)).toEqualTypeOf<[number, DispatchWithoutAction]>;

expectTypeOf(useEagerState(() => 1)).toEqualTypeOf<[number, Dispatch<SetStateAction<number>>]>();
expectTypeOf(useEagerState(1)).toEqualTypeOf<[number, Dispatch<SetStateAction<number>>]>();
expectTypeOf(useEagerState<number>()).toEqualTypeOf<[number | undefined, Dispatch<SetStateAction<number | undefined>>]>();
expectTypeOf(useEagerState()).toEqualTypeOf<[undefined, Dispatch<SetStateAction<undefined>>]>();

expectTypeOf(useEventTrigger(<Window>_, 'animationstart')).toBeVoid();
expectTypeOf(useEventTrigger(<Window>_, 'animationstart', (_1: AnimationEvent) => 1)).toEqualTypeOf<number | undefined>();
expectTypeOf(useEventTrigger(<Window>_, 'animationstart', (_1: AnimationEvent) => 1, 1)).toEqualTypeOf<number>();
expectTypeOf(useEventTrigger(<Window>_, 'animationstart keydown', (_1: AnimationEvent | KeyboardEvent) => 1)).toEqualTypeOf<number | undefined>();
expectTypeOf(useEventTrigger(<Window>_, 'animationstart keydown', (_1: AnimationEvent | KeyboardEvent) => 1, 1)).toEqualTypeOf<number>();

expectTypeOf(useEventTrigger(<FormContext>_, 'validate')).toBeVoid();
expectTypeOf(useEventTrigger(<FormContext>_, 'validate', (_1: FormValidateEvent) => 1)).toEqualTypeOf<number | undefined>();
expectTypeOf(useEventTrigger(<FormContext>_, 'validate', (_1: FormValidateEvent) => 1, 1)).toEqualTypeOf<number>();
expectTypeOf(useEventTrigger(<FormContext>_, 'validate validationChange', (_1: FormValidateEvent | FormValidationChangeEvent) => 1)).toEqualTypeOf<number | undefined>();
expectTypeOf(useEventTrigger(<FormContext>_, 'validate validationChange', (_1: FormValidateEvent | FormValidationChangeEvent) => 1, 1)).toEqualTypeOf<number>();

useEventTrigger(<Window>_, 'animationstart keydown', e => expectTypeOf(e).toEqualTypeOf<AnimationEvent | KeyboardEvent>());
useEventTrigger(<Window>_, 'animationstart', e => expectTypeOf(e).toEqualTypeOf<AnimationEvent>());
useEventTrigger(<Window>_, 'validate', (_, v) => expectTypeOf(v).toEqualTypeOf<boolean>(), true);

useEventTrigger(<FormContext>_, 'validate validationChange', e => expectTypeOf(e).toEqualTypeOf<FormValidateEvent | FormValidationChangeEvent>());
useEventTrigger(<FormContext>_, 'validate', e => expectTypeOf(e).toEqualTypeOf<FormValidateEvent>());
useEventTrigger(<FormContext>_, 'validate', (_, v) => expectTypeOf(v).toEqualTypeOf<boolean>(), true);

useEventTrigger(<FormContext>_, 'validate', (_1, _2: boolean | undefined) => true, true);
useEventTrigger(<FormContext>_, 'validate', (_1, _2: boolean | undefined) => true);
useEventTrigger(<FormContext>_, 'validate', (_1, _2: boolean) => true, true);
// @ts-expect-error: second args must have undefined
useEventTrigger(<FormContext>_, 'validate', (_1, _2: boolean) => true);

expectTypeOf(useRefInitCallback((_1: Element) => _)).toEqualTypeOf<React.RefCallback<Element>>();
expectTypeOf(useRefInitCallback((_1: Element, _2: boolean) => _, true)).toEqualTypeOf<React.RefCallback<Element>>();
expectTypeOf(useRefInitCallback((_1: Element, _2: boolean, _3: string) => _, true, "")).toEqualTypeOf<React.RefCallback<Element>>();
// @ts-expect-error: argument type mismatch
expectTypeOf(useRefInitCallback((_1: Element, _2: boolean) => _, "")).toEqualTypeOf<React.RefCallback<Element>>();
// @ts-expect-error: argument count mismatch
expectTypeOf(useRefInitCallback((_1: Element, _2: boolean, _3: string) => _, true)).toEqualTypeOf<React.RefCallback<Element>>();

useRefInitCallback((_1: Element, _2) => {
    expectTypeOf(_2).toEqualTypeOf<boolean>();
}, true);

// will not infer types for extra arguments when given only first type argument
useRefInitCallback<Element>((_1, _2) => {
    expectTypeOf(_2).toBeAny();
}, true);

const dep1 = createDependency(0);
const dep2 = createDependency<number>();
expectTypeOf(useDependency(dep1)).toEqualTypeOf<number>();
expectTypeOf(useDependency(dep2)).toEqualTypeOf<number | undefined>();
expectTypeOf(useDependency(dep1.Consumer)).toEqualTypeOf<number>();
expectTypeOf(useDependency(dep2.Consumer)).toEqualTypeOf<number | undefined>();

expectTypeOf(<DependencyConsumer<number>>_).not.toMatchTypeOf<DependencyProvider<number>>();
expectTypeOf(<DependencyProvider<number>>_).not.toMatchTypeOf<DependencyConsumer<number>>();

// consumer is covariant
expectTypeOf(<DependencyConsumer<number>>_).toMatchTypeOf<DependencyConsumer<number | undefined>>();
expectTypeOf(<DependencyConsumer<number>>_).toMatchTypeOf<DependencyConsumer<number | string>>();
expectTypeOf(<DependencyConsumer<{ a: number, b: number }>>_).toMatchTypeOf<DependencyConsumer<{ a: number }>>();
expectTypeOf(<DependencyConsumer<number | undefined>>_).not.toMatchTypeOf<DependencyConsumer<number>>();
expectTypeOf(<DependencyConsumer<number | string>>_).not.toMatchTypeOf<DependencyConsumer<number>>();
expectTypeOf(<DependencyConsumer<{ a: number }>>_).not.toMatchTypeOf<DependencyConsumer<{ a: number, b: number }>>();

// provider is contravariant
expectTypeOf(<DependencyProvider<number | undefined>>_).toMatchTypeOf<DependencyProvider<number>>();
expectTypeOf(<DependencyProvider<number | string>>_).toMatchTypeOf<DependencyProvider<number>>();
expectTypeOf(<DependencyProvider<{ a: number }>>_).toMatchTypeOf<DependencyProvider<{ a: number, b: number }>>();
expectTypeOf(<DependencyProvider<number>>_).not.toMatchTypeOf<DependencyProvider<number | undefined>>();
expectTypeOf(<DependencyProvider<number>>_).not.toMatchTypeOf<DependencyProvider<number | string>>();
expectTypeOf(<DependencyProvider<{ a: number, b: number }>>_).not.toMatchTypeOf<DependencyProvider<{ a: number }>>();

// depedency is bivariant
expectTypeOf(<Dependency<number>>_).not.toMatchTypeOf<Dependency<number | undefined>>();
expectTypeOf(<Dependency<number>>_).not.toMatchTypeOf<Dependency<number | string>>();
expectTypeOf(<Dependency<{ a: number }>>_).not.toMatchTypeOf<Dependency<{ a: number, b: number }>>();
expectTypeOf(<Dependency<number | undefined>>_).not.toMatchTypeOf<Dependency<number>>();
expectTypeOf(<Dependency<number | string>>_).not.toMatchTypeOf<Dependency<number>>();
expectTypeOf(<Dependency<{ a: number, b: number }>>_).not.toMatchTypeOf<Dependency<{ a: number }>>();

// @ts-expect-error
useDependency(dep1, 1);
// @ts-expect-error
useDependency(dep1.Provider);
// @ts-expect-error
useDependency(dep1.Provider, true);
// @ts-expect-error
useDependency({});
// @ts-expect-error
useDependency({}, 1);

// -------------------------------------
// form.d.ts

type A = {
    a: string;
    b: number;
    c: { d: string }[];
};

interface DropdownItem<T> {
    value: T;
    label: string;
}

interface DropdownProps<T> extends ChoiceFieldProps<DropdownItem<T>> { }
interface MultiDropdownProps<T> extends MultiChoiceFieldProps<DropdownItem<T>> { }

interface CustomFieldState extends FormFieldState<string[]> {
    customState: any;
};

declare class CustomField implements FieldType<FormFieldProps<string[]>, CustomFieldState> {
    defaultValue: string[];
    isEmpty(value: string[]): boolean;
    normalizeValue(value: any, props: FormFieldProps<string[], string[]>): string[];
    postHook(state: FormFieldState<string[]>, props: FormFieldProps<string[], string[]>): CustomFieldState;
}

declare const formContext: FormContext<A>;

expectTypeOf(useFormContext().data).toEqualTypeOf<Partial<Zeta.Dictionary<any>>>();
expectTypeOf(useFormContext(<A>_).data).toEqualTypeOf<Partial<A>>();
expectTypeOf(useFormContext(<A>_, {}).data).toEqualTypeOf<Partial<A>>();
expectTypeOf(useFormContext(() => <A>_).data).toEqualTypeOf<Partial<A>>();
expectTypeOf(useFormContext(() => <A>_, {}).data).toEqualTypeOf<Partial<A>>();

expectTypeOf(useFormContext('key').data).toEqualTypeOf<Partial<Zeta.Dictionary<any>>>();
expectTypeOf(useFormContext('key', <A>_).data).toEqualTypeOf<Partial<A>>();
expectTypeOf(useFormContext('key', <A>_, {}).data).toEqualTypeOf<Partial<A>>();
expectTypeOf(useFormContext('key', () => <A>_).data).toEqualTypeOf<Partial<A>>();
expectTypeOf(useFormContext('key', () => <A>_, {}).data).toEqualTypeOf<Partial<A>>();
expectTypeOf(useFormContext('key', { autoPersist: true }).data).toEqualTypeOf<Partial<{ autoPersist: boolean }>>();

// FormContext

expectTypeOf(formContext.getValue('a')).toEqualTypeOf<string | undefined>();
expectTypeOf(formContext.getValue('c')).toEqualTypeOf<{ d: string }[] | undefined>();
expectTypeOf(formContext.getValue('c.0')).toEqualTypeOf<{ d: string } | undefined>();
expectTypeOf(formContext.getValue('c.0.d')).toEqualTypeOf<string | undefined>();
expectTypeOf(formContext.getValue('c.1.d')).toEqualTypeOf<string | undefined>();
expectTypeOf(formContext.getValue('x')).toBeAny();

expectTypeOf(formContext.setValue('a', '')).toBeVoid();
expectTypeOf(formContext.setValue('c', [{ d: '' }])).toBeVoid();
expectTypeOf(formContext.setValue('c.0', { d: '' })).toBeVoid();
expectTypeOf(formContext.setValue('c.0.d', '')).toBeVoid();
expectTypeOf(formContext.setValue('c.1.d', '')).toBeVoid();
expectTypeOf(formContext.setValue('x', _)).toBeVoid();
// @ts-expect-error: incorrect value type
expectTypeOf(formContext.setValue('a', 0)).toBeVoid();

expectTypeOf(formContext.getError('x')).toEqualTypeOf<string>();
expectTypeOf(formContext.setError('x', <ValidateResult>_)).toBeVoid();
expectTypeOf(formContext.focus('x')).toEqualTypeOf<boolean>();
expectTypeOf(formContext.element('x')).toEqualTypeOf<HTMLElement | undefined>();
expectTypeOf(formContext.validate('x')).toEqualTypeOf<Promise<boolean>>();

// Value and specific members

expectTypeOf(useFormField(TextField, {})).toEqualTypeOf<TextFieldState<string>>();
expectTypeOf(useFormField(TextField, {}, '')).toEqualTypeOf<TextFieldState<string>>();
expectTypeOf(useFormField(TextField, {}).value).toEqualTypeOf<string>();
expectTypeOf(useFormField(TextField, {}).setValue('')).toBeVoid();
expectTypeOf(useFormField(TextField, {}).setValue((_1: string) => '')).toBeVoid();

expectTypeOf(useFormField('text', {}, '')).toEqualTypeOf<TextFieldState<string>>();
expectTypeOf(useFormField('text', {}, '').value).toEqualTypeOf<string>();

expectTypeOf(useFormField(ToggleField, {})).toEqualTypeOf<ToggleFieldState>();
expectTypeOf(useFormField(ToggleField, {}, false)).toEqualTypeOf<ToggleFieldState>();
expectTypeOf(useFormField(ToggleField, { value: '', checked: true })).toEqualTypeOf<ToggleFieldState>();
expectTypeOf(useFormField(ToggleField, {}).value).toEqualTypeOf<boolean>();
expectTypeOf(useFormField(ToggleField, {}).setValue(true)).toBeVoid();
expectTypeOf(useFormField(ToggleField, {}).setValue((_1: boolean) => true)).toBeVoid();
expectTypeOf(useFormField(ToggleField, {}).toggleValue()).toBeVoid();

expectTypeOf(useFormField('toggle', {}, false)).toEqualTypeOf<ToggleFieldState>();
expectTypeOf(useFormField('toggle', {}, false).value).toEqualTypeOf<boolean>();

expectTypeOf(useFormField(ChoiceField, { items: <ChoiceItem<string>[]>_ })).toEqualTypeOf<ChoiceFieldState<ChoiceItem<string>>>();
expectTypeOf(useFormField(ChoiceField, { items: <ChoiceItem<string>[]>_ }, '')).toEqualTypeOf<ChoiceFieldState<ChoiceItem<string>>>();
expectTypeOf(useFormField(ChoiceField, { items: [''] })).toEqualTypeOf<ChoiceFieldState<ChoiceItem<string>>>();
expectTypeOf(useFormField(ChoiceField, { items: [''] }, '')).toEqualTypeOf<ChoiceFieldState<ChoiceItem<string>>>();

expectTypeOf(useFormField(ChoiceField, <DropdownProps<string>>_)).toEqualTypeOf<ChoiceFieldState<DropdownItem<string>>>();
expectTypeOf(useFormField(ChoiceField, <DropdownProps<string>>_, 'foo')).toEqualTypeOf<ChoiceFieldState<DropdownItem<string>>>();
expectTypeOf(useFormField(ChoiceField, <DropdownProps<string>>_).value).toEqualTypeOf<string>();
expectTypeOf(useFormField(ChoiceField, <DropdownProps<string>>_).items).toEqualTypeOf<DropdownItem<string>[]>();
expectTypeOf(useFormField(ChoiceField, <DropdownProps<string>>_).selectedItem).toEqualTypeOf<DropdownItem<string> | undefined>();
expectTypeOf(useFormField(ChoiceField, <DropdownProps<string>>_).setValue("")).toBeVoid();
expectTypeOf(useFormField(ChoiceField, <DropdownProps<string>>_).setValue((_1: string) => "")).toBeVoid();

expectTypeOf(useFormField(ChoiceField, <DropdownProps<A>>_)).toEqualTypeOf<ChoiceFieldState<DropdownItem<A>>>();
expectTypeOf(useFormField(ChoiceField, <DropdownProps<A>>_, '')).toEqualTypeOf<ChoiceFieldState<DropdownItem<A>>>();
expectTypeOf(useFormField(ChoiceField, <DropdownProps<A>>_, <A>_)).toEqualTypeOf<ChoiceFieldState<DropdownItem<A>>>();
expectTypeOf(useFormField(ChoiceField, <DropdownProps<A>>_).value).toEqualTypeOf<"" | A>();
expectTypeOf(useFormField(ChoiceField, <DropdownProps<A>>_).items).toEqualTypeOf<DropdownItem<A>[]>();
expectTypeOf(useFormField(ChoiceField, <DropdownProps<A>>_).selectedItem).toEqualTypeOf<DropdownItem<A> | undefined>();
expectTypeOf(useFormField(ChoiceField, <DropdownProps<A>>_).setValue("")).toBeVoid();
expectTypeOf(useFormField(ChoiceField, <DropdownProps<A>>_).setValue(<A>_)).toBeVoid();
expectTypeOf(useFormField(ChoiceField, <DropdownProps<A>>_).setValue((_1: "" | A) => "")).toBeVoid();
expectTypeOf(useFormField(ChoiceField, <DropdownProps<A>>_).setValue((_1: "" | A) => <A>_)).toBeVoid();

expectTypeOf(<T>() => [
    expectTypeOf(useFormField(ChoiceField, <DropdownProps<T>>_)).toEqualTypeOf<ChoiceFieldState<DropdownItem<T>>>(),
    expectTypeOf(useFormField(ChoiceField, <DropdownProps<T>>_, '')).toEqualTypeOf<ChoiceFieldState<DropdownItem<T>>>(),
    expectTypeOf(useFormField(ChoiceField, <DropdownProps<T>>_).items).toEqualTypeOf<DropdownItem<T>[]>(),
    expectTypeOf(useFormField(ChoiceField, <DropdownProps<T>>_).selectedItem).toEqualTypeOf<DropdownItem<T> | undefined>(),
    expectTypeOf(useFormField(ChoiceField, <DropdownProps<T>>_).setValue("")).toBeVoid(),
    expectTypeOf(useFormField(ChoiceField, <DropdownProps<T>>_).setValue(<T>_)).toBeVoid(),
    expectTypeOf(useFormField(ChoiceField, <DropdownProps<T>>_).setValue((_1: "" | T) => "")).toBeVoid(),
    expectTypeOf(useFormField(ChoiceField, <DropdownProps<T>>_).setValue((_1: "" | T) => <T>_)).toBeVoid(),
]);

expectTypeOf(useFormField(MultiChoiceField, { items: [''] })).toEqualTypeOf<MultiChoiceFieldState<ChoiceItem<string>>>();
expectTypeOf(useFormField(MultiChoiceField, { items: [''] }, ['a'])).toEqualTypeOf<MultiChoiceFieldState<ChoiceItem<string>>>();

expectTypeOf(useFormField(MultiChoiceField, <MultiDropdownProps<string>>_)).toEqualTypeOf<MultiChoiceFieldState<DropdownItem<string>>>();
expectTypeOf(useFormField(MultiChoiceField, <MultiDropdownProps<string>>_, [])).toEqualTypeOf<MultiChoiceFieldState<DropdownItem<string>>>();
expectTypeOf(useFormField(MultiChoiceField, <MultiDropdownProps<string>>_, ['a'])).toEqualTypeOf<MultiChoiceFieldState<DropdownItem<string>>>();
expectTypeOf(useFormField(MultiChoiceField, <MultiDropdownProps<string>>_).value).toEqualTypeOf<readonly string[]>();
expectTypeOf(useFormField(MultiChoiceField, <MultiDropdownProps<string>>_).items).toEqualTypeOf<DropdownItem<string>[]>();
expectTypeOf(useFormField(MultiChoiceField, <MultiDropdownProps<string>>_).setValue(['a'])).toBeVoid();
expectTypeOf(useFormField(MultiChoiceField, <MultiDropdownProps<string>>_).setValue((_1: readonly string[]) => ['a'])).toBeVoid();
expectTypeOf(useFormField(MultiChoiceField, <MultiDropdownProps<string>>_).toggleValue('a')).toBeVoid();
expectTypeOf(useFormField(MultiChoiceField, <MultiDropdownProps<string>>_).toggleValue('a', true)).toBeVoid();

expectTypeOf(<T>() => [
    expectTypeOf(useFormField(MultiChoiceField, <MultiDropdownProps<T>>_)).toEqualTypeOf<MultiChoiceFieldState<DropdownItem<T>>>(),
    expectTypeOf(useFormField(MultiChoiceField, <MultiDropdownProps<T>>_).value).toEqualTypeOf<readonly T[]>(),
    expectTypeOf(useFormField(MultiChoiceField, <MultiDropdownProps<T>>_).items).toEqualTypeOf<DropdownItem<T>[]>(),
    expectTypeOf(useFormField(MultiChoiceField, <MultiDropdownProps<T>>_).setValue(<T[]>_)).toBeVoid(),
    expectTypeOf(useFormField(MultiChoiceField, <MultiDropdownProps<T>>_).setValue((_1: readonly T[]) => <T[]>_)).toBeVoid(),
    expectTypeOf(useFormField(MultiChoiceField, <MultiDropdownProps<T>>_).toggleValue(<T>_)).toBeVoid(),
    expectTypeOf(useFormField(MultiChoiceField, <MultiDropdownProps<T>>_).toggleValue(<T>_, true)).toBeVoid(),
]);

expectTypeOf(useFormField(DateField, {})).toEqualTypeOf<DateFieldState>();
expectTypeOf(useFormField(DateField, {}, '')).toEqualTypeOf<DateFieldState>();
expectTypeOf(useFormField(DateField, { min: new Date() })).toEqualTypeOf<DateFieldState>();
expectTypeOf(useFormField(DateField, { max: new Date() })).toEqualTypeOf<DateFieldState>();
expectTypeOf(useFormField(DateField, { min: '' })).toEqualTypeOf<DateFieldState>();
expectTypeOf(useFormField(DateField, { max: '' })).toEqualTypeOf<DateFieldState>();
expectTypeOf(useFormField(DateField, {}).value).toEqualTypeOf<string>();
expectTypeOf(useFormField(DateField, {}).min).toEqualTypeOf<string>();
expectTypeOf(useFormField(DateField, {}).max).toEqualTypeOf<string>();
expectTypeOf(useFormField(DateField, {}).setValue('')).toBeVoid();
expectTypeOf(useFormField(DateField, {}).setValue((_1: string) => '')).toBeVoid();

expectTypeOf(useFormField(NumericField, {})).toEqualTypeOf<NumericFieldState>();
expectTypeOf(useFormField(NumericField, {}, 0)).toEqualTypeOf<NumericFieldState>();
expectTypeOf(useFormField(NumericField, {}).value).toEqualTypeOf<number>();
expectTypeOf(useFormField(NumericField, {}).setValue(0)).toBeVoid();
expectTypeOf(useFormField(NumericField, {}).setValue((_1: number) => 0)).toBeVoid();

expectTypeOf(useFormField(CustomField, {})).toEqualTypeOf<CustomFieldState>();
expectTypeOf(useFormField(CustomField, {}, ['a'])).toEqualTypeOf<CustomFieldState>();
expectTypeOf(useFormField(CustomField, {}).value).toEqualTypeOf<string[]>();
expectTypeOf(useFormField(CustomField, {}).setValue([''])).toBeVoid();
expectTypeOf(useFormField(CustomField, {}).setValue((_1: string[]) => [''])).toBeVoid();

// common members

expectTypeOf(useFormField(TextField, {}).error).toEqualTypeOf<string>();

expectTypeOf(useFormField(TextField, {}).setError('')).toBeVoid();
expectTypeOf(useFormField(TextField, {}).setError(_1 => '')).toBeVoid();
expectTypeOf(useFormField(TextField, {}).setError(_1 => null)).toBeVoid();
expectTypeOf(useFormField(TextField, {}).setError(_1 => undefined)).toBeVoid();
expectTypeOf(useFormField(TextField, {}).setError(_1 => new ValidationError('', ''))).toBeVoid();
expectTypeOf(useFormField(TextField, {}).setError(_1 => ({ [Symbol.toPrimitive]: () => '' }))).toBeVoid();

expectTypeOf(useFormField(NumericField, { isEmpty: (_1: number) => true })).toEqualTypeOf<NumericFieldState>();
expectTypeOf(useFormField(NumericField, { onChange: (_1: number) => true })).toEqualTypeOf<NumericFieldState>();
expectTypeOf(useFormField(NumericField, { onValidate: (_1: number) => '' })).toEqualTypeOf<NumericFieldState>();

// invalid cases

// @ts-expect-error
expectTypeOf(useFormField(ToggleField, {}, '').value).toEqualTypeOf<boolean>();
// @ts-expect-error
expectTypeOf(useFormField(ToggleField, {}).setValue('')).toBeVoid();
// @ts-expect-error
expectTypeOf(useFormField(ToggleField, {}).setValue((_1: string) => true)).toBeVoid();

// FormContext with specific type can be assigned to unspecific form
expectTypeOf<FormContext<{ a: string }>>().toMatchTypeOf<FormContext>();

// -------------------------------------
// dataView.d.ts

// DataView with specific type can be assigned to unspecific form
expectTypeOf<DataView<{ a: string }>>().toMatchTypeOf<DataView<{}>>();
