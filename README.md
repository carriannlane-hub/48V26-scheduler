# GamiCon48V Event Champion Scheduler

A volunteer shift scheduling application for GamiCon48V 2026.

## Features

- Self-service shift sign-up with automatic rule enforcement
- 18 two-hour shifts over 36 hours
- Multi-language support (English, Chinese, Thai, Arabic, French)
- Timezone detection with local/Central time toggle
- Time period indicators (Morning, Afternoon, Evening, Night)
- Dark/Light mode
- Calendar export (Google Calendar, .ics download, email)
- Built-in reminders (1 day and 2 hours before each shift)
- Admin mode for managing sign-ups
- WCAG 2.2 AA accessible
- Mobile-first responsive design

## Shift Rules

- Maximum 4 consecutive hours (2 shifts back-to-back)
- 2-hour rest required after 4 consecutive hours
- Maximum 12 hours total per person
- 2 Champions per shift (ideal), 1 minimum

## Admin Access

Password: Contact event organizer

## Development

```bash
npm install
npm run dev
```

## Deployment

This app is designed for Vercel deployment. Connect your GitHub repo to Vercel and it will auto-deploy.

## Contact

Questions? Contact Carriann Lane.
