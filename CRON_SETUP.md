# FreshGuard - Automatic Email Notification Setup Guide

## Overview
FreshGuard now includes automatic email notifications for products expiring within 3 days using Vercel Cron Jobs.

## How It Works

1. **Daily Cron Job**: Runs every day at 9:00 AM UTC
2. **Checks Inventory**: Queries all items expiring within the next 3 days
3. **Sends Emails**: Automatically sends expiry reminders to users
4. **Tracks Reminders**: Updates the database to avoid duplicate emails within 24 hours

## Configuration Required

### 1. Database Schema Update
Add the `reminder_sent_at` column to track when reminders were sent:

```sql
ALTER TABLE items ADD COLUMN reminder_sent_at TIMESTAMP;
CREATE INDEX idx_items_reminder_sent_at ON items(reminder_sent_at) WHERE reminder_sent_at IS NOT NULL;
```

**Connection to Neon DB from CLI:**
```bash
psql postgresql://neondb_owner:password@host/neondb < scripts/add_reminder_sent_at.sql
```

### 2. Environment Variables
Add to your `.env` file:

```env
CRON_SECRET=your-secure-random-secret-key
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Vercel Configuration
The `vercel.json` file defines the cron schedule:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-expiry-emails",
      "schedule": "0 9 * * *"
    }
  ]
}
```

- **Schedule**: `0 9 * * *` = Every day at 9:00 AM UTC
- **Path**: `/api/cron/send-expiry-emails`

## Cron Job Details

### Endpoint
- **Route**: `/api/cron/send-expiry-emails`
- **Method**: GET
- **Authentication**: Bearer token (CRON_SECRET)

### What It Does
1. Fetches all items expiring within 3 days
2. For each item, calculates days remaining
3. Sends an email reminder to the item owner
4. Marks the reminder as sent to avoid duplicates within 24 hours
5. Returns a summary of emails sent/failed

### Response Example
```json
{
  "success": true,
  "itemsProcessed": 5,
  "emailsSent": 5,
  "emailsFailed": 0
}
```

### Email Frequency
- Users receive ONE reminder per item per day maximum
- Reminders start 3 days before expiry
- Includes days remaining and item details

## Testing Locally

To test the cron job functionality locally:

```bash
# Create a test request with the CRON_SECRET
curl -H "Authorization: Bearer your-cron-secret" http://localhost:3000/api/cron/send-expiry-emails
```

## Monitoring

### Check Cron Execution on Vercel
1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project (fresh-guard)
3. Navigate to "Deployments" tab
4. Look for "Cron Job" events in the logs

### Database Verification
Check if reminders are being tracked:

```sql
SELECT id, name, expiry_date, reminder_sent_at 
FROM items 
WHERE reminder_sent_at IS NOT NULL 
ORDER BY reminder_sent_at DESC 
LIMIT 10;
```

## Email Template
The expiry reminder email includes:
- FreshGuard branding
- Item name
- Expiry date
- Days remaining
- Link to dashboard
- Call-to-action button

## Troubleshooting

### Cron Job Not Running
1. Verify `vercel.json` exists in root
2. Check CRON_SECRET is set in Vercel project settings
3. Ensure deployment is on Vercel (not local)

### Emails Not Sending
1. Check EMAIL_USER and EMAIL_PASSWORD are valid
2. Verify Gmail "App Passwords" are generated (2FA required)
3. Check email logs for failures: `npm run logs` (Vercel Pro)

### Duplicate Emails
- The `reminder_sent_at` tracking prevents duplicates within 24 hours
- If you see duplicates, check the timestamp in the database

## Future Enhancements
- Add email frequency preferences (daily, weekly, never)
- SMS notifications
- In-app notifications for expired items
- Batch email sending for efficiency
