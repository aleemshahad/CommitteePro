import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Committee, Payment, Draw, ReportFilters, Language } from '../types';
import { format } from 'date-fns';

class ReportService {
    private getFormattedDate(date: string): string {
        return format(new Date(date), 'MMM dd, yyyy');
    }

    private getFormattedCurrency(amount: number): string {
        return `Rs. ${amount.toLocaleString()}`;
    }

    generatePaymentReport(
        payments: Payment[],
        committee: Committee,
        filters: ReportFilters,
        language: Language
    ): void {
        const doc = new jsPDF();
        const isRTL = language === 'ur';

        // Header
        doc.setFontSize(20);
        doc.setTextColor(138, 43, 226); // Primary purple color
        doc.text(
            language === 'ur' ? 'ادائیگی کی رپورٹ' : 'Payment Report',
            isRTL ? 200 : 10,
            20,
            { align: isRTL ? 'right' : 'left' }
        );

        // Committee Info
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(
            `${language === 'ur' ? 'کمیٹی' : 'Committee'}: ${committee.name}`,
            isRTL ? 200 : 10,
            30,
            { align: isRTL ? 'right' : 'left' }
        );
        doc.text(
            `${language === 'ur' ? 'تاریخ' : 'Generated'}: ${this.getFormattedDate(new Date().toISOString())}`,
            isRTL ? 200 : 10,
            37,
            { align: isRTL ? 'right' : 'left' }
        );

        // Summary
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
        const paidPayments = payments.filter(p => p.status === 'completed');
        const paidAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);

        doc.setFontSize(10);
        doc.text(
            `${language === 'ur' ? 'کل ادائیگیاں' : 'Total Payments'}: ${payments.length}`,
            isRTL ? 200 : 10,
            47,
            { align: isRTL ? 'right' : 'left' }
        );
        doc.text(
            `${language === 'ur' ? 'ادا شدہ' : 'Paid'}: ${paidPayments.length}`,
            isRTL ? 200 : 10,
            52,
            { align: isRTL ? 'right' : 'left' }
        );
        doc.text(
            `${language === 'ur' ? 'کل رقم' : 'Total Amount'}: ${this.getFormattedCurrency(totalAmount)}`,
            isRTL ? 200 : 10,
            57,
            { align: isRTL ? 'right' : 'left' }
        );
        doc.text(
            `${language === 'ur' ? 'ادا شدہ رقم' : 'Paid Amount'}: ${this.getFormattedCurrency(paidAmount)}`,
            isRTL ? 200 : 10,
            62,
            { align: isRTL ? 'right' : 'left' }
        );

        // Table
        const tableHeaders = language === 'ur'
            ? ['حالت', 'رقم', 'چکر', 'رکن']
            : ['Member', 'Cycle', 'Amount', 'Status'];

        const tableData = payments.map(payment => {
            const row = language === 'ur'
                ? [
                    payment.status === 'completed' ? 'ادا شدہ' : 'زیر التواء',
                    this.getFormattedCurrency(payment.amount),
                    payment.cycle.toString(),
                    payment.memberName,
                ]
                : [
                    payment.memberName,
                    payment.cycle.toString(),
                    this.getFormattedCurrency(payment.amount),
                    payment.status === 'completed' ? 'Paid' : 'Pending',
                ];
            return row;
        });

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            startY: 70,
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [138, 43, 226],
                textColor: 255,
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [245, 245, 250],
            },
        });

        // Save
        const fileName = `payment_report_${committee.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        doc.save(fileName);
    }

    generateCommitteeReport(committee: Committee, payments: Payment[], draws: Draw[], language: Language): void {
        const doc = new jsPDF();
        const isRTL = language === 'ur';

        // Header
        doc.setFontSize(20);
        doc.setTextColor(138, 43, 226);
        doc.text(
            language === 'ur' ? 'کمیٹی کی رپورٹ' : 'Committee Report',
            isRTL ? 200 : 10,
            20,
            { align: isRTL ? 'right' : 'left' }
        );

        // Committee Details
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(committee.name, isRTL ? 200 : 10, 35, { align: isRTL ? 'right' : 'left' });

        doc.setFontSize(10);
        let yPos = 45;

        const details = [
            { label: language === 'ur' ? 'منتظم' : 'Admin', value: committee.adminName },
            { label: language === 'ur' ? 'کل اراکین' : 'Total Members', value: committee.members.length.toString() },
            { label: language === 'ur' ? 'ادائیگی کی رقم' : 'Payment Amount', value: this.getFormattedCurrency(committee.paymentAmount) },
            { label: language === 'ur' ? 'تعدد' : 'Frequency', value: committee.paymentFrequency },
            { label: language === 'ur' ? 'موجودہ چکر' : 'Current Cycle', value: `${committee.currentCycle}/${committee.totalCycles}` },
            { label: language === 'ur' ? 'شروع کی تاریخ' : 'Start Date', value: this.getFormattedDate(committee.startDate) },
        ];

        details.forEach(detail => {
            doc.text(
                `${detail.label}: ${detail.value}`,
                isRTL ? 200 : 10,
                yPos,
                { align: isRTL ? 'right' : 'left' }
            );
            yPos += 7;
        });

        // Members Table
        yPos += 10;
        doc.setFontSize(12);
        doc.setTextColor(138, 43, 226);
        doc.text(
            language === 'ur' ? 'اراکین' : 'Members',
            isRTL ? 200 : 10,
            yPos,
            { align: isRTL ? 'right' : 'left' }
        );

        const memberHeaders = language === 'ur'
            ? ['حالت', 'شمولیت کی تاریخ', 'نام']
            : ['Name', 'Joined', 'Status'];

        const memberData = committee.members.map(member => {
            const row = language === 'ur'
                ? [
                    member.isActive ? 'فعال' : 'غیر فعال',
                    this.getFormattedDate(member.joinedAt),
                    member.name,
                ]
                : [
                    member.name,
                    this.getFormattedDate(member.joinedAt),
                    member.isActive ? 'Active' : 'Inactive',
                ];
            return row;
        });

        autoTable(doc, {
            head: [memberHeaders],
            body: memberData,
            startY: yPos + 5,
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [138, 43, 226],
                textColor: 255,
            },
        });

        // Payment Summary
        const finalY = (doc as any).lastAutoTable.finalY || yPos + 50;
        doc.setFontSize(12);
        doc.text(
            language === 'ur' ? 'ادائیگی کا خلاصہ' : 'Payment Summary',
            isRTL ? 200 : 10,
            finalY + 15,
            { align: isRTL ? 'right' : 'left' }
        );

        const totalCollected = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
        const totalExpected = committee.members.length * committee.paymentAmount * committee.currentCycle;

        doc.setFontSize(10);
        doc.text(
            `${language === 'ur' ? 'کل جمع شدہ' : 'Total Collected'}: ${this.getFormattedCurrency(totalCollected)}`,
            isRTL ? 200 : 10,
            finalY + 25,
            { align: isRTL ? 'right' : 'left' }
        );
        doc.text(
            `${language === 'ur' ? 'کل متوقع' : 'Total Expected'}: ${this.getFormattedCurrency(totalExpected)}`,
            isRTL ? 200 : 10,
            finalY + 32,
            { align: isRTL ? 'right' : 'left' }
        );

        // Save
        const fileName = `committee_report_${committee.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        doc.save(fileName);
    }

    generateDrawReport(draws: Draw[], committee: Committee, language: Language): void {
        const doc = new jsPDF();
        const isRTL = language === 'ur';

        // Header
        doc.setFontSize(20);
        doc.setTextColor(138, 43, 226);
        doc.text(
            language === 'ur' ? 'قرعہ اندازی کی رپورٹ' : 'Draw Report',
            isRTL ? 200 : 10,
            20,
            { align: isRTL ? 'right' : 'left' }
        );

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(
            `${language === 'ur' ? 'کمیٹی' : 'Committee'}: ${committee.name}`,
            isRTL ? 200 : 10,
            30,
            { align: isRTL ? 'right' : 'left' }
        );

        // Table
        const tableHeaders = language === 'ur'
            ? ['تاریخ', 'رقم', 'چکر', 'فاتح']
            : ['Winner', 'Cycle', 'Amount', 'Date'];

        const tableData = draws.map(draw => {
            const row = language === 'ur'
                ? [
                    this.getFormattedDate(draw.conductedAt),
                    this.getFormattedCurrency(draw.amount),
                    draw.cycle.toString(),
                    draw.winnerName,
                ]
                : [
                    draw.winnerName,
                    draw.cycle.toString(),
                    this.getFormattedCurrency(draw.amount),
                    this.getFormattedDate(draw.conductedAt),
                ];
            return row;
        });

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            startY: 40,
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [138, 43, 226],
                textColor: 255,
            },
            alternateRowStyles: {
                fillColor: [245, 245, 250],
            },
        });

        // Save
        const fileName = `draw_report_${committee.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        doc.save(fileName);
    }
}

export const reportService = new ReportService();
