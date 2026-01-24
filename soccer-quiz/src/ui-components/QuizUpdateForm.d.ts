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
export declare type QuizUpdateFormInputValues = {
    type?: string;
    question?: string;
    imageUrls?: string[];
    options?: string[];
    answer?: string;
    hint?: string;
};
export declare type QuizUpdateFormValidationValues = {
    type?: ValidationFunction<string>;
    question?: ValidationFunction<string>;
    imageUrls?: ValidationFunction<string>;
    options?: ValidationFunction<string>;
    answer?: ValidationFunction<string>;
    hint?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type QuizUpdateFormOverridesProps = {
    QuizUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    question?: PrimitiveOverrideProps<TextFieldProps>;
    imageUrls?: PrimitiveOverrideProps<TextFieldProps>;
    options?: PrimitiveOverrideProps<TextFieldProps>;
    answer?: PrimitiveOverrideProps<TextFieldProps>;
    hint?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type QuizUpdateFormProps = React.PropsWithChildren<{
    overrides?: QuizUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    quiz?: any;
    onSubmit?: (fields: QuizUpdateFormInputValues) => QuizUpdateFormInputValues;
    onSuccess?: (fields: QuizUpdateFormInputValues) => void;
    onError?: (fields: QuizUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: QuizUpdateFormInputValues) => QuizUpdateFormInputValues;
    onValidate?: QuizUpdateFormValidationValues;
} & React.CSSProperties>;
export default function QuizUpdateForm(props: QuizUpdateFormProps): React.ReactElement;
