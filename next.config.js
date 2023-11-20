/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

module.exports = {
  // TODO REMOVE
  compress: false,

  trailingSlash: true,
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision'),
    };

    // TODO REMOVE
    config.optimization = {
      minimize: false,
    };

    return config;
  },
  env: {
    DEFAULT_ORGANIZATION_ID: process.env.DEFAULT_ORGANIZATION_ID,
    ENVIRONMENT: process.env.ENVIRONMENT,

    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_MEASURAMENT_ID: process.env.FIREBASE_MEASURAMENT_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,

    API_URL: process.env.API_URL,
    API_URL_LEADS: process.env.API_URL_LEADS,
    API_URL_ADMIN: process.env.API_URL_ADMIN,
    API_URL_USERS: process.env.API_URL_USERS,
    API_URL_PATIENTS: process.env.API_URL_PATIENTS,
    API_URL_PATIENT_CLINIC_HISTORY: process.env.API_URL_PATIENT_CLINIC_HISTORY,
    API_URL_PRODUCTS: process.env.API_URL_PRODUCTS,
    API_URL_STAFF: process.env.API_URL_STAFF,
    API_URL_TASKS: process.env.API_URL_TASKS,
    API_URL_ASPECTS: process.env.API_URL_ASPECTS,
    API_URL_LEVELS: process.env.API_URL_LEVELS,
    API_URL_USER_TASKS: process.env.API_URL_USER_TASKS,
    API_URL_USER_TOUCHPOINTS: process.env.API_URL_USER_TOUCHPOINTS,
    API_URL_ATTACHMENTS: process.env.API_URL_ATTACHMENTS,
    API_URL_PROGRESS_OPTIONS: process.env.API_URL_PROGRESS_OPTIONS,
    API_URL_HOOKED_EVENTS: process.env.API_URL_HOOKED_EVENTS,
    API_URL_INSIGHTS: process.env.API_URL_INSIGHTS,
    API_URL_USER_PRODUCTS: process.env.API_URL_USER_PRODUCTS,
    API_URL_USER_CALENDARS: process.env.API_URL_USER_CALENDARS,
    API_URL_GOOGLE_OAUTH: process.env.API_URL_GOOGLE_OAUTH,
    API_URL_COMPANIES: process.env.API_URL_COMPANIES,
    API_URL_COMPANY_EMPLOYEES: process.env.API_URL_COMPANY_EMPLOYEES,
    API_URL_COMPANY_SURVEY_QUESTIONS: process.env.API_URL_COMPANY_SURVEY_QUESTIONS,
    API_URL_COMPANY_SURVEYS: process.env.API_URL_COMPANY_SURVEYS,
    API_URL_COMPANY_CLIENTS: process.env.API_URL_COMPANY_CLIENTS,
    API_URL_COMPANY_DOCS: process.env.API_URL_COMPANY_DOCS,
    API_URL_COMPANY_FUNDINGS: process.env.API_URL_COMPANY_FUNDINGS,

    WHATSAPP_PHONE_NUMBER: '5491164828027',

    API_URL_REMINDERS: process.env.API_URL_REMINDERS,
    API_URL_ENTITY_RELATIONSHIPS: process.env.API_URL_ENTITY_RELATIONSHIPS,

    API_URL_ENTITIES_SCHEMAS: process.env.API_URL_ENTITIES_SCHEMAS,
    API_URL_ENTITY_SCHEMA_FIELDS: process.env.API_URL_ENTITY_SCHEMA_FIELDS,
    API_URL_ENTITY_SCHEMA_FIELD_GROUPS: process.env.API_URL_ENTITY_SCHEMA_FIELD_GROUPS,
    API_URL_ORGANIZATION_USER_DEFINED_ROLS: process.env.API_URL_ORGANIZATION_USER_DEFINED_ROLS,
    API_URL_USER_ROLS: process.env.API_URL_USER_ROLS,
    API_URL_ORGANIZATIONS: process.env.API_URL_ORGANIZATIONS,
  },
};
