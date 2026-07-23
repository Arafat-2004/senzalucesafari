"use client";

import { Vehicle } from "../types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Brand color palette (matches booking-pdf.ts exactly) ────────────────────
type RGB = [number, number, number];
const DEEP_FOREST: RGB = [12,  35,  23];    // primary luxury forest green
const BRONZE_GOLD: RGB = [181, 137,  62];   // brand gold/bronze
const BRONZE_LT:   RGB = [247, 243, 235];   // ivory/light bronze tint
const CHARCOAL:    RGB = [44,  48,  45];    // high-contrast dark body text
const MUTED_GRAY:  RGB = [115, 125, 118];   // labels / minor text
const WARM_CREAM:  RGB = [253, 252, 250];   // soft premium page section fill
const GOLD_LINE:   RGB = [212, 194, 163];   // gold hairline borders
const WHITE:       RGB = [255, 255, 255];
const GREEN_LT:    RGB = [45, 118,  65];

export const generateVehiclePDF = (vehicle: Vehicle) => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const PW = doc.internal.pageSize.getWidth();
    const PH = doc.internal.pageSize.getHeight();
    const M  = 16;
    const CW = PW - M * 2;

    const C  = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);
    const F  = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
    const D  = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);
    const LW = (w: number) => doc.setLineWidth(w);
    const hRule = (y: number, x = M, w = CW, color = GOLD_LINE, thickness = 0.25) => {
        D(color); LW(thickness);
        doc.line(x, y, x + w, y);
    };

    const refNum = `SLS-VEH-${vehicle.id}`;
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
    doc.text('Tanzania Safari Specialists  ·  Est. 2022', M, 30); // CHANGED 2010 to 2022!

    // Luxury Document Type Badge - Right
    F(BRONZE_LT);
    D(BRONZE_GOLD);
    LW(0.3);
    doc.rect(PW - M - 48, 10, 48, 22, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    C(DEEP_FOREST);
    doc.text('VEHICLE', PW - M - 24, 16, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    C(BRONZE_GOLD);
    doc.text('SPEC SHEET', PW - M - 24, 22, { align: 'center' });

    // ═══════════════════════════════════════════════════════════════════
    // 2. VEHICLE IDENTITY BAR
    // ═══════════════════════════════════════════════════════════════════
    const identityY = 36;
    F(WARM_CREAM);
    D(GOLD_LINE);
    LW(0.25);
    doc.rect(M, identityY, CW, 18, 'FD');

    // Vehicle name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    C(DEEP_FOREST);
    doc.text(vehicle.name, M + 4, identityY + 7.5);

    // Category tag
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    C(BRONZE_GOLD);
    doc.text(vehicle.category, M + 4, identityY + 13);

    // Ref & date — right
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    C(MUTED_GRAY);
    doc.text(`Reference: ${refNum}`, PW - M - 4, identityY + 6.5, { align: 'right' });
    doc.text(`Generated: ${currentDate}`, PW - M - 4, identityY + 12.5, { align: 'right' });

    // ═══════════════════════════════════════════════════════════════════
    // 3. KEY STATS ROW (capacity · rating · price range)
    // ═══════════════════════════════════════════════════════════════════
    const STAT_W = CW / 3;
    const stats = [
        { label: 'Capacity',    value: `${vehicle.capacity} Passengers` },
        { label: 'Rating',      value: `${vehicle.rating}/5.0 ★ (${vehicle.reviews} reviews)` },
        { label: 'Price Range', value: vehicle.priceRange },
    ];

    let statY = 59;
    stats.forEach((s, i) => {
        const x = M + i * STAT_W;
        F(WARM_CREAM);
        D(GOLD_LINE);
        LW(0.25);
        doc.rect(x, statY, STAT_W - 1, 14, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        C(MUTED_GRAY);
        doc.text(s.label.toUpperCase(), x + 4, statY + 5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        C(i === 2 ? BRONZE_GOLD : DEEP_FOREST);
        doc.text(s.value, x + 4, statY + 10.5);
    });

    let yPos = statY + 19;

    // ═══════════════════════════════════════════════════════════════════
    // SECTION HEADING HELPER
    // ═══════════════════════════════════════════════════════════════════
    const sectionBand = (title: string, y: number): number => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        C(DEEP_FOREST);
        doc.text(title.toUpperCase(), M + 1, y + 4);
        
        // Underline accent in gold
        hRule(y + 6, M, CW, BRONZE_GOLD, 0.7);
        
        return y + 9;
    };

    // ═══════════════════════════════════════════════════════════════════
    // 4. ENGINE & PERFORMANCE (via autoTable)
    // ═══════════════════════════════════════════════════════════════════
    yPos = sectionBand('Engine & Performance', yPos);

    const specsData = Object.entries(vehicle.specifications)
        .filter(([, v]) => v)
        .map(([k, v]) => [
            k.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()).trim(),
            v,
        ]);

    autoTable(doc, {
        startY: yPos,
        head: [['Specification', 'Details']],
        body: specsData,
        theme: 'grid',
        headStyles: {
            fillColor: DEEP_FOREST,
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 7.5,
        },
        bodyStyles: {
            textColor: CHARCOAL,
            fontSize: 7.5,
            cellPadding: 2.2,
        },
        alternateRowStyles: {
            fillColor: WARM_CREAM,
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 55 },
        },
        margin: { left: M, right: M },
    });

    yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

    // ═══════════════════════════════════════════════════════════════════
    // 5. TWO-COLUMN: Safety Features | Safari Equipment
    // ═══════════════════════════════════════════════════════════════════
    const COL_W  = (CW - 6) / 2;
    const COL2_X = M + COL_W + 6;

    const listBlockTop = yPos;

    // Left: Safety Features
    let leftY = sectionBand('Safety Features', listBlockTop);
    autoTable(doc, {
        startY: leftY,
        body: vehicle.safetyFeatures.map(f => [`✓  ${f}`]),
        theme: 'plain',
        bodyStyles: { textColor: CHARCOAL, fontSize: 7.5, cellPadding: 1.6 },
        columnStyles: { 0: { cellWidth: COL_W } },
        margin: { left: M, right: COL2_X - 3 },
    });
    const safetyBottom = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

    // Right: Safari Equipment
    let rightY = sectionBand('Safari Equipment', listBlockTop);
    autoTable(doc, {
        startY: rightY,
        body: vehicle.safariEquipment.map(f => [`✓  ${f}`]),
        theme: 'plain',
        bodyStyles: { textColor: CHARCOAL, fontSize: 7.5, cellPadding: 1.6 },
        columnStyles: { 0: { cellWidth: COL_W } },
        margin: { left: COL2_X, right: M },
    });
    const equippedBottom = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

    // Thin gold divider between columns
    D(GOLD_LINE); LW(0.25);
    doc.line(COL2_X - 3, listBlockTop, COL2_X - 3, Math.max(safetyBottom, equippedBottom));

    yPos = Math.max(safetyBottom, equippedBottom) + 6;

    // ═══════════════════════════════════════════════════════════════════
    // 6. KEY FEATURES
    // ═══════════════════════════════════════════════════════════════════
    if (vehicle.features && vehicle.features.length > 0) {
        if (yPos > PH - 35) {
            doc.addPage();
            yPos = M + 8;
        }
        yPos = sectionBand('Vehicle Special Features', yPos);
        F(WARM_CREAM);
        D(GOLD_LINE);
        LW(0.25);
        doc.rect(M, yPos, CW, vehicle.features.length * 5 + 4, 'FD');

        vehicle.features.forEach((feat, i) => {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            C(CHARCOAL);
            doc.text(`·  ${feat}`, M + 4, yPos + 4.5 + i * 5);
        });
        yPos += vehicle.features.length * 5 + 8;
    }

    // ═══════════════════════════════════════════════════════════════════
    // 7. FOOTER — every page
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
    // SAVE
    // ═══════════════════════════════════════════════════════════════════
    const fileName = `${vehicle.name.replace(/\s+/g, '-')}-Spec-Sheet.pdf`;
    doc.save(fileName);
};
