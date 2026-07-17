"use client";

import { Vehicle } from "../types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Brand color palette (matches booking-pdf.ts exactly) ────────────────────
type RGB = [number, number, number];
const GREEN:    RGB = [26,  86,  50];
const GREEN_LT: RGB = [45, 118,  65];
const GOLD_BG:  RGB = [252, 240, 190];
const GOLD:     RGB = [162, 117,  12];
const CHARCOAL: RGB = [51,  51,  51];
const MID_GRAY: RGB = [100, 116, 139];
const PALE:     RGB = [248, 250, 252];
const DIVIDER:  RGB = [229, 231, 235];
const WHITE:    RGB = [255, 255, 255];
const GREEN_TINT: RGB = [200, 225, 205];

export const generateVehiclePDF = (vehicle: Vehicle) => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const PW = doc.internal.pageSize.getWidth();
    const PH = doc.internal.pageSize.getHeight();
    const M  = 14;
    const CW = PW - M * 2;

    const C  = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);
    const F  = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
    const D  = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);
    const LW = (w: number) => doc.setLineWidth(w);
    const hRule = (y: number) => { D(DIVIDER); LW(0.25); doc.line(M, y, PW - M, y); };

    const refNum = `SLS-VEH-${vehicle.id}`;
    const currentDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
    });

    // ═══════════════════════════════════════════════════════════════════
    // 1. HEADER BAND
    // ═══════════════════════════════════════════════════════════════════
    F(GREEN);
    doc.rect(0, 0, PW, 44, 'F');

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
    doc.rect(PW - M - 40, 10, 40, 24, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    C(GOLD);
    doc.text('VEHICLE', PW - M - 20, 21, { align: 'center' });
    doc.text('SPEC SHEET', PW - M - 20, 28, { align: 'center' });

    // ═══════════════════════════════════════════════════════════════════
    // 2. VEHICLE IDENTITY BAR
    // ═══════════════════════════════════════════════════════════════════
    F(PALE);
    doc.rect(0, 44, PW, 20, 'F');
    D(DIVIDER); LW(0.25);
    doc.line(0, 64, PW, 64);

    // Vehicle name
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    C(CHARCOAL);
    doc.text(vehicle.name, M, 56);

    // Category tag
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    C(MID_GRAY);
    doc.text(vehicle.category, M, 62.5);

    // Ref & date — right
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    C(MID_GRAY);
    doc.text(refNum, PW - M, 51, { align: 'right' });
    doc.text(`Generated: ${currentDate}`, PW - M, 57, { align: 'right' });

    // ═══════════════════════════════════════════════════════════════════
    // 3. KEY STATS ROW (capacity · rating · price range)
    // ═══════════════════════════════════════════════════════════════════
    const STAT_W = CW / 3;
    const stats = [
        { label: 'Capacity',    value: vehicle.capacity },
        { label: 'Rating',      value: `${vehicle.rating}/5.0 (${vehicle.reviews} reviews)` },
        { label: 'Price Range', value: vehicle.priceRange },
    ];

    let statY = 67;
    stats.forEach((s, i) => {
        const x = M + i * STAT_W;
        F(i === 0 ? GREEN : i === 1 ? GREEN_LT : PALE);
        doc.rect(x, statY, STAT_W - 1, 14, 'F');

        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'bold');
        C(i < 2 ? WHITE : MID_GRAY);
        doc.text(s.label.toUpperCase(), x + 4, statY + 5);

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        C(i < 2 ? WHITE : CHARCOAL);
        doc.text(s.value, x + 4, statY + 11.5);
    });

    let yPos = statY + 18;

    // ═══════════════════════════════════════════════════════════════════
    // SECTION HEADING HELPER
    // ═══════════════════════════════════════════════════════════════════
    const sectionBand = (title: string, y: number): number => {
        F(GREEN);
        doc.rect(M, y, CW, 7.5, 'F');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        C(WHITE);
        doc.text(title.toUpperCase(), M + 4, y + 5.2);
        return y + 10;
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
            fillColor: GREEN,
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 8,
        },
        bodyStyles: {
            textColor: CHARCOAL,
            fontSize: 8,
            cellPadding: 2.5,
        },
        alternateRowStyles: {
            fillColor: PALE,
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 60 },
        },
        margin: { left: M, right: M },
    });

    yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

    // ═══════════════════════════════════════════════════════════════════
    // 5. TWO-COLUMN: Safety Features | Safari Equipment
    // ═══════════════════════════════════════════════════════════════════
    const COL_W  = (CW - 4) / 2;
    const COL2_X = M + COL_W + 4;

    const listBlockTop = yPos;

    // Left: Safety Features
    let leftY = sectionBand('Safety Features', listBlockTop);
    autoTable(doc, {
        startY: leftY,
        body: vehicle.safetyFeatures.map(f => [`✓  ${f}`]),
        theme: 'plain',
        bodyStyles: { textColor: CHARCOAL, fontSize: 8, cellPadding: 1.8 },
        columnStyles: { 0: { cellWidth: COL_W } },
        margin: { left: M, right: COL2_X - 2 },
    });
    const safetyBottom = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

    // Right: Safari Equipment
    let rightY = sectionBand('Safari Equipment', listBlockTop);
    autoTable(doc, {
        startY: rightY,
        body: vehicle.safariEquipment.map(f => [`✓  ${f}`]),
        theme: 'plain',
        bodyStyles: { textColor: CHARCOAL, fontSize: 8, cellPadding: 1.8 },
        columnStyles: { 0: { cellWidth: COL_W } },
        margin: { left: COL2_X, right: M },
    });
    const equippedBottom = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

    // Thin vertical divider between the two columns
    D(DIVIDER); LW(0.25);
    doc.line(COL2_X - 2, listBlockTop, COL2_X - 2, Math.max(safetyBottom, equippedBottom));

    yPos = Math.max(safetyBottom, equippedBottom) + 5;
    hRule(yPos);
    yPos += 4;

    // ═══════════════════════════════════════════════════════════════════
    // 6. KEY FEATURES
    // ═══════════════════════════════════════════════════════════════════
    if (vehicle.features && vehicle.features.length > 0) {
        yPos = sectionBand('Key Features', yPos);
        F(PALE);
        doc.rect(M, yPos, CW, vehicle.features.length * 5 + 4, 'F');

        vehicle.features.forEach((feat, i) => {
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
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

        F(GREEN);
        doc.rect(0, PH - 22, PW, 3, 'F');

        F(PALE);
        doc.rect(0, PH - 19, PW, 19, 'F');

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        C(GREEN);
        doc.text('SENZA LUCE SAFARIS', M, PH - 11);

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        C(MID_GRAY);
        doc.text(
            '+255 629 123 246  ·  info@senzalucesafaris.com  ·  www.senzalucesafaris.com',
            PW / 2, PH - 11, { align: 'center' },
        );

        doc.text(`Page ${i} of ${totalPages}`, PW - M, PH - 11, { align: 'right' });

        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'italic');
        C(MID_GRAY);
        doc.text('Authentic Tanzanian Safari Experiences Since 2010', M, PH - 4);
    }

    // ═══════════════════════════════════════════════════════════════════
    // SAVE
    // ═══════════════════════════════════════════════════════════════════
    const fileName = `${vehicle.name.replace(/\s+/g, '-')}-Spec-Sheet.pdf`;
    doc.save(fileName);
};
