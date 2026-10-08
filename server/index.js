import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load .env from the root directory (MySafeApp/)
dotenv.config({ path: path.join(__dirname, '../.env') });
import express from 'express';
import cors from 'cors';
import twilio from 'twilio';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;
const defaultToNumber = process.env.EMERGENCY_TO_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

// Normalizes phone numbers to E.164 format.
// Supports numbers that already have country codes (+1, +91)
// Defaults to India (+91) if exactly 10 digits without a country code.
function formatPhoneNumber(rawNumber) {
  if (!rawNumber) return null;
  const trimmed = String(rawNumber).trim();
  
  // If it already starts with '+', assume it's correctly formatted
  if (trimmed.startsWith('+')) return trimmed;
  
  const digitsOnly = trimmed.replace(/\D/g, '');
  
  // Default to India (+91) if exactly 10 digits
  if (digitsOnly.length === 10) return `+91${digitsOnly}`;
  
  // Otherwise, assume the number includes a country code without the '+'
  return `+${digitsOnly}`;
}

app.post('/api/sos', async (req, res) => {
  try {
    const { vehicleName, destination, companions, description, latitude, longitude, to } = req.body;

    const finalDescription = description || 'Emergency SOS Triggered';
    const finalVehicleName = vehicleName || 'Not Specified';
    const finalDestination = destination || 'Not Specified';
    const finalCompanions = companions || 'Solo';

    let locationLink = 'Location Unavailable';
    if (latitude !== undefined && latitude !== null && longitude !== undefined && longitude !== null) {
      locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
    }

    const smsBody = `SOS ALERT! ${finalDescription}. Traveling in ${finalVehicleName} to ${finalDestination} with ${finalCompanions}. Last known location: ${locationLink}`;

    // Resolve target phone numbers, normalized to E.164
    const rawTargets = [];
    if (to) {
      if (Array.isArray(to)) rawTargets.push(...to.filter(Boolean));
      else rawTargets.push(to);
    }
    if (rawTargets.length === 0 && defaultToNumber) {
      rawTargets.push(defaultToNumber);
    }
    const targets = [...new Set(rawTargets.map(formatPhoneNumber))];

    if (!client || !fromNumber || targets.length === 0) {
      console.warn('[SOS] Twilio not configured or no targets. Running in dry-run mode.');
      return res.status(200).json({
        success: true,
        dryRun: true,
        message: 'Twilio credentials not configured (or no contacts). SOS message simulated, not actually sent.',
        targets,
        body: smsBody
      });
    }

    const dispatchResults = [];
    for (const target of targets) {
      try {
        const message = await client.messages.create({ body: smsBody, from: fromNumber, to: target });
        dispatchResults.push({ to: target, success: true, sid: message.sid });
      } catch (err) {
        console.error(`[SOS] Failed to send SMS to ${target}:`, err.message);
        dispatchResults.push({ to: target, success: false, error: err.message });
      }
    }

    const anySucceeded = dispatchResults.some(d => d.success);
    return res.status(200).json({ success: anySucceeded, dispatches: dispatchResults, body: smsBody });
  } catch (error) {
    console.error('[SOS] Endpoint failed:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`SOS backend listening on http://localhost:${PORT}`);
  if (!client) {
    console.warn('Twilio credentials missing — /api/sos will run in dry-run mode. See server/.env.example');
  }
});
