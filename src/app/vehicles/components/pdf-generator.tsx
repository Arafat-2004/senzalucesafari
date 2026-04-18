"use client";

import { Vehicle } from "../types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateVehiclePDF = (vehicle: Vehicle) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(91, 153, 90); // Primary green color
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Senza Luce Safaris", 105, 20, { align: "center" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Vehicle Specification Sheet", 105, 30, { align: "center" });

    // Vehicle Name & Category
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(vehicle.name, 14, 55);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(vehicle.category, 14, 62);

    // Quick Stats
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Capacity: ${vehicle.capacity}`, 14, 72);
    doc.text(`Rating: ${vehicle.rating}/5.0 (${vehicle.reviews} reviews)`, 14, 78);
    doc.text(`Price Range: ${vehicle.priceRange}`, 14, 84);

    // Engine & Performance Section
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 92, 182, 8, 'F');
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(91, 153, 90);
    doc.text("Engine & Performance", 18, 97);

    const specsData = Object.entries(vehicle.specifications).map(([key, value]) => [
        key.replace(/([A-Z])/g, ' $1').trim(),
        value
    ]);

    autoTable(doc, {
        startY: 102,
        head: [['Specification', 'Details']],
        body: specsData,
        theme: 'grid',
        headStyles: {
            fillColor: [91, 153, 90],
            textColor: 255,
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        margin: { left: 14, right: 14 }
    });

    // Safety Features Section
    const safetyStartY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
    doc.setFillColor(240, 240, 240);
    doc.rect(14, safetyStartY, 182, 8, 'F');
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(91, 153, 90);
    doc.text("Safety Features", 18, safetyStartY + 5);

    const safetyData = vehicle.safetyFeatures.map(feature => [feature]);

    autoTable(doc, {
        startY: safetyStartY + 10,
        body: safetyData,
        theme: 'plain',
        styles: {
            fontSize: 10,
            cellPadding: 3
        },
        columnStyles: {
            0: { cellWidth: 182 }
        },
        margin: { left: 14, right: 14 },
        didParseCell: (data) => {
            if (data.section === 'body') {
                data.cell.styles.fillColor = [255, 255, 255];
            }
        }
    });

    // Safari Equipment Section
    const equipmentStartY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
    doc.setFillColor(240, 240, 240);
    doc.rect(14, equipmentStartY, 182, 8, 'F');
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(91, 153, 90);
    doc.text("Safari-Specific Equipment", 18, equipmentStartY + 5);

    const equipmentData = vehicle.safariEquipment.map(item => [item]);

    autoTable(doc, {
        startY: equipmentStartY + 10,
        body: equipmentData,
        theme: 'plain',
        styles: {
            fontSize: 10,
            cellPadding: 3
        },
        columnStyles: {
            0: { cellWidth: 182 }
        },
        margin: { left: 14, right: 14 }
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(91, 153, 90);
    doc.rect(0, pageHeight - 25, 210, 25, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Contact Us:", 14, pageHeight - 15);
    doc.text("Phone: +255 629 123 246", 14, pageHeight - 10);
    doc.text("Email: info@senzalucesafaris.com", 80, pageHeight - 15);
    doc.text("Website: www.senzalucesafaris.com", 80, pageHeight - 10);

    // Save PDF
    const fileName = `${vehicle.name.replace(/\s+/g, '-')}-Specs.pdf`;
    doc.save(fileName);
};
