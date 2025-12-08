
import { WebinarData, Participant, EligibilityResult } from '../types';
import { parseCSV } from '../utils/csvParser';

// The ID of the Google Sheet provided by the user
const SHEET_ID = '1AvGsbLdEDaMuLevbperDoUa1FMOr7PPY';
// Using the Google Visualization API to get CSV data.
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

// TODO: Paste your Google Apps Script Web App URL here to enable writing to the sheet
// Example: 'https://script.google.com/macros/s/AKfycbx.../exec'
const APPS_SCRIPT_URL = ''; 

const LOCAL_STORAGE_OVERLAY_KEY = 'certifizoom_overlay_data_v1';

// Internal type for the local storage overlay (Persisting writes locally for optimistic UI)
interface LocalOverlay {
  [email: string]: {
    loginTime?: string;
    downloadTime?: string;
    quizPassed?: boolean;
    certificateDownloaded?: boolean;
  }
}

// --- DATA LOGGING (APPS SCRIPT) ---

const logToAppsScript = async (email: string, action: 'VERIFY' | 'QUIZ_PASS' | 'DOWNLOAD') => {
    if (!APPS_SCRIPT_URL) {
        console.warn(`APPS_SCRIPT_URL is not set. Action '${action}' will not be written to Google Sheet.`);
        return;
    }

    try {
        // We use mode: 'no-cors' because Google Apps Script endpoints don't strictly support CORS preflight for custom headers.
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain' 
            },
            body: JSON.stringify({ 
                email, 
                action, 
                timestamp: new Date().toISOString() 
            })
        });
        console.log(`Logged ${action} for ${email} to sheet.`);
    } catch (e) {
        console.error("Failed to log to sheet via Apps Script:", e);
    }
};


// --- DATA FETCHING ---

const getOverlayData = (): LocalOverlay => {
  const stored = localStorage.getItem(LOCAL_STORAGE_OVERLAY_KEY);
  return stored ? JSON.parse(stored) : {};
};

const saveOverlayData = (data: LocalOverlay) => {
  localStorage.setItem(LOCAL_STORAGE_OVERLAY_KEY, JSON.stringify(data));
};

export const fetchSheetData = async (): Promise<WebinarData> => {
  try {
    const response = await fetch(CSV_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    
    if (csvText.trim().startsWith('<!DOCTYPE html>') || csvText.includes('google.com/sheets')) {
        throw new Error("Received HTML instead of CSV. Ensure the sheet is 'Published to the web' or shared publicly.");
    }

    const rawRows = parseCSV(csvText);
    const overlay = getOverlayData();
    
    const participants: Participant[] = rawRows.map((row, index) => {
        const email = row['Email'] || row['email'] || '';
        // Try to find a phone column
        const phone = row['Phone'] || row['phone'] || row['Mobile'] || row['mobile'] || row['Contact'] || row['contact'] || '';
        const durationStr = row['Total_Duration_Mins'] || '0';
        
        // Try to find a date column
        const webinarDate = row['Date'] || row['date'] || row['Session Date'] || row['session_date'] || row['Start Time'] || row['start_time'];

        // Check local storage for overlay data using email as key
        const localData = overlay[email.toLowerCase()] || {};

        // Parse Sheet columns if they exist (Server-side truth)
        const sheetVerified = row['Verified'] || row['verified'];
        const sheetQuizPassed = row['Quiz_Passed'] || row['quiz_passed'];
        const sheetDownloaded = row['Downloaded'] || row['downloaded'];
        
        // Priority: Local Overlay (most recent) -> Sheet Data -> undefined
        const loginTime = localData.loginTime || sheetVerified || undefined;
        const quizPassed = localData.quizPassed || !!sheetQuizPassed;
        const downloadTime = localData.downloadTime || sheetDownloaded || undefined;
        const certificateDownloaded = localData.certificateDownloaded || !!sheetDownloaded;
        
        return {
            id: `sheet-row-${index}`,
            email: email,
            phone: phone,
            firstName: row['first_name'] || '',
            lastName: row['last_name'] || '',
            totalDurationMins: parseInt(durationStr, 10) || 0,
            schoolName: row['School Name'] || 'Unknown School',
            gender: row['Gender'] || '',
            gradeHandled: row['Grade Handled'] || '',
            webinarDate: webinarDate, // Mapped date
            
            // App State
            status: 'attended' as const,
            quizPassed: quizPassed,
            certificateDownloaded: certificateDownloaded,
            loginTime: loginTime,
            downloadTime: downloadTime
        };
    }).filter(p => (p.email && p.email.includes('@')) || (p.phone && p.phone.length > 5)); // Allow valid email OR valid phone

    return {
      id: SHEET_ID,
      topic: "Digital Literacy Training (Live Sheet)",
      startTime: new Date().toISOString(),
      duration: 60,
      participants
    };

  } catch (error) {
    console.error("Error loading sheet data:", error);
    throw new Error(
        "Connection Error: Ensure the Google Sheet is 'Published to the web' (File > Share > Publish to web) and you have the correct ID."
    );
  }
};

export const verifyAndLogUser = async (identifier: string): Promise<EligibilityResult> => {
    // 1. Fetch fresh data
    const data = await fetchSheetData();
    
    // 2. Find user by Email OR Phone
    const cleanIdentifier = identifier.trim().toLowerCase();
    const isEmailInput = cleanIdentifier.includes('@');

    const participant = data.participants.find(p => {
        if (isEmailInput) {
            return p.email.toLowerCase() === cleanIdentifier;
        } else {
            // Normalize phone: remove non-digits
            const pPhone = p.phone.replace(/\D/g, '');
            const inputPhone = cleanIdentifier.replace(/\D/g, '');
            // Simple match: if input phone has digits and matches records
            return inputPhone.length > 5 && pPhone === inputPhone;
        }
    });

    if (!participant) {
        return {
            eligible: false,
            reason: 'NOT_FOUND',
            message: `Record not found for '${identifier}'. Please check your details and try again.`
        };
    }

    if (participant.totalDurationMins < 30) {
        return {
            eligible: false,
            reason: 'INSUFFICIENT_TIME',
            message: `Recorded Total_Duration_Mins: ${participant.totalDurationMins}. Minimum required: 30.`,
            participant
        };
    }

    // 3. Log "Verified" Action (Using EMAIL as key if available, else generic placeholder logic could be used but sticking to email for now)
    const now = new Date().toISOString();
    const emailKey = participant.email.toLowerCase();

    // Optimistic Update (Local Storage)
    if (emailKey) {
        const overlay = getOverlayData();
        overlay[emailKey] = {
            ...overlay[emailKey],
            loginTime: now
        };
        saveOverlayData(overlay);
    }
    participant.loginTime = now;

    // Network Update (Fire and forget)
    // Note: If email is missing, this logs empty string which is fine for current logic
    logToAppsScript(participant.email, 'VERIFY');

    return {
        eligible: true,
        reason: 'ELIGIBLE',
        message: "Verification successful.",
        participant,
        webinarTopic: data.topic
    };
};

export const markQuizPassedInSheet = async (participantId: string): Promise<void> => {
    const data = await fetchSheetData();
    const participant = data.participants.find(p => p.id === participantId);
    
    if (participant) {
        // Optimistic Update
        if (participant.email) {
            const email = participant.email.toLowerCase();
            const overlay = getOverlayData();
            overlay[email] = {
                ...overlay[email],
                quizPassed: true
            };
            saveOverlayData(overlay);
        }

        // Network Update
        logToAppsScript(participant.email, 'QUIZ_PASS');
    }
};

export const markDownloadInSheet = async (participantId: string): Promise<void> => {
    // Re-fetch to get email by ID safely
    const data = await fetchSheetData();
    const participant = data.participants.find(p => p.id === participantId);
    
    if (participant) {
        const now = new Date().toISOString();
        
        // Optimistic Update
        if (participant.email) {
            const email = participant.email.toLowerCase();
            const overlay = getOverlayData();
            overlay[email] = {
                ...overlay[email],
                certificateDownloaded: true,
                downloadTime: now
            };
            saveOverlayData(overlay);
        }

        // Network Update
        logToAppsScript(participant.email, 'DOWNLOAD');
    }
};
