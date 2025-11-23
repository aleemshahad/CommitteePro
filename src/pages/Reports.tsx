import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, DollarSign } from 'lucide-react';
import { getGroups } from '@/services/storageService';
import { Group, ReportData } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export const Reports: React.FC = () => {
    const { t } = useLanguage();
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<string>('');
    const [reportData, setReportData] = useState<ReportData | null>(null);

    useEffect(() => {
        const allGroups = getGroups();
        setGroups(allGroups);
        if (allGroups.length > 0) {
            setSelectedGroupId(allGroups[0].id);
        }
    }, []);

    useEffect(() => {
        if (selectedGroupId) {
            generateReportData(selectedGroupId);
        }
    }, [selectedGroupId]);

    const generateReportData = (groupId: string) => {
        const group = groups.find(g => g.id === groupId);
        if (!group) return;

        const totalMembers = group.members.length;
        const totalCycles = group.members.length;
        const completedCycles = group.currentCycle;
        const totalAmount = group.amount * totalMembers * totalCycles;

        const paidPayments = group.payments.filter(p => p.isPaid);
        const paidAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);
        const pendingAmount = totalAmount - paidAmount;

        const data: ReportData = {
            groupId: group.id,
            groupName: group.name,
            generatedAt: new Date().toISOString(),
            stats: {
                totalMembers,
                totalCycles,
                completedCycles,
                totalAmount,
                paidAmount,
                pendingAmount,
            },
            paymentHistory: group.payments,
            winnerHistory: group.winners,
        };

        setReportData(data);
    };

    const exportToPDF = () => {
        if (!reportData) return;

        // Create HTML content for PDF
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Committee Report - ${reportData.groupName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #667eea;
            margin: 0;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 30px 0;
          }
          .stat-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
          }
          .stat-box h3 {
            margin: 0;
            color: #667eea;
            font-size: 24px;
          }
          .stat-box p {
            margin: 5px 0 0 0;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #667eea;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Committee Report</h1>
          <h2>${reportData.groupName}</h2>
          <p>Generated on ${new Date(reportData.generatedAt).toLocaleDateString()}</p>
        </div>

        <div class="stats">
          <div class="stat-box">
            <h3>${reportData.stats.totalMembers}</h3>
            <p>Total Members</p>
          </div>
          <div class="stat-box">
            <h3>${reportData.stats.completedCycles} / ${reportData.stats.totalCycles}</h3>
            <p>Cycles Completed</p>
          </div>
          <div class="stat-box">
            <h3>PKR ${reportData.stats.totalAmount.toLocaleString()}</h3>
            <p>Total Amount</p>
          </div>
          <div class="stat-box">
            <h3>PKR ${reportData.stats.paidAmount.toLocaleString()}</h3>
            <p>Amount Collected</p>
          </div>
          <div class="stat-box">
            <h3>PKR ${reportData.stats.pendingAmount.toLocaleString()}</h3>
            <p>Pending Amount</p>
          </div>
          <div class="stat-box">
            <h3>${Math.round((reportData.stats.paidAmount / reportData.stats.totalAmount) * 100)}%</h3>
            <p>Collection Rate</p>
          </div>
        </div>

        <h2>Winners History</h2>
        <table>
          <thead>
            <tr>
              <th>Cycle</th>
              <th>Winner</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.winnerHistory.map(winner => `
              <tr>
                <td>${winner.cycleIndex + 1}</td>
                <td>${winner.memberName}</td>
                <td>PKR ${winner.amount.toLocaleString()}</td>
                <td>${new Date(winner.selectedAt).toLocaleDateString()}</td>
              </tr>
            `).join('')}
            ${reportData.winnerHistory.length === 0 ? '<tr><td colspan="4" style="text-align: center;">No draws conducted yet</td></tr>' : ''}
          </tbody>
        </table>

        <div class="footer">
          <p>© 2025 CommitteePro - Committee Management System</p>
        </div>
      </body>
      </html>
    `;

        // Create blob and download
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `committee-report-${reportData.groupName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        alert('Report exported successfully! Open the HTML file in a browser and use Print > Save as PDF');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="reports-page">
            <div className="page-header">
                <h1>{t('reports.title')}</h1>
                <button
                    onClick={exportToPDF}
                    disabled={!reportData}
                    className="primary-button"
                >
                    <Download size={20} />
                    {t('reports.export')}
                </button>
            </div>

            <div className="report-controls">
                <div className="form-group">
                    <label>{t('reports.selectGroup')}</label>
                    <select
                        value={selectedGroupId}
                        onChange={(e) => setSelectedGroupId(e.target.value)}
                    >
                        {groups.map(group => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {reportData && (
                <div className="report-preview">
                    <div className="report-header">
                        <FileText size={48} />
                        <h2>{reportData.groupName}</h2>
                        <p>Generated on {new Date(reportData.generatedAt).toLocaleDateString()}</p>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>{reportData.stats.totalMembers}</h3>
                            <p>Total Members</p>
                        </div>
                        <div className="stat-card">
                            <h3>{reportData.stats.completedCycles} / {reportData.stats.totalCycles}</h3>
                            <p>Cycles</p>
                        </div>
                        <div className="stat-card">
                            <h3>{formatCurrency(reportData.stats.totalAmount)}</h3>
                            <p>Total Amount</p>
                        </div>
                        <div className="stat-card">
                            <h3>{formatCurrency(reportData.stats.paidAmount)}</h3>
                            <p>Collected</p>
                        </div>
                        <div className="stat-card">
                            <h3>{formatCurrency(reportData.stats.pendingAmount)}</h3>
                            <p>Pending</p>
                        </div>
                        <div className="stat-card">
                            <h3>{Math.round((reportData.stats.paidAmount / reportData.stats.totalAmount) * 100)}%</h3>
                            <p>Collection Rate</p>
                        </div>
                    </div>

                    <div className="report-section">
                        <h3>Winners History</h3>
                        {reportData.winnerHistory.length === 0 ? (
                            <p className="empty-message">No draws conducted yet</p>
                        ) : (
                            <div className="winners-table">
                                <div className="table-header">
                                    <div>Cycle</div>
                                    <div>Winner</div>
                                    <div>Amount</div>
                                    <div>Date</div>
                                </div>
                                {reportData.winnerHistory.map((winner, index) => (
                                    <div key={index} className="table-row">
                                        <div>Cycle {winner.cycleIndex + 1}</div>
                                        <div>{winner.memberName}</div>
                                        <div>{formatCurrency(winner.amount)}</div>
                                        <div>{new Date(winner.selectedAt).toLocaleDateString()}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {groups.length === 0 && (
                <div className="empty-state">
                    <FileText size={64} />
                    <p>No groups available for reporting</p>
                </div>
            )}
        </div>
    );
};
