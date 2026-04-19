import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

    // Premium Color Palette (as numbers for jsPDF compatibility)
    const primary = [26, 86, 50] as [number, number, number];
    const primaryLight = [45, 118, 65] as [number, number, number];
    const black = [15, 23, 42] as [number, number, number];
    const gray = [71, 85, 105] as [number, number, number];
    const lightGray = [248, 250, 252] as [number, number, number];
    const accent = [245, 158, 66] as [number, number, number];
    const white = [255, 255, 255] as [number, number, number];
    
    const colors = { primary, primaryLight, black, gray, lightGray, accent, white };

    // Generate Booking Reference
    const bookingRef = `SLS-${Date.now().toString().slice(-8)}`;
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let yPos = margin;

    // ==================== PREMIUM HEADER ====================
    // Green header bar
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 45, 'F');

    // Company name
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.text('SENZA LUCE', margin, 22);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('SAFARIS', margin, 32);

    // Tagline
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(240, 255, 240);
    doc.text('Tanzania Safari Specialists', margin, 40);

    // Document type badge
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.roundedRect(pageWidth - margin - 50, 12, 50, 22, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
    doc.text('INQUIRY', pageWidth - margin - 25, 26, { align: 'center' });

    yPos = 55;

    // ==================== BOOKING REFERENCE CARD ====================
    // Premium card with shadow effect
    doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
    (doc as any).roundedRect(margin, yPos, contentWidth, 28, 4, 4, 'F');
    
    doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setLineWidth(0.5);
    (doc as any).roundedRect(margin, yPos, contentWidth, 28, 4, 4, 'S');

    // Reference
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
    doc.text('Booking Reference', margin + 8, yPos + 10);

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text(bookingRef, margin + 8, yPos + 22);

    // Date & Status (right side)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
    doc.text(currentDate, pageWidth - margin - 8, yPos + 10, { align: 'right' });

    doc.setFillColor(colors.primaryLight[0], colors.primaryLight[1], colors.primaryLight[2]);
    doc.roundedRect(pageWidth - margin - 45, yPos + 14, 37, 8, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.text('PENDING', pageWidth - margin - 26.5, yPos + 19, { align: 'center' });

    yPos += 38;

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
        // Check if we need a new page
        if (yPos > pageHeight - 50) {
            doc.addPage();
            yPos = margin;
            
            // Add subtle header line on new page
            doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
            doc.setLineWidth(0.5);
            doc.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 10;
        } else {
            yPos += 8;
        }

        // Section container
        doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
        doc.roundedRect(margin, yPos, contentWidth, 18, 2, 2, 'F');
        
        // Section title
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.text(title.toUpperCase(), margin + 8, yPos + 12);

        // Decorative line
        doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.setLineWidth(1);
        doc.line(margin + 8, yPos + 18, margin + 50, yPos + 18);

        yPos += 24;
    };

    const addField = (label: string, value: string, isImportant = false) => {
        if (!value || value === 'N/A') return;
 
        if (yPos > pageHeight - 20) {
            doc.addPage();
            yPos = margin;
            
            doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
            doc.setLineWidth(0.5);
            doc.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 10;
        }

        // Label
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
        doc.text(label, margin, yPos);

        // Value
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(isImportant ? colors.primary[0] : colors.black[0],
            isImportant ? colors.primary[1] : colors.black[1],
            isImportant ? colors.primary[2] : colors.black[2]);

        const splitText = doc.splitTextToSize(value, contentWidth - 55);
        doc.text(splitText, margin + 55, yPos);
        yPos += splitText.length * 5 + 3;
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

    // ==================== PREMIUM FOOTER ====================
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        // Green accent line at top of footer
        doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.rect(0, pageHeight - 25, pageWidth, 4, 'F');

        // Footer background
        doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
        doc.rect(0, pageHeight - 21, pageWidth, 21, 'F');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.text('SENZA LUCE SAFARIS', margin, pageHeight - 14);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
        
        // Contact info center
        doc.text('📞 +255 768 123 456  |  📧 info@senzalucesafaris.com  |  🌐 www.senzalucesafaris.com', pageWidth / 2, pageHeight - 14, { align: 'center' });
        
        // Page number right
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 14, { align: 'right' });
        
        // Company tagline
        doc.setFontSize(7);
        doc.setFont('helvetica', 'italic');
        doc.text('Authentic Tanzanian Safari Experiences Since 2010', margin, pageHeight - 6);
    }

    // ==================== SAVE ====================
    const fileName = `Safari-Inquiry-${bookingData.firstName}-${bookingData.lastName}.pdf`;
    doc.save(fileName);

    return {
        bookingRef,
        fileName
    };
}
