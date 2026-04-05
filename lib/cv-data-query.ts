import { gql } from 'graphql-request';

/**
 * Requête unique pour exporter tout le contenu CV par locale (DatoCMS → JSON local).
 * Garder aligné avec les champs utilisés dans app/[lang]/*.
 */
export const CV_AGGREGATE_QUERY = gql`
  query CvAggregate($lang: SiteLocale) {
    github {
      url
    }
    header(locale: $lang) {
      id
      name
      role
    }
    contact(locale: $lang) {
      title
      phoneTitle
      phone
      emailTitle
      email
      locationTitle
      location
    }
    about(locale: $lang) {
      title
      text
    }
    skillsTitle(locale: $lang) {
      title
    }
    studiesTitle(locale: $lang) {
      title
    }
    jobsTitle(locale: $lang) {
      title
    }
    projectsTitle(locale: $lang) {
      title
    }
    hobbiesTitle(locale: $lang) {
      title
    }
    learningsTitle(locale: $lang) {
      title
    }
    head(locale: $lang) {
      url
      name
      locale
      seo {
        description
        title
      }
    }
    allSkillsModels(locale: $lang) {
      id
      name
      link
    }
    allDomainsModels(locale: $lang) {
      id
      name
      description
      position
      competencies {
        id
        name
        link
      }
    }
    allJobsModels(locale: $lang, filter: { visible: { eq: true } }) {
      client
      location
      startDate
      endDate
      description
      bullets {
        id
        text
      }
      frameworks {
        id
        name
        link
      }
      role {
        name
        id
      }
    }
    allStudiesModels(locale: $lang) {
      id
      name
      startDate
      endDate
      establishment
      location
    }
    allProjectsModels(locale: $lang) {
      id
      name
      link
      startDate
      endDate
      description
      frameworks {
        id
        name
        link
      }
      bullets {
        id
        text
      }
      tags {
        id
        name
      }
    }
    allHobbiesModels(locale: $lang) {
      id
      name
      link
    }
    allLearningsModels(locale: $lang) {
      id
      name
      link
    }
  }
`;
