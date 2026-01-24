/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateQuiz = /* GraphQL */ `
  subscription OnCreateQuiz(
    $filter: ModelSubscriptionQuizFilterInput
    $owner: String
  ) {
    onCreateQuiz(filter: $filter, owner: $owner) {
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
export const onUpdateQuiz = /* GraphQL */ `
  subscription OnUpdateQuiz(
    $filter: ModelSubscriptionQuizFilterInput
    $owner: String
  ) {
    onUpdateQuiz(filter: $filter, owner: $owner) {
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
export const onDeleteQuiz = /* GraphQL */ `
  subscription OnDeleteQuiz(
    $filter: ModelSubscriptionQuizFilterInput
    $owner: String
  ) {
    onDeleteQuiz(filter: $filter, owner: $owner) {
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
