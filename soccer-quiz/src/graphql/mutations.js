/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createQuiz = /* GraphQL */ `
  mutation CreateQuiz(
    $input: CreateQuizInput!
    $condition: ModelQuizConditionInput
  ) {
    createQuiz(input: $input, condition: $condition) {
      id
      type
      question
      imageUrls
      options
      answer
      hint
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateQuiz = /* GraphQL */ `
  mutation UpdateQuiz(
    $input: UpdateQuizInput!
    $condition: ModelQuizConditionInput
  ) {
    updateQuiz(input: $input, condition: $condition) {
      id
      type
      question
      imageUrls
      options
      answer
      hint
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteQuiz = /* GraphQL */ `
  mutation DeleteQuiz(
    $input: DeleteQuizInput!
    $condition: ModelQuizConditionInput
  ) {
    deleteQuiz(input: $input, condition: $condition) {
      id
      type
      question
      imageUrls
      options
      answer
      hint
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
