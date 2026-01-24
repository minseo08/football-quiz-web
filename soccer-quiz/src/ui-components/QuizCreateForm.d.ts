/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type QuizCreateFormInputValues = {
    type?: string;
    question?: string;
    imageUrls?: string[];
    options?: string[];
    answer?: string;
    hint?: string;
};
export declare type QuizCreateFormValidationValues = {
    type?: ValidationFunction<string>;
    question?: ValidationFunction<string>;
    imageUrls?: ValidationFunction<string>;
    options?: ValidationFunction<string>;
    answer?: ValidationFunction<string>;
    hint?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type QuizCreateFormOverridesProps = {
    QuizCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    question?: PrimitiveOverrideProps<TextFieldProps>;
    imageUrls?: PrimitiveOverrideProps<TextFieldProps>;
    options?: PrimitiveOverrideProps<TextFieldProps>;
    answer?: PrimitiveOverrideProps<TextFieldProps>;
    hint?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type QuizCreateFormProps = React.PropsWithChildren<{
    overrides?: QuizCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: QuizCreateFormInputValues) => QuizCreateFormInputValues;
    onSuccess?: (fields: QuizCreateFormInputValues) => void;
    onError?: (fields: QuizCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: QuizCreateFormInputValues) => QuizCreateFormInputValues;
    onValidate?: QuizCreateFormValidationValues;
} & React.CSSProperties>;
export default function QuizCreateForm(props: QuizCreateFormProps): React.ReactElement;
