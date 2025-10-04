import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/CheckBox';

const ExportModal = ({ isOpen, onClose, onExport }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'pdf',
    dateRange: 'last30days',
    includeCharts: true,
    includeDetails: true,
    includeSummary: true,
    reportName: `Expense Report - ${new Date()?.toLocaleDateString()}`,
    schedule: false,
    scheduleFrequency: 'monthly'
  });

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV File' }
  ];

  const dateRangeOptions = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last3months', label: 'Last 3 Months' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'lastyear', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const scheduleOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const handleConfigChange = (key, value) => {
    setExportConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    onExport(exportConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-popover border border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-popover-foreground">Export Report</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Name */}
          <Input
            label="Report Name"
            value={exportConfig?.reportName}
            onChange={(e) => handleConfigChange('reportName', e?.target?.value)}
            placeholder="Enter report name"
          />

          {/* Format Selection */}
          <Select
            label="Export Format"
            options={formatOptions}
            value={exportConfig?.format}
            onChange={(value) => handleConfigChange('format', value)}
          />

          {/* Date Range */}
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={exportConfig?.dateRange}
            onChange={(value) => handleConfigChange('dateRange', value)}
          />

          {/* Content Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-popover-foreground">Include in Report</label>
            
            <Checkbox
              label="Summary Statistics"
              checked={exportConfig?.includeSummary}
              onChange={(e) => handleConfigChange('includeSummary', e?.target?.checked)}
            />
            
            <Checkbox
              label="Charts and Visualizations"
              checked={exportConfig?.includeCharts}
              onChange={(e) => handleConfigChange('includeCharts', e?.target?.checked)}
            />
            
            <Checkbox
              label="Detailed Expense Data"
              checked={exportConfig?.includeDetails}
              onChange={(e) => handleConfigChange('includeDetails', e?.target?.checked)}
            />
          </div>

          {/* Schedule Option */}
          <div className="space-y-3">
            <Checkbox
              label="Schedule recurring reports"
              checked={exportConfig?.schedule}
              onChange={(e) => handleConfigChange('schedule', e?.target?.checked)}
            />
            
            {exportConfig?.schedule && (
              <Select
                label="Frequency"
                options={scheduleOptions}
                value={exportConfig?.scheduleFrequency}
                onChange={(value) => handleConfigChange('scheduleFrequency', value)}
              />
            )}
          </div>

          {/* Preview Info */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Icon name="Info" size={16} className="text-primary mr-2" />
              <span className="text-sm font-medium text-popover-foreground">Export Preview</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Format: {formatOptions?.find(f => f?.value === exportConfig?.format)?.label}</p>
              <p>Date Range: {dateRangeOptions?.find(d => d?.value === exportConfig?.dateRange)?.label}</p>
              <p>Estimated Size: ~2.5 MB</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleExport}
            iconName="Download"
            iconPosition="left"
          >
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;