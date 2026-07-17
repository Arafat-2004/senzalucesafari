import jsPDF from 'jspdf';

interface BookingData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    contactPreference: string;
    safariType: string;
    destinations: string[];
    flexibleDates: string;
    numberOfPeople: string;
    childrenCount: string;
    childAges: string;
    travelDate: string;
    duration: string;
    accommodationLevel: string;
    vehiclePreference: string;
    activities: string[];
    budget: string;
    paymentPreference: string;
    pickupLocation: string;
    dropoffLocation: string;
    dietaryRequirements: string;
    medicalConditions: string;
    message: string;
    specialRequests: string;
    // Package-specific pricing data
    packageSlug?: string;
    basePrice?: string;
    totalPrice?: string;
    discount?: string;
    location?: {
        latitude: number | null;
        longitude: number | null;
        address: string | null;
        timestamp: number | null;
    };
}

// ─── ISO 3166-1 alpha-2 → Full country name ──────────────────────────────────
const COUNTRY_NAMES: Record<string, string> = {
    AF: 'Afghanistan', AL: 'Albania', DZ: 'Algeria', AO: 'Angola', AR: 'Argentina',
    AU: 'Australia', AT: 'Austria', BE: 'Belgium', BR: 'Brazil', BW: 'Botswana',
    CA: 'Canada', CL: 'Chile', CN: 'China', CO: 'Colombia', CD: 'DR Congo',
    CZ: 'Czech Republic', DK: 'Denmark', EG: 'Egypt', ET: 'Ethiopia', FI: 'Finland',
    FR: 'France', DE: 'Germany', GH: 'Ghana', GR: 'Greece', HU: 'Hungary',
    IN: 'India', ID: 'Indonesia', IE: 'Ireland', IL: 'Israel', IT: 'Italy',
    JP: 'Japan', JO: 'Jordan', KE: 'Kenya', KW: 'Kuwait', LB: 'Lebanon',
    MW: 'Malawi', MY: 'Malaysia', MX: 'Mexico', MA: 'Morocco', MZ: 'Mozambique',
    NA: 'Namibia', NL: 'Netherlands', NZ: 'New Zealand', NG: 'Nigeria', NO: 'Norway',
    OM: 'Oman', PL: 'Poland', PT: 'Portugal', QA: 'Qatar', RW: 'Rwanda',
    SA: 'Saudi Arabia', SN: 'Senegal', ZA: 'South Africa', ES: 'Spain', SE: 'Sweden',
    CH: 'Switzerland', TZ: 'Tanzania', TH: 'Thailand', TR: 'Turkey', UG: 'Uganda',
    AE: 'United Arab Emirates', GB: 'United Kingdom', US: 'United States',
    ZM: 'Zambia', ZW: 'Zimbabwe',
};

const resolveCountry = (code: string): string => {
    if (!code) return '';
    const upper = code.trim().toUpperCase();
    return COUNTRY_NAMES[upper] ?? code; // graceful fallback to raw value
};

const resolveBoolean = (val: string): string => {
    if (!val) return '';
    const lower = val.toLowerCase().trim();
    if (lower === 'yes' || lower === 'true' || lower === '1') return 'Yes';
    if (lower === 'no' || lower === 'false' || lower === '0') return 'No';
    // Non-boolean value — return as-is (e.g. "Vegetarian")
    return val;
};

const titleCase = (s: string): string =>
    s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

// ─── Main export ──────────────────────────────────────────────────────────────
export function generateBookingPDF(bookingData: BookingData) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const PW = doc.internal.pageSize.getWidth();   // 210mm
    const PH = doc.internal.pageSize.getHeight();  // 297mm
    const M  = 15;                                  // margin
    const CW = PW - M * 2;                          // content width = 180mm

    // ── BRAND COLORS ──────────────────────────────────────────────────────
    type RGB = [number, number, number];
    const GREEN:    RGB = [26,  86,  50];   // forest green — primary
    const GREEN_LT: RGB = [45, 118,  65];   // lighter green — PENDING badge
    const GOLD:     RGB = [162, 117,  12];  // brand gold — text on pale badge
    const GOLD_BG:  RGB = [252, 240, 190];  // pale gold badge fill
    const CHARCOAL: RGB = [51,  51,  51];   // #333333 — body text
    const MID_GRAY: RGB = [100, 116, 139];  // labels / subdued text
    const PALE:     RGB = [248, 250, 252];  // section background tint
    const DIVIDER:  RGB = [229, 231, 235];  // hairline rule colour
    const WHITE:    RGB = [255, 255, 255];
    const GREEN_TINT: RGB = [200, 225, 205];// header subdued text

    // ── HELPERS ───────────────────────────────────────────────────────────
    const C  = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);
    const F  = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
    const D  = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);
    const LW = (w: number) => doc.setLineWidth(w);

    const hRule = (y: number, x = M, w = CW) => {
        D(DIVIDER); LW(0.25);
        doc.line(x, y, x + w, y);
    };

    // ── REFERENCE NUMBER ─────────────────────────────────────────────────
    const bookingRef = `SLS-${Date.now().toString().slice(-8)}`;
    const currentDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
    });

    // ═══════════════════════════════════════════════════════════════════
    // 1. HEADER BAND
    // ═══════════════════════════════════════════════════════════════════
    F(GREEN);
    doc.rect(0, 0, PW, 44, 'F');

    // Brand name — left
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    C(WHITE);
    doc.text('SENZA LUCE', M, 19);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    C(GREEN_TINT);
    doc.text('SAFARIS', M, 27);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    C(GREEN_TINT);
    doc.text('Tanzania Safari Specialists  ·  Est. 2010', M, 35);

    // Document type badge — right
    F(GOLD_BG);
    // Rounded rect via standard rect + manual clip approximation
    doc.rect(PW - M - 40, 10, 40, 24, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    C(GOLD);
    doc.text('INQUIRY', PW - M - 20, 21, { align: 'center' });
    doc.setFontSize(6.5);
    doc.text('CONFIRMATION', PW - M - 20, 28, { align: 'center' });

    // ═══════════════════════════════════════════════════════════════════
    // 2. REFERENCE BAR
    // ═══════════════════════════════════════════════════════════════════
    F(PALE);
    doc.rect(0, 44, PW, 16, 'F');
    hRule(60, 0, PW);

    // Ref — left
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    C(MID_GRAY);
    doc.text('REFERENCE:', M, 53);
    doc.setFontSize(11);
    C(GREEN);
    doc.text(bookingRef, M + 26, 53);

    // Date — centre
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    C(MID_GRAY);
    doc.text(`Issued: ${currentDate}`, PW / 2, 53, { align: 'center' });

    // Status pill — right
    F(GREEN_LT);
    doc.rect(PW - M - 34, 46, 34, 9, 'F');
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    C(WHITE);
    doc.text('● PENDING REVIEW', PW - M - 17, 52, { align: 'center' });

    let yPos = 68;

    // ═══════════════════════════════════════════════════════════════════
    // HELPERS: section heading + field row
    // ═══════════════════════════════════════════════════════════════════
    /**
     * Draws a compact full-width (or custom-width) section heading band.
     * Returns the y-position after the heading.
     */
    const heading = (title: string, x: number, w: number, y: number): number => {
        F(GREEN);
        doc.rect(x, y, w, 7.5, 'F');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        C(WHITE);
        doc.text(title.toUpperCase(), x + 4, y + 5.2);
        return y + 11;
    };

    /**
     * Renders a label: value row. Skips empty/N/A values.
     * Returns updated y.
     */
    const field = (label: string, value: string, x: number, y: number, maxW: number): number => {
        const v = (value ?? '').trim();
        if (!v || v === 'N/A') return y;

        // Guard page boundary
        if (y > PH - 30) {
            doc.addPage();
            yPos = M;
            hRule(M, 0, PW);
            return M + 8;
        }

        const labelW = 26;
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        C(MID_GRAY);
        doc.text(label + ':', x, y);

        doc.setFont('helvetica', 'normal');
        C(CHARCOAL);
        const lines = doc.splitTextToSize(v, maxW - labelW - 2);
        doc.text(lines, x + labelW, y);
        return y + (lines.length * 4.2) + 1.8;
    };

    // ═══════════════════════════════════════════════════════════════════
    // 3. TWO-COLUMN BLOCK: Guest Profile | Travel Summary
    // ═══════════════════════════════════════════════════════════════════
    const GUTTER = 5;
    const COL_W  = (CW - GUTTER) / 2;   // ~87.5mm each
    const COL2_X = M + COL_W + GUTTER;

    const blockTop = yPos;
    // Background panels
    F(PALE);
    doc.rect(M,      blockTop, COL_W, 58, 'F');
    doc.rect(COL2_X, blockTop, COL_W, 58, 'F');

    let leftY  = heading('Guest Profile',   M,      COL_W, blockTop) + 2;
    let rightY = heading('Travel Summary',  COL2_X, COL_W, blockTop) + 2;

    // ── LEFT: Guest Profile ──────────────────────────────────────────
    const fullName = `${bookingData.firstName ?? ''} ${bookingData.lastName ?? ''}`.trim();
    leftY = field('Name',   fullName,                          M + 3, leftY, COL_W);
    leftY = field('Email',  bookingData.email,                 M + 3, leftY, COL_W);
    leftY = field('Phone',  bookingData.phone,                 M + 3, leftY, COL_W);
    leftY = field('Country', resolveCountry(bookingData.country), M + 3, leftY, COL_W);
    if (bookingData.contactPreference) {
        leftY = field('Contact Via', titleCase(bookingData.contactPreference), M + 3, leftY, COL_W);
    }

    // ── RIGHT: Travel Summary ────────────────────────────────────────
    if (bookingData.safariType) {
        rightY = field('Safari Type', titleCase(bookingData.safariType), COL2_X + 3, rightY, COL_W);
    }
    if (bookingData.travelDate) {
        rightY = field('Travel Date', bookingData.travelDate, COL2_X + 3, rightY, COL_W);
    }
    if (bookingData.duration) {
        rightY = field('Duration', bookingData.duration, COL2_X + 3, rightY, COL_W);
    }

    const paxParts: string[] = [];
    if (bookingData.numberOfPeople) paxParts.push(`${bookingData.numberOfPeople} Adults`);
    if (bookingData.childrenCount && bookingData.childrenCount !== '0') {
        paxParts.push(`${bookingData.childrenCount} Children${bookingData.childAges ? ` (ages ${bookingData.childAges})` : ''}`);
    }
    if (paxParts.length) rightY = field('Group Size', paxParts.join(', '), COL2_X + 3, rightY, COL_W);

    if (bookingData.budget) {
        rightY = field('Budget', `${bookingData.budget} per person`, COL2_X + 3, rightY, COL_W);
    }
    if (bookingData.flexibleDates) {
        rightY = field('Flexible Dates', resolveBoolean(bookingData.flexibleDates), COL2_X + 3, rightY, COL_W);
    }

    // Vertical column divider
    const colBottom = Math.max(leftY, rightY) + 4;
    D(DIVIDER); LW(0.25);
    doc.line(COL2_X - 2.5, blockTop, COL2_X - 2.5, colBottom);

    yPos = colBottom;
    hRule(yPos);
    yPos += 5;

    // ═══════════════════════════════════════════════════════════════════
    // 4. PRICING BREAKDOWN (package bookings only)
    // ═══════════════════════════════════════════════════════════════════
    if (bookingData.basePrice || bookingData.totalPrice) {
        F(PALE);
        doc.rect(M, yPos, CW, 28, 'F');
        yPos = heading('Pricing Breakdown', M, CW, yPos) + 2;

        if (bookingData.basePrice) {
            yPos = field('Base Price', `$${parseInt(bookingData.basePrice).toLocaleString()} per person`, M + 3, yPos, CW);
        }
        if (bookingData.discount && parseInt(bookingData.discount) > 0) {
            yPos = field('Group Discount', `${bookingData.discount}% off`, M + 3, yPos, CW);
        }
        if (bookingData.totalPrice) {
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            C(MID_GRAY);
            doc.text('Estimated Total:', M + 3, yPos);
            doc.setFontSize(10);
            C(GREEN);
            doc.text(`$${parseInt(bookingData.totalPrice).toLocaleString()}`, M + 35, yPos);
            yPos += 6;
        }
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'italic');
        C(MID_GRAY);
        doc.text('Final price subject to availability and confirmation.', M + 3, yPos);
        yPos += 4;
        hRule(yPos);
        yPos += 5;
    }

    // ═══════════════════════════════════════════════════════════════════
    // 5. ROUTING & INTERESTS
    // ═══════════════════════════════════════════════════════════════════
    const hasRouting =
        (bookingData.destinations?.length > 0) ||
        (bookingData.activities?.length > 0) ||
        !!bookingData.accommodationLevel ||
        !!bookingData.vehiclePreference ||
        !!bookingData.pickupLocation ||
        !!bookingData.dropoffLocation;

    if (hasRouting) {
        F(PALE);
        doc.rect(M, yPos, CW, 38, 'F');
        yPos = heading('Routing & Interests', M, CW, yPos) + 2;

        if (bookingData.destinations?.length > 0) {
            yPos = field('Destinations', bookingData.destinations.join(', '), M + 3, yPos, CW);
        }
        if (bookingData.activities?.length > 0) {
            yPos = field('Activities', bookingData.activities.join(', '), M + 3, yPos, CW);
        }
        if (bookingData.accommodationLevel) {
            yPos = field('Accommodation', bookingData.accommodationLevel, M + 3, yPos, CW);
        }
        if (bookingData.vehiclePreference) {
            yPos = field('Vehicle Pref.', bookingData.vehiclePreference, M + 3, yPos, CW);
        }
        if (bookingData.pickupLocation) {
            yPos = field('Pickup', bookingData.pickupLocation, M + 3, yPos, CW);
        }
        if (bookingData.dropoffLocation) {
            yPos = field('Drop-off', bookingData.dropoffLocation, M + 3, yPos, CW);
        }
        yPos += 2;
        hRule(yPos);
        yPos += 5;
    }

    // ═══════════════════════════════════════════════════════════════════
    // 6. ADDITIONAL NOTES
    // ═══════════════════════════════════════════════════════════════════
    const hasDietary  = !!(bookingData.dietaryRequirements?.trim());
    const hasMedical  = !!(bookingData.medicalConditions?.trim());
    const hasSpecial  = !!(bookingData.specialRequests?.trim());
    const hasMessage  = !!(bookingData.message?.trim());
    const hasNotes    = hasDietary || hasMedical || hasSpecial || hasMessage;

    if (hasNotes) {
        F(PALE);
        doc.rect(M, yPos, CW, 35, 'F');
        yPos = heading('Additional Notes', M, CW, yPos) + 2;

        if (hasDietary) {
            yPos = field('Dietary', bookingData.dietaryRequirements, M + 3, yPos, CW);
        }
        if (hasMedical) {
            yPos = field('Medical', bookingData.medicalConditions, M + 3, yPos, CW);
        }
        if (hasSpecial) {
            // Resolve boolean strings ("yes"/"no") — also handles typed text
            yPos = field('Special Requests', resolveBoolean(bookingData.specialRequests), M + 3, yPos, CW);
        }
        if (hasMessage) {
            doc.setFontSize(7.5);
            doc.setFont('helvetica', 'bold');
            C(MID_GRAY);
            doc.text('Message:', M + 3, yPos);
            yPos += 4;
            doc.setFont('helvetica', 'italic');
            C(CHARCOAL);
            const msgLines = doc.splitTextToSize(bookingData.message, CW - 6);
            doc.text(msgLines, M + 3, yPos);
            yPos += msgLines.length * 4 + 3;
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // 7. LOCATION (if captured)
    // ═══════════════════════════════════════════════════════════════════
    if (bookingData.location && (bookingData.location.latitude || bookingData.location.address)) {
        yPos += 2;
        hRule(yPos);
        yPos += 5;
        F(PALE);
        doc.rect(M, yPos, CW, 22, 'F');
        yPos = heading('Submission Location', M, CW, yPos) + 2;

        if (bookingData.location.address) {
            yPos = field('Address', bookingData.location.address, M + 3, yPos, CW);
        }
        if (bookingData.location.latitude && bookingData.location.longitude) {
            const coords = `${bookingData.location.latitude.toFixed(6)}, ${bookingData.location.longitude.toFixed(6)}`;
            yPos = field('Coordinates', coords, M + 3, yPos, CW);
            yPos += 1;
            const mapsUrl = `https://maps.google.com/?q=${bookingData.location.latitude},${bookingData.location.longitude}`;
            doc.setFontSize(7.5);
            doc.setFont('helvetica', 'italic');
            C(GREEN);
            doc.textWithLink('View on Google Maps →', M + 3, yPos, { url: mapsUrl });
            yPos += 5;
        }
        if (bookingData.location.timestamp) {
            yPos = field('Captured', new Date(bookingData.location.timestamp).toLocaleString(), M + 3, yPos, CW);
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // 8. FOOTER — rendered on every page
    // ═══════════════════════════════════════════════════════════════════
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Green accent stripe
        F(GREEN);
        doc.rect(0, PH - 22, PW, 3, 'F');

        // Light footer background
        F(PALE);
        doc.rect(0, PH - 19, PW, 19, 'F');

        // Brand name — left
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        C(GREEN);
        doc.text('SENZA LUCE SAFARIS', M, PH - 11);

        // Contact details — centre
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        C(MID_GRAY);
        doc.text(
            '+255 629 123 246  ·  info@senzalucesafaris.com  ·  www.senzalucesafaris.com',
            PW / 2, PH - 11, { align: 'center' },
        );

        // Page number — right
        doc.text(`Page ${i} of ${totalPages}`, PW - M, PH - 11, { align: 'right' });

        // Tagline — bottom left
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'italic');
        C(MID_GRAY);
        doc.text('Authentic Tanzanian Safari Experiences Since 2010', M, PH - 4);
    }

    // ═══════════════════════════════════════════════════════════════════
    // SAVE
    // ═══════════════════════════════════════════════════════════════════
    const fileName = `Senza-Luce-Inquiry-${bookingData.firstName}-${bookingData.lastName}.pdf`;
    doc.save(fileName);
    return { bookingRef, fileName };
}
