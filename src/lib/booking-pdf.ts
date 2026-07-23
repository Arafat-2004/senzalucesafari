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
    return val;
};

const titleCase = (s: string): string =>
    s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

// ─── Main export ──────────────────────────────────────────────────────────────
export function generateBookingPDF(bookingData: BookingData, shouldSave = true) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const PW = doc.internal.pageSize.getWidth();   // 210mm
    const PH = doc.internal.pageSize.getHeight();  // 297mm
    const M  = 16;                                  // elegant margins (16mm)
    const CW = PW - M * 2;                          // content width = 178mm

    // ── BRAND COLOR PALETTE (LUXURY EDITORIAL) ──────────────────────────────────
    type RGB = [number, number, number];
    const DEEP_FOREST: RGB = [12,  35,  23];    // primary luxury forest green
    const BRONZE_GOLD: RGB = [181, 137,  62];   // brand gold/bronze
    const BRONZE_LT:   RGB = [247, 243, 235];   // ivory/light bronze tint
    const CHARCOAL:    RGB = [44,  48,  45];    // high-contrast dark body text
    const MUTED_GRAY:  RGB = [115, 125, 118];   // labels / minor text
    const WARM_CREAM:  RGB = [253, 252, 250];   // soft premium page section fill
    const GOLD_LINE:   RGB = [212, 194, 163];   // gold hairline borders
    const WHITE:       RGB = [255, 255, 255];
    const PENDING_BG:  RGB = [254, 242, 242];   // light red/rose for pending
    const PENDING_TXT: RGB = [185,  28,  28];   // dark red for pending status

    // ── SETTERS HELPERS ────────────────────────────────────────────────────────
    const C  = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);
    const F  = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
    const D  = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);
    const LW = (w: number) => doc.setLineWidth(w);

    const hRule = (y: number, x = M, w = CW, color = GOLD_LINE, thickness = 0.25) => {
        D(color); LW(thickness);
        doc.line(x, y, x + w, y);
    };

    const bookingRef = `SLS-${Date.now().toString().slice(-8)}`;
    const currentDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
    });

    // ═══════════════════════════════════════════════════════════════════
    // 1. TOP BRAND ACCENT STRIPE & HEADER
    // ═══════════════════════════════════════════════════════════════════
    // Brand Top Accent Stripe (Green)
    F(DEEP_FOREST);
    doc.rect(0, 0, PW, 3.5, 'F');

    // Brand Top Sub-Accent Stripe (Gold)
    F(BRONZE_GOLD);
    doc.rect(0, 3.5, PW, 1.2, 'F');

    // Logo & Letterhead - Left
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    C(DEEP_FOREST);
    doc.text('SENZA LUCE', M, 18);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    C(BRONZE_GOLD);
    doc.text('S A F A R I S', M, 24);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    C(MUTED_GRAY);
    doc.text('Tanzania Safari Specialists  ·  Est. 2022', M, 30);

    // Luxury Document Type Badge - Right
    F(BRONZE_LT);
    D(BRONZE_GOLD);
    LW(0.3);
    doc.rect(PW - M - 48, 10, 48, 22, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    C(DEEP_FOREST);
    doc.text('INQUIRY', PW - M - 24, 18, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    C(BRONZE_GOLD);
    doc.text('CONFIRMATION', PW - M - 24, 24, { align: 'center' });

    // ═══════════════════════════════════════════════════════════════════
    // 2. REFERENCE & METADATA BAR
    // ═══════════════════════════════════════════════════════════════════
    const metaY = 36;
    F(WARM_CREAM);
    D(GOLD_LINE);
    LW(0.25);
    doc.rect(M, metaY, CW, 14, 'FD');

    // Ref No
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    C(MUTED_GRAY);
    doc.text('INQUIRY REF:', M + 4, metaY + 8.5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    C(DEEP_FOREST);
    doc.text(bookingRef, M + 28, metaY + 8.5);

    // Date
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    C(MUTED_GRAY);
    doc.text(`Issued: ${currentDate}`, PW / 2, metaY + 8.5, { align: 'center' });

    // Status Pill Badge (Pending Review)
    F(PENDING_BG);
    doc.rect(PW - M - 35, metaY + 3.5, 31, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    C(PENDING_TXT);
    doc.text('● PENDING REVIEW', PW - M - 19.5, metaY + 8.2, { align: 'center' });

    let yPos = 57;

    // ═══════════════════════════════════════════════════════════════════
    // SECTIONS & LAYOUT UTILITIES
    // ═══════════════════════════════════════════════════════════════════
    /**
     * Renders a highly polished section heading with a thin gold accent bar.
     */
    const renderSectionHeader = (title: string, x: number, w: number, y: number): number => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        C(DEEP_FOREST);
        doc.text(title.toUpperCase(), x + 1, y + 4);
        
        // Underline accent in gold
        hRule(y + 6.5, x, 14, BRONZE_GOLD, 0.7);
        
        return y + 10;
    };

    /**
     * Renders label/value pairs inside styled summary panels.
     */
    const renderField = (label: string, value: string, x: number, y: number, maxW: number): number => {
        const valText = (value ?? '').trim();
        if (!valText || valText === 'N/A') return y;

        if (y > PH - 30) {
            doc.addPage();
            yPos = M + 8;
            hRule(M, 0, PW);
            return M + 15;
        }

        const labelWidth = 24;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        C(MUTED_GRAY);
        doc.text(label + ':', x, y);

        doc.setFont('helvetica', 'normal');
        C(CHARCOAL);
        const lines = doc.splitTextToSize(valText, maxW - labelWidth - 2);
        doc.text(lines, x + labelWidth, y);
        return y + (lines.length * 4.2) + 1.6;
    };

    // ═══════════════════════════════════════════════════════════════════
    // 3. TWO-COLUMN DETAILS: Guest Profile & Travel Summary
    // ═══════════════════════════════════════════════════════════════════
    const GUTTER = 6;
    const COL_W  = (CW - GUTTER) / 2;
    const COL2_X = M + COL_W + GUTTER;

    const blockTop = yPos;
    const boxHeight = 58;

    // Soft warm borders around panels
    F(WARM_CREAM);
    D(GOLD_LINE);
    LW(0.25);
    doc.rect(M,      blockTop, COL_W, boxHeight, 'FD');
    doc.rect(COL2_X, blockTop, COL_W, boxHeight, 'FD');

    let leftY  = renderSectionHeader('Guest Profile',   M + 3,      COL_W - 6, blockTop + 3);
    let rightY = renderSectionHeader('Travel Summary',  COL2_X + 3, COL_W - 6, blockTop + 3);

    // Left Column Fields
    const fullName = `${bookingData.firstName ?? ''} ${bookingData.lastName ?? ''}`.trim();
    leftY = renderField('Name', fullName, M + 6, leftY, COL_W - 6);
    leftY = renderField('Email', bookingData.email, M + 6, leftY, COL_W - 6);
    leftY = renderField('Phone', bookingData.phone, M + 6, leftY, COL_W - 6);
    leftY = renderField('Country', resolveCountry(bookingData.country), M + 6, leftY, COL_W - 6);
    if (bookingData.contactPreference) {
        leftY = renderField('Contact Via', titleCase(bookingData.contactPreference), M + 6, leftY, COL_W - 6);
    }

    // Right Column Fields
    if (bookingData.safariType) {
        rightY = renderField('Safari Type', titleCase(bookingData.safariType), COL2_X + 6, rightY, COL_W - 6);
    }
    if (bookingData.travelDate) {
        rightY = renderField('Travel Date', bookingData.travelDate, COL2_X + 6, rightY, COL_W - 6);
    }
    if (bookingData.duration) {
        rightY = renderField('Duration', bookingData.duration, COL2_X + 6, rightY, COL_W - 6);
    }

    const paxParts: string[] = [];
    if (bookingData.numberOfPeople) paxParts.push(`${bookingData.numberOfPeople} Adults`);
    if (bookingData.childrenCount && bookingData.childrenCount !== '0') {
        paxParts.push(`${bookingData.childrenCount} Children${bookingData.childAges ? ` (ages ${bookingData.childAges})` : ''}`);
    }
    if (paxParts.length) {
        rightY = renderField('Group Size', paxParts.join(', '), COL2_X + 6, rightY, COL_W - 6);
    }

    if (bookingData.budget) {
        rightY = renderField('Budget', `$${parseInt(bookingData.budget).toLocaleString()} per person`, COL2_X + 6, rightY, COL_W - 6);
    }
    if (bookingData.flexibleDates) {
        rightY = renderField('Flexible', resolveBoolean(bookingData.flexibleDates), COL2_X + 6, rightY, COL_W - 6);
    }

    yPos = blockTop + boxHeight + 8;

    // ═══════════════════════════════════════════════════════════════════
    // 4. PRICING BREAKDOWN PANEL
    // ═══════════════════════════════════════════════════════════════════
    if (bookingData.basePrice || bookingData.totalPrice) {
        const pricingHeight = 32;
        F(WARM_CREAM);
        D(GOLD_LINE);
        LW(0.25);
        doc.rect(M, yPos, CW, pricingHeight, 'FD');

        let priceY = renderSectionHeader('Pricing Structure', M + 3, CW - 6, yPos + 3);

        if (bookingData.basePrice) {
            priceY = renderField('Base Rate', `$${parseInt(bookingData.basePrice).toLocaleString()} per person`, M + 6, priceY, CW - 6);
        }
        if (bookingData.discount && parseInt(bookingData.discount) > 0) {
            priceY = renderField('Discount', `${bookingData.discount}% Off`, M + 6, priceY, CW - 6);
        }
        if (bookingData.totalPrice) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            C(MUTED_GRAY);
            doc.text('ESTIMATED TOTAL:', M + 6, priceY + 0.5);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            C(DEEP_FOREST);
            doc.text(`$${parseInt(bookingData.totalPrice).toLocaleString()}`, M + 34, priceY + 0.5);
            
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(6.5);
            C(MUTED_GRAY);
            doc.text('Rates are subject to seasonal availability & final confirmation.', PW - M - 76, priceY + 0.2);
        }

        yPos += pricingHeight + 8;
    }

    // ═══════════════════════════════════════════════════════════════════
    // 5. ROUTING & LOGISTICS
    // ═══════════════════════════════════════════════════════════════════
    const hasRouting =
        (bookingData.destinations?.length > 0) ||
        (bookingData.activities?.length > 0) ||
        !!bookingData.accommodationLevel ||
        !!bookingData.vehiclePreference ||
        !!bookingData.pickupLocation ||
        !!bookingData.dropoffLocation;

    if (hasRouting) {
        const routingHeight = 38;
        F(WARM_CREAM);
        D(GOLD_LINE);
        LW(0.25);
        doc.rect(M, yPos, CW, routingHeight, 'FD');

        let routeY = renderSectionHeader('Routing & Interests', M + 3, CW - 6, yPos + 3);

        if (bookingData.destinations?.length > 0) {
            routeY = renderField('Destinations', bookingData.destinations.join(', '), M + 6, routeY, CW - 6);
        }
        if (bookingData.activities?.length > 0) {
            routeY = renderField('Activities', bookingData.activities.join(', '), M + 6, routeY, CW - 6);
        }
        if (bookingData.accommodationLevel) {
            routeY = renderField('Lodging Preference', titleCase(bookingData.accommodationLevel), M + 6, routeY, CW - 6);
        }
        if (bookingData.vehiclePreference) {
            routeY = renderField('Vehicle Class', titleCase(bookingData.vehiclePreference), M + 6, routeY, CW - 6);
        }
        if (bookingData.pickupLocation) {
            routeY = renderField('Pickup Spot', bookingData.pickupLocation, M + 6, routeY, CW - 6);
        }
        if (bookingData.dropoffLocation) {
            routeY = renderField('Drop-off Spot', bookingData.dropoffLocation, M + 6, routeY, CW - 6);
        }

        yPos += routingHeight + 8;
    }

    // ═══════════════════════════════════════════════════════════════════
    // 6. SPECIAL CONDITIONS & GUEST NOTES
    // ═══════════════════════════════════════════════════════════════════
    const hasDietary  = !!(bookingData.dietaryRequirements?.trim());
    const hasMedical  = !!(bookingData.medicalConditions?.trim());
    const hasSpecial  = !!(bookingData.specialRequests?.trim());
    const hasMessage  = !!(bookingData.message?.trim());
    const hasNotes    = hasDietary || hasMedical || hasSpecial || hasMessage;

    if (hasNotes) {
        const notesHeight = 38;
        F(WARM_CREAM);
        D(GOLD_LINE);
        LW(0.25);
        doc.rect(M, yPos, CW, notesHeight, 'FD');

        let notesY = renderSectionHeader('Special Requirements & Message', M + 3, CW - 6, yPos + 3);

        if (hasDietary) {
            notesY = renderField('Dietary Needs', bookingData.dietaryRequirements, M + 6, notesY, CW - 6);
        }
        if (hasMedical) {
            notesY = renderField('Medical Conditions', bookingData.medicalConditions, M + 6, notesY, CW - 6);
        }
        if (hasSpecial) {
            notesY = renderField('Special Requests', resolveBoolean(bookingData.specialRequests), M + 6, notesY, CW - 6);
        }
        if (hasMessage) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            C(MUTED_GRAY);
            doc.text('Message:', M + 6, notesY);
            
            doc.setFont('helvetica', 'italic');
            C(CHARCOAL);
            const msgLines = doc.splitTextToSize(bookingData.message, CW - 12);
            doc.text(msgLines, M + 6, notesY + 3.8);
        }

        yPos += notesHeight + 8;
    }

    // ═══════════════════════════════════════════════════════════════════
    // 7. LOCATION TELEMETRY
    // ═══════════════════════════════════════════════════════════════════
    if (bookingData.location && (bookingData.location.latitude || bookingData.location.address)) {
        if (yPos > PH - 35) {
            doc.addPage();
            yPos = M + 8;
        }

        const telemetryHeight = 24;
        F(WARM_CREAM);
        D(GOLD_LINE);
        LW(0.25);
        doc.rect(M, yPos, CW, telemetryHeight, 'FD');

        let geoY = renderSectionHeader('Submission Source Coordinates', M + 3, CW - 6, yPos + 3);

        if (bookingData.location.address) {
            geoY = renderField('Address', bookingData.location.address, M + 6, geoY, CW - 6);
        }
        if (bookingData.location.latitude && bookingData.location.longitude) {
            const coords = `${bookingData.location.latitude.toFixed(6)}, ${bookingData.location.longitude.toFixed(6)}`;
            geoY = renderField('GPS Coordinates', coords, M + 6, geoY, CW - 6);
            
            const mapsUrl = `https://maps.google.com/?q=${bookingData.location.latitude},${bookingData.location.longitude}`;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            C(DEEP_FOREST);
            doc.textWithLink('View Maps Location →', M + 6, geoY + 0.5, { url: mapsUrl });
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // 8. LUXURY FOOTER BRANDING (Rendered on all generated pages)
    // ═══════════════════════════════════════════════════════════════════
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Thin forest green divider accent line at bottom
        F(DEEP_FOREST);
        doc.rect(0, PH - 21.5, PW, 1.5, 'F');

        // Gold divider accent line underneath
        F(BRONZE_GOLD);
        doc.rect(0, PH - 20, PW, 0.4, 'F');

        // Warm Cream Footer Bar background
        F(WARM_CREAM);
        doc.rect(0, PH - 19.6, PW, 19.6, 'F');

        // Brand Name - Left
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        C(DEEP_FOREST);
        doc.text('SENZA LUCE SAFARIS', M, PH - 11);

        // Subdued tagline
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(6.5);
        C(MUTED_GRAY);
        doc.text('Authentic Tanzanian Safari Experiences Since 2022', M, PH - 5); // CHANGED 2010 to 2022!

        // Contact particulars - Centre
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        C(CHARCOAL);
        doc.text(
            '+255 629 123 246  ·  info@senzalucesafaris.com  ·  www.senzalucesafaris.com',
            PW / 2, PH - 11, { align: 'center' },
        );

        // Page Numbering - Right
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        C(MUTED_GRAY);
        doc.text(`Page ${i} of ${totalPages}`, PW - M, PH - 11, { align: 'right' });
    }

    // ═══════════════════════════════════════════════════════════════════
    // SAVE AND TRANSMIT
    // ═══════════════════════════════════════════════════════════════════
    const fileName = `Senza-Luce-Inquiry-${bookingData.firstName}-${bookingData.lastName}.pdf`;
    if (shouldSave) {
        doc.save(fileName);
    }
    return { bookingRef, fileName, doc };
}
