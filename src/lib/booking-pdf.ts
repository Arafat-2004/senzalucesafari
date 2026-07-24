import jsPDF from 'jspdf';

export interface BookingData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    country?: string;
    contactPreference?: string;
    safariType?: string;
    destinations?: string[];
    flexibleDates?: string;
    numberOfPeople?: string | number;
    childrenCount?: string | number;
    childAges?: string;
    travelDate?: string | Date;
    endDate?: string | Date;
    duration?: string;
    accommodationLevel?: string;
    vehiclePreference?: string;
    activities?: string[];
    budget?: string;
    paymentPreference?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    dietaryRequirements?: string;
    medicalConditions?: string;
    message?: string;
    specialRequests?: string;
    
    // Package-specific pricing and database metadata
    bookingRef?: string;
    status?: string;
    tourName?: string;
    tourSlug?: string;
    basePrice?: string | number;
    totalPrice?: string | number;
    discount?: string | number;
    depositPaid?: string | number;
    paymentStatus?: string;
    currency?: string;
    guideName?: string;
    vehicleName?: string;
    createdAt?: string | Date;
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

const resolveCountry = (code: string | undefined): string => {
    if (!code) return '';
    const upper = code.trim().toUpperCase();
    return COUNTRY_NAMES[upper] ?? code; // graceful fallback to raw value
};

const titleCase = (s: string | undefined): string =>
    s ? s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '';

const formatDate = (d: string | Date | undefined): string => {
    if (!d) return 'TBD';
    try {
        const dateObj = typeof d === 'string' ? new Date(d) : d;
        if (isNaN(dateObj.getTime())) return String(d);
        return dateObj.toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    } catch {
        return String(d);
    }
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = src;
    });
};

export async function generateBookingPDF(bookingData: BookingData, shouldSave = true) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const PW = doc.internal.pageSize.getWidth();   // 210mm
    const PH = doc.internal.pageSize.getHeight();  // 297mm
    const M  = 20;                                  // clean premium margins (20mm)
    const CW = PW - M * 2;                          // content width = 170mm

    // ── BRAND COLOR PALETTE (LUXURY EDITORIAL) ──────────────────────────────────
    type RGB = [number, number, number];
    const DEEP_FOREST: RGB = [12, 35, 23];      // Primary luxury brand forest green
    const BRONZE_GOLD: RGB = [181, 137, 62];    // Brand gold/bronze
    const CHARCOAL:    RGB = [44, 48, 45];      // Body text
    const MUTED_GRAY:  RGB = [115, 125, 118];   // Subdued metadata labels
    const WARM_CREAM:  RGB = [252, 250, 246];   // Elegant panel background fill
    const GOLD_LINE:   RGB = [230, 222, 208];   // Divider lines
    const WHITE:       RGB = [255, 255, 255];

    // Status Badge colors
    const STATUS_PALETTES: Record<string, { bg: RGB, txt: RGB }> = {
        CONFIRMED: { bg: [240, 253, 244], txt: [21, 128, 61] }, // elegant green
        COMPLETED: { bg: [240, 249, 255], txt: [3, 105, 161] }, // elegant blue
        PENDING:   { bg: [255, 251, 235], txt: [180, 83, 9] },  // elegant amber
        CANCELLED: { bg: [254, 242, 242], txt: [185, 28, 28] }, // elegant red
    };

    // ── SETTERS HELPERS ────────────────────────────────────────────────────────
    const C  = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);
    const F  = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
    const D  = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);
    const LW = (w: number) => doc.setLineWidth(w);

    const hRule = (y: number, x = M, w = CW, color = GOLD_LINE, thickness = 0.2) => {
        D(color); LW(thickness);
        doc.line(x, y, x + w, y);
    };

    // ─── BOOKING REFERENCE & STATUS NORMALIZATION ──────────────────────────────
    const rawStatus = (bookingData.status || 'PENDING').toUpperCase();
    const statusVal = ['CONFIRMED', 'COMPLETED', 'PENDING', 'CANCELLED'].includes(rawStatus) ? rawStatus : 'PENDING';
    const isConfirmed = statusVal === 'CONFIRMED' || statusVal === 'COMPLETED';

    const bookingRef = bookingData.bookingRef || `SLS-${Date.now().toString().slice(-8).toUpperCase()}`;
    const docTitle = isConfirmed ? 'BOOKING CONFIRMATION' : 'INQUIRY CONFIRMATION';

    let yPos = 20;

    // 1. TOP BRAND ACCENT BAR
    F(DEEP_FOREST);
    doc.rect(0, 0, PW, 4, 'F');
    F(BRONZE_GOLD);
    doc.rect(0, 4, PW, 1.2, 'F');

    yPos = 18;

    // 2. HEADER LOGO & LETTERHEAD
    let logoLoaded = false;
    try {
        const logoImg = await loadImage('/icons/icon-192x192.png');
        doc.addImage(logoImg, 'PNG', M, yPos, 22, 22);
        logoLoaded = true;
    } catch {
        // typographic fallback
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        C(DEEP_FOREST);
        doc.text('SENZA LUCE', M, yPos + 10);
        doc.setFontSize(7.5);
        C(BRONZE_GOLD);
        doc.text('S A F A R I', M, yPos + 15);
    }

    // Company coordinates (Top Right)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    C(DEEP_FOREST);
    doc.text('SENZA LUCE SAFARI', PW - M, yPos + 2, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    C(CHARCOAL);
    doc.text([
        'Arusha, Tanzania',
        'info@senzalucesafari.com',
        '+255 629 123 246',
        'www.senzalucesafari.com'
    ], PW - M, yPos + 7, { align: 'right' });

    yPos += logoLoaded ? 28 : 22;

    // Elegant Divider Line
    hRule(yPos, M, CW, BRONZE_GOLD, 0.4);
    yPos += 8;

    // 3. DOCUMENT METADATA BLOCK
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    C(DEEP_FOREST);
    doc.text(docTitle, M, yPos);

    // Metadata Details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    C(MUTED_GRAY);
    doc.text('REFERENCE NUMBER', PW - M - 75, yPos - 3);
    C(CHARCOAL);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(bookingRef, PW - M - 75, yPos + 2.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    C(MUTED_GRAY);
    doc.text('DATE ISSUED', PW - M - 30, yPos - 3);
    C(CHARCOAL);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(formatDate(bookingData.createdAt || new Date()), PW - M - 30, yPos + 2.5);

    // Status Badge
    const palette = STATUS_PALETTES[statusVal];
    F(palette.bg);
    doc.rect(PW - M - 20, yPos - 7, 20, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    C(palette.txt);
    doc.text(statusVal, PW - M - 10, yPos - 2, { align: 'center' });

    yPos += 12;

    // Helper: Page boundary checking
    const ensureSpace = (needed: number) => {
        if (yPos + needed > PH - 25) {
            doc.addPage();
            // Top branding lines on new page
            F(DEEP_FOREST);
            doc.rect(0, 0, PW, 4, 'F');
            F(BRONZE_GOLD);
            doc.rect(0, 4, PW, 1.2, 'F');
            yPos = 20;
            return true;
        }
        return false;
    };

    // Helper: Section Title
    const drawSectionTitle = (title: string) => {
        ensureSpace(14);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        C(DEEP_FOREST);
        doc.text(title.toUpperCase(), M, yPos);
        hRule(yPos + 2.5, M, CW, BRONZE_GOLD, 0.4);
        yPos += 8;
    };

    // Helper: Field grid rendering
    const drawFieldGrid = (fields: Array<{ label: string, value: string | undefined }>, colCount = 2, colWidth = CW / 2) => {
        ensureSpace(Math.ceil(fields.length / colCount) * 8);
        
        const localY = yPos;
        fields.forEach((field, index) => {
            const colIdx = index % colCount;
            const rowIdx = Math.floor(index / colCount);
            const x = M + colIdx * colWidth;
            const y = localY + rowIdx * 8;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            C(MUTED_GRAY);
            doc.text(field.label + ':', x, y);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            C(CHARCOAL);
            
            const wrappedValue = doc.splitTextToSize(field.value || 'N/A', colWidth - 25);
            doc.text(wrappedValue, x + 22, y);
        });

        yPos += Math.ceil(fields.length / colCount) * 8 + 4;
    };

    // ─── SECTION 1: GUEST PROFILE ──────────────────────────────────────────────
    drawSectionTitle('Guest Profile');
    const guestFields = [
        { label: 'Full Name', value: `${bookingData.firstName || ''} ${bookingData.lastName || ''}`.trim() || 'Guest' },
        { label: 'Email Address', value: bookingData.email || '' },
        { label: 'Phone Number', value: bookingData.phone || '' },
        { label: 'Country', value: resolveCountry(bookingData.country) }
    ];
    
    const adults = Number(bookingData.numberOfPeople) || 1;
    const kids = Number(bookingData.childrenCount) || 0;
    const sizeStr = `${adults} Adult${adults > 1 ? 's' : ''}${kids > 0 ? `, ${kids} Child${kids > 1 ? 'ren' : ''}` : ''}`;
    guestFields.push({ label: 'Group Size', value: sizeStr });

    if (bookingData.contactPreference) {
        guestFields.push({ label: 'Contact Via', value: titleCase(bookingData.contactPreference) });
    }

    drawFieldGrid(guestFields, 2, CW / 2);

    // ─── SECTION 2: SAFARI SPECIFICATIONS ──────────────────────────────────────
    drawSectionTitle('Safari Specifications');
    const specFields = [
        { label: 'Safari Package', value: bookingData.tourName || 'Tailor-made Custom Safari' },
        { label: 'Duration', value: bookingData.duration || 'Flexible' },
        { label: 'Start Date', value: formatDate(bookingData.travelDate) },
        { label: 'End Date', value: formatDate(bookingData.endDate) },
        { label: 'Lodging Class', value: titleCase(bookingData.accommodationLevel) || 'Mid-range' }
    ];

    if (bookingData.destinations && bookingData.destinations.length > 0) {
        specFields.push({ label: 'Destinations', value: bookingData.destinations.join(', ') });
    }
    if (bookingData.vehicleName) {
        specFields.push({ label: 'Transport', value: bookingData.vehicleName });
    } else if (bookingData.vehiclePreference) {
        specFields.push({ label: 'Transport', value: titleCase(bookingData.vehiclePreference) });
    }
    if (bookingData.guideName) {
        specFields.push({ label: 'Private Guide', value: bookingData.guideName });
    }

    drawFieldGrid(specFields, 2, CW / 2);

    // Special Requests / Notes Block if any
    const requests = (bookingData.specialRequests || '').trim();
    if (requests && requests !== 'N/A') {
        ensureSpace(18);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        C(MUTED_GRAY);
        doc.text('Special Requests / Notes:', M, yPos);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        C(CHARCOAL);
        const wrappedReq = doc.splitTextToSize(requests, CW);
        doc.text(wrappedReq, M, yPos + 4.5);
        yPos += (wrappedReq.length * 4) + 6;
    }

    // ─── SECTION 3: COST & PAYMENT SCHEDULE ──────────────────────────────────
    if (bookingData.totalPrice) {
        drawSectionTitle('Cost Summary');
        ensureSpace(40);

        // Header row
        F(WARM_CREAM);
        doc.rect(M, yPos, CW, 7, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        C(DEEP_FOREST);
        doc.text('Service & Travel Plan Description', M + 4, yPos + 4.8);
        doc.text('Quantity', M + 95, yPos + 4.8, { align: 'right' });
        doc.text('Rate', M + 130, yPos + 4.8, { align: 'right' });
        doc.text('Subtotal', M + 166, yPos + 4.8, { align: 'right' });

        hRule(yPos + 7, M, CW, BRONZE_GOLD, 0.35);

        yPos += 7;

        // Line Item Row
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        C(CHARCOAL);
        const descText = bookingData.tourName || 'Tanzania Custom Safari Package';
        const wrappedDesc = doc.splitTextToSize(`${descText} (${titleCase(bookingData.accommodationLevel) || 'Mid-range'} Class)`, 80);
        doc.text(wrappedDesc, M + 4, yPos + 5.5);

        const qty = bookingData.numberOfPeople || 1;
        const rate = bookingData.basePrice ? Number(bookingData.basePrice) : (Number(bookingData.totalPrice) / Number(qty));
        const sub = Number(bookingData.totalPrice);

        doc.text(String(qty), M + 95, yPos + 5.5, { align: 'right' });
        doc.text(`$${rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, M + 130, yPos + 5.5, { align: 'right' });
        doc.text(`$${sub.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, M + 166, yPos + 5.5, { align: 'right' });

        yPos += Math.max(wrappedDesc.length * 4.5, 8);
        hRule(yPos, M, CW, GOLD_LINE, 0.2);

        // Summary details
        yPos += 4;
        const deposit = Number(bookingData.depositPaid || 0);
        const discount = Number(bookingData.discount || 0);
        const total = sub - discount;
        const outstanding = total - deposit;

        const summaryLabels: Array<{ label: string; val: string; highlight?: boolean }> = [
            { label: 'Subtotal Amount', val: `$${sub.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }
        ];
        if (discount > 0) {
            summaryLabels.push({ label: 'Discount Applied', val: `-$${discount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` });
        }
        summaryLabels.push(
            { label: 'Total Safari Value', val: `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
            { label: 'Deposit Paid', val: `-$${deposit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
            { label: 'Outstanding Balance', val: `$${outstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, highlight: true }
        );

        summaryLabels.forEach((item) => {
            doc.setFont('helvetica', item.highlight ? 'bold' : 'normal');
            doc.setFontSize(item.highlight ? 9.5 : 8);
            C(item.highlight ? DEEP_FOREST : CHARCOAL);
            doc.text(item.label + ':', PW - M - 68, yPos + 2.5);
            doc.text(item.val, PW - M - 4, yPos + 2.5, { align: 'right' });
            yPos += item.highlight ? 6.5 : 4.5;
        });

        yPos += 4;
    }

    // ─── SECTION 4: TRAVEL ADVISORY & NOTES ───────────────────────────────────
    ensureSpace(34);
    drawSectionTitle('Important Travel Information');
    
    F(WARM_CREAM);
    D(GOLD_LINE);
    LW(0.25);
    doc.rect(M, yPos, CW, 26, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    C(DEEP_FOREST);
    doc.text('TRAVEL REQUIREMENTS', M + 4, yPos + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    C(CHARCOAL);
    doc.text([
        '• Passports must be valid for at least 6 months from your travel dates.',
        '• Yellow Fever vaccination card is required for entry into Tanzania.',
        '• Visas can be applied online or purchased upon arrival at airport ports.'
    ], M + 4, yPos + 9);

    // Column divider line
    D(GOLD_LINE);
    LW(0.2);
    doc.line(PW / 2 + 10, yPos + 2, PW / 2 + 10, yPos + 24);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    C(DEEP_FOREST);
    doc.text('CANCELLATION POLICY', PW / 2 + 14, yPos + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    C(CHARCOAL);
    doc.text([
        '• Cancellations 60+ days: refund minus 10% administrative fee.',
        '• Cancellations 30-59 days: 50% cancellation surcharge applies.',
        '• Cancellations <30 days: 100% cancellation charges apply.'
    ], PW / 2 + 14, yPos + 9);

    yPos += 32;

    // ─── FOOTER ON ALL PAGES ──────────────────────────────────────────────────
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
        doc.text('SENZA LUCE SAFARI', M, PH - 11);

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(6.5);
        C(MUTED_GRAY);
        doc.text('Authentic Tanzanian Safari Experiences', M, PH - 5);

        // Contact particulars - Centre
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        C(CHARCOAL);
        doc.text(
            '+255 629 123 246  ·  info@senzalucesafari.com  ·  www.senzalucesafari.com',
            PW / 2, PH - 11, { align: 'center' },
        );

        // Page Numbering - Right
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        C(MUTED_GRAY);
        doc.text(`Page ${i} of ${totalPages}`, PW - M, PH - 11, { align: 'right' });
    }

    // ─── SAVE AND TRANSMIT ────────────────────────────────────────────────────
    const safeGuestName = `${bookingData.firstName || 'Guest'}_${bookingData.lastName || ''}`.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `Senza_Luce_Safari_Confirmation_${bookingRef}_${safeGuestName}.pdf`;
    
    if (shouldSave) {
        doc.save(fileName);
    }
    return { bookingRef, fileName, doc };
}
