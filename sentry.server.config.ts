import * as Sentry from '@sentry/nuxt'

Sentry.init({
  dsn: 'https://753f22b8c9d524969ff732fef15e55db@o4509723940159488.ingest.us.sentry.io/4509723943108608',

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false
})
