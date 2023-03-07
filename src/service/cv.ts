import { gql } from 'urql';

export const GET_LIST_CV = gql`
  query {
    CVs {
      count
      pages
      rows {
        id
        objective
        cvUrl
        minExpectedSalary
        maxExpectedSalary
        numberOfYearsExperience
        skills
        tags
        jobPosition
        createdAt
        updatedAt
        createdBy
      }
    }
  }
`;

export const CREATE_CV = gql`
  # Write your query or mutation here
  mutation (
    $objective: String!
    $jobPosition: JobPosition
    $industryCategory: IndustryCategory
    $cvUrl: String!
    $minExpectedSalary: Float!
    $maxExpectedSalary: Float!
    $numberOfYearsExperience: Float!
    $skills: String!
  ) {
    createCV(
      objective: $objective
      jobPosition: $jobPosition
      industryCategory: $industryCategory
      cvUrl: $cvUrl
      minExpectedSalary: $minExpectedSalary
      maxExpectedSalary: $maxExpectedSalary
      numberOfYearsExperience: $numberOfYearsExperience
      skills: $skills
      tags: "null"
    ) {
      id
    }
  }
`;
