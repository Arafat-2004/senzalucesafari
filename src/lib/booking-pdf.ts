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

export function generateBookingPDF(bookingData: BookingData) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Clean Color Palette
    const colors = {
        primary: [45, 80, 22],      // Forest Green (accent only)
        black: [31, 41, 55],        // Dark text
        gray: [107, 114, 128],      // Secondary text
        lightGray: [229, 231, 235]  // Borders
    };

    // Generate Booking Reference
    const bookingRef = `SLS-${Date.now().toString().slice(-8)}`;
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let yPos = margin;

    // ==================== CLEAN HEADER ====================
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
    doc.text('Senza Luce Safaris', margin, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
    doc.text('Tanzania Safari Specialists', margin, yPos);

    yPos += 12;

    // Thin separator line
    doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 10;

    // Document title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
    doc.text('Safari Inquiry', margin, yPos);

    yPos += 15;

    // ==================== BOOKING REFERENCE BOX ====================
    doc.setFillColor(249, 250, 251);
    doc.rect(margin, yPos, contentWidth, 20, 'F');
    doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
    doc.setLineWidth(0.3);
    doc.rect(margin, yPos, contentWidth, 20, 'S');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
    doc.text('Booking Reference:', margin + 5, yPos + 8);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text(bookingRef, margin + 5, yPos + 15);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
    doc.text(`Date: ${currentDate}`, pageWidth - margin - 5, yPos + 8, { align: 'right' });
    doc.text('Status: Pending Review', pageWidth - margin - 5, yPos + 15, { align: 'right' });

    yPos += 30;

    // ==================== HELPER FUNCTIONS ====================
    const addSectionTitle = (title: string) => {
        if (yPos > pageHeight - 30) {
            doc.addPage();
            yPos = margin;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
        doc.text(title, margin, yPos);

        yPos += 2;
        doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, margin + 40, yPos);

        yPos += 8;
    };

    const addField = (label: string, value: string, isImportant = false) => {
        if (!value || value === 'N/A') return;

        if (yPos > pageHeight - 15) {
            doc.addPage();
            yPos = margin;
        }

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
        doc.text(label, margin, yPos);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(isImportant ? colors.primary[0] : colors.black[0],
            isImportant ? colors.primary[1] : colors.black[1],
            isImportant ? colors.primary[2] : colors.black[2]);

        const splitText = doc.splitTextToSize(value, contentWidth - 50);
        doc.text(splitText, margin + 50, yPos);
        yPos += splitText.length * 5 + 4;
    };

    const addSimpleList = (label: string, items: string[]) => {
        if (items.length === 0) return;
        addField(label, items.join(', '));
    };

    // ==================== CONTACT INFORMATION ====================
    addSectionTitle('Contact Information');
    addField('Name', `${bookingData.firstName} ${bookingData.lastName}`, true);
    addField('Email', bookingData.email);
    addField('Phone', bookingData.phone);
    if (bookingData.country) addField('Country', bookingData.country);
    addField('Preferred Contact', bookingData.contactPreference.charAt(0).toUpperCase() + bookingData.contactPreference.slice(1));

    yPos += 5;

    // ==================== SAFARI DETAILS ====================
    addSectionTitle('Safari Details');
    addField('Safari Type', bookingData.safariType, true);
    if (bookingData.destinations.length > 0) {
        addSimpleList('Destinations', bookingData.destinations);
    }
    addField('Travel Date', bookingData.travelDate, true);
    if (bookingData.duration) addField('Duration', bookingData.duration);
    addField('Group Size', `${bookingData.numberOfPeople} people`);
    if (bookingData.childrenCount !== '0') {
        const childrenInfo = `${bookingData.childrenCount} children${bookingData.childAges ? ` (ages ${bookingData.childAges})` : ''}`;
        addField('Children', childrenInfo);
    }
    addField('Flexible Dates', bookingData.flexibleDates === 'yes' ? 'Yes' : 'No');

    // Package Pricing Information (if available)
    if (bookingData.basePrice || bookingData.totalPrice) {
        yPos += 5;
        addSectionTitle('Pricing Breakdown');
        if (bookingData.basePrice) {
            addField('Base Price', `$${parseInt(bookingData.basePrice).toLocaleString()} per person`);
        }
        if (bookingData.discount && parseInt(bookingData.discount) > 0) {
            addField('Group Discount', `${bookingData.discount}% off per person`);
        }
        if (bookingData.totalPrice) {
            addField('Estimated Total', `$${parseInt(bookingData.totalPrice).toLocaleString()}`, true);
        }
        addField('Note', 'Final price subject to availability and confirmation', false);
    }

    yPos += 5;

    // ==================== PREFERENCES ====================
    addSectionTitle('Preferences');
    if (bookingData.accommodationLevel) addField('Accommodation', bookingData.accommodationLevel);
    if (bookingData.vehiclePreference) addField('Vehicle', bookingData.vehiclePreference);
    if (bookingData.activities.length > 0) {
        addSimpleList('Activities', bookingData.activities);
    }
    if (bookingData.budget) addField('Budget', bookingData.budget);
    if (bookingData.paymentPreference) addField('Payment', bookingData.paymentPreference);
    if (bookingData.pickupLocation) addField('Pickup', bookingData.pickupLocation);
    if (bookingData.dropoffLocation) addField('Drop-off', bookingData.dropoffLocation);

    yPos += 5;

    // ==================== LOCATION ====================
    if (bookingData.location && (bookingData.location.latitude || bookingData.location.address)) {
        addSectionTitle('Submission Location');

        if (bookingData.location.address) {
            addField('Address', bookingData.location.address);
        }

        if (bookingData.location.latitude && bookingData.location.longitude) {
            const coords = `${bookingData.location.latitude.toFixed(6)}, ${bookingData.location.longitude.toFixed(6)}`;
            addField('Coordinates', coords);

            const mapsUrl = `https://maps.google.com/?q=${bookingData.location.latitude},${bookingData.location.longitude}`;
            yPos += 2;
            doc.setFontSize(8);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
            doc.textWithLink('View on Google Maps', margin + 50, yPos, { url: mapsUrl });
            yPos += 6;
        }

        if (bookingData.location.timestamp) {
            const locTime = new Date(bookingData.location.timestamp).toLocaleString();
            addField('Captured', locTime);
        }

        yPos += 5;
    }

    // ==================== ADDITIONAL NOTES ====================
    addSectionTitle('Additional Information');
    if (bookingData.dietaryRequirements) {
        addField('Dietary Requirements', bookingData.dietaryRequirements);
    } else {
        addField('Dietary Requirements', 'None specified');
    }

    if (bookingData.medicalConditions) {
        addField('Medical Conditions', bookingData.medicalConditions);
    } else {
        addField('Medical Conditions', 'None declared');
    }

    if (bookingData.specialRequests) {
        addField('Special Requests', bookingData.specialRequests);
    }

    if (bookingData.message) {
        yPos += 3;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
        const messageLines = doc.splitTextToSize(bookingData.message, contentWidth - 10);
        doc.text(messageLines, margin + 5, yPos);
        yPos += messageLines.length * 5 + 5;
    }

    // ==================== SIMPLE FOOTER ====================
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
        doc.setLineWidth(0.3);
        doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);

        doc.text('Senza Luce Safaris', margin, pageHeight - 12);
        doc.text('info@senzalucesafaris.com', pageWidth / 2, pageHeight - 12, { align: 'center' });
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 12, { align: 'right' });
    }

    // ==================== SAVE ====================
    const fileName = `Safari-Inquiry-${bookingData.firstName}-${bookingData.lastName}.pdf`;
    doc.save(fileName);

    return {
        bookingRef,
        fileName
    };
}
