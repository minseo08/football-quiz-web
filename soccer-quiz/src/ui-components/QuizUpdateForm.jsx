/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getQuiz } from "../graphql/queries";
import { updateQuiz } from "../graphql/mutations";
const client = generateClient();
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function QuizUpdateForm(props) {
  const {
    id: idProp,
    quiz: quizModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    type: "",
    question: "",
    imageUrls: [],
    options: [],
    answer: "",
    hint: "",
  };
  const [type, setType] = React.useState(initialValues.type);
  const [question, setQuestion] = React.useState(initialValues.question);
  const [imageUrls, setImageUrls] = React.useState(initialValues.imageUrls);
  const [options, setOptions] = React.useState(initialValues.options);
  const [answer, setAnswer] = React.useState(initialValues.answer);
  const [hint, setHint] = React.useState(initialValues.hint);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = quizRecord
      ? { ...initialValues, ...quizRecord }
      : initialValues;
    setType(cleanValues.type);
    setQuestion(cleanValues.question);
    setImageUrls(cleanValues.imageUrls ?? []);
    setCurrentImageUrlsValue("");
    setOptions(cleanValues.options ?? []);
    setCurrentOptionsValue("");
    setAnswer(cleanValues.answer);
    setHint(cleanValues.hint);
    setErrors({});
  };
  const [quizRecord, setQuizRecord] = React.useState(quizModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getQuiz.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getQuiz
        : quizModelProp;
      setQuizRecord(record);
    };
    queryData();
  }, [idProp, quizModelProp]);
  React.useEffect(resetStateValues, [quizRecord]);
  const [currentImageUrlsValue, setCurrentImageUrlsValue] = React.useState("");
  const imageUrlsRef = React.createRef();
  const [currentOptionsValue, setCurrentOptionsValue] = React.useState("");
  const optionsRef = React.createRef();
  const validations = {
    type: [],
    question: [{ type: "Required" }],
    imageUrls: [],
    options: [],
    answer: [{ type: "Required" }],
    hint: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          type: type ?? null,
          question,
          imageUrls: imageUrls ?? null,
          options: options ?? null,
          answer,
          hint: hint ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateQuiz.replaceAll("__typename", ""),
            variables: {
              input: {
                id: quizRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "QuizUpdateForm")}
      {...rest}
    >
      <TextField
        label="Type"
        isRequired={false}
        isReadOnly={false}
        value={type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type: value,
              question,
              imageUrls,
              options,
              answer,
              hint,
            };
            const result = onChange(modelFields);
            value = result?.type ?? value;
          }
          if (errors.type?.hasError) {
            runValidationTasks("type", value);
          }
          setType(value);
        }}
        onBlur={() => runValidationTasks("type", type)}
        errorMessage={errors.type?.errorMessage}
        hasError={errors.type?.hasError}
        {...getOverrideProps(overrides, "type")}
      ></TextField>
      <TextField
        label="Question"
        isRequired={true}
        isReadOnly={false}
        value={question}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              question: value,
              imageUrls,
              options,
              answer,
              hint,
            };
            const result = onChange(modelFields);
            value = result?.question ?? value;
          }
          if (errors.question?.hasError) {
            runValidationTasks("question", value);
          }
          setQuestion(value);
        }}
        onBlur={() => runValidationTasks("question", question)}
        errorMessage={errors.question?.errorMessage}
        hasError={errors.question?.hasError}
        {...getOverrideProps(overrides, "question")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              type,
              question,
              imageUrls: values,
              options,
              answer,
              hint,
            };
            const result = onChange(modelFields);
            values = result?.imageUrls ?? values;
          }
          setImageUrls(values);
          setCurrentImageUrlsValue("");
        }}
        currentFieldValue={currentImageUrlsValue}
        label={"Image urls"}
        items={imageUrls}
        hasError={errors?.imageUrls?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("imageUrls", currentImageUrlsValue)
        }
        errorMessage={errors?.imageUrls?.errorMessage}
        setFieldValue={setCurrentImageUrlsValue}
        inputFieldRef={imageUrlsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Image urls"
          isRequired={false}
          isReadOnly={false}
          value={currentImageUrlsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.imageUrls?.hasError) {
              runValidationTasks("imageUrls", value);
            }
            setCurrentImageUrlsValue(value);
          }}
          onBlur={() => runValidationTasks("imageUrls", currentImageUrlsValue)}
          errorMessage={errors.imageUrls?.errorMessage}
          hasError={errors.imageUrls?.hasError}
          ref={imageUrlsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "imageUrls")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              type,
              question,
              imageUrls,
              options: values,
              answer,
              hint,
            };
            const result = onChange(modelFields);
            values = result?.options ?? values;
          }
          setOptions(values);
          setCurrentOptionsValue("");
        }}
        currentFieldValue={currentOptionsValue}
        label={"Options"}
        items={options}
        hasError={errors?.options?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("options", currentOptionsValue)
        }
        errorMessage={errors?.options?.errorMessage}
        setFieldValue={setCurrentOptionsValue}
        inputFieldRef={optionsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Options"
          isRequired={false}
          isReadOnly={false}
          value={currentOptionsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.options?.hasError) {
              runValidationTasks("options", value);
            }
            setCurrentOptionsValue(value);
          }}
          onBlur={() => runValidationTasks("options", currentOptionsValue)}
          errorMessage={errors.options?.errorMessage}
          hasError={errors.options?.hasError}
          ref={optionsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "options")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Answer"
        isRequired={true}
        isReadOnly={false}
        value={answer}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              question,
              imageUrls,
              options,
              answer: value,
              hint,
            };
            const result = onChange(modelFields);
            value = result?.answer ?? value;
          }
          if (errors.answer?.hasError) {
            runValidationTasks("answer", value);
          }
          setAnswer(value);
        }}
        onBlur={() => runValidationTasks("answer", answer)}
        errorMessage={errors.answer?.errorMessage}
        hasError={errors.answer?.hasError}
        {...getOverrideProps(overrides, "answer")}
      ></TextField>
      <TextField
        label="Hint"
        isRequired={false}
        isReadOnly={false}
        value={hint}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              question,
              imageUrls,
              options,
              answer,
              hint: value,
            };
            const result = onChange(modelFields);
            value = result?.hint ?? value;
          }
          if (errors.hint?.hasError) {
            runValidationTasks("hint", value);
          }
          setHint(value);
        }}
        onBlur={() => runValidationTasks("hint", hint)}
        errorMessage={errors.hint?.errorMessage}
        hasError={errors.hint?.hasError}
        {...getOverrideProps(overrides, "hint")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || quizModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || quizModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
