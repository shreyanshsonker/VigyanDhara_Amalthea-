import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DataTable = ({ data, columns, title, exportable = true }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedAndFilteredData = useMemo(() => {
    let filteredData = data?.filter(item =>
      Object.values(item)?.some(value =>
        value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    );

    if (sortConfig?.key) {
      filteredData?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  }, [data, sortConfig, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredData?.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAndFilteredData, currentPage]);

  const totalPages = Math.ceil(sortedAndFilteredData?.length / itemsPerPage);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      pending: { color: 'bg-warning text-warning-foreground', icon: 'Clock' },
      rejected: { color: 'bg-error text-error-foreground', icon: 'XCircle' }
    };

    const config = statusConfig?.[status?.toLowerCase()] || statusConfig?.pending;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  const renderCellContent = (item, column) => {
    const value = item?.[column?.key];
    
    if (column?.key === 'status') {
      return getStatusBadge(value);
    }
    
    if (column?.key === 'amount') {
      return `$${value?.toLocaleString() || '0'}`;
    }
    
    if (column?.key === 'date') {
      return new Date(value)?.toLocaleDateString();
    }
    
    return value || '-';
  };

  const handleExport = (format) => {
    console.log(`Exporting data as ${format}`, sortedAndFilteredData);
    // Export functionality would be implemented here
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 sm:w-64">
              <Input
                type="search"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="w-full"
              />
            </div>
            
            {exportable && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('pdf')}
                  iconName="FileText"
                  iconPosition="left"
                >
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('excel')}
                  iconName="Download"
                  iconPosition="left"
                >
                  Excel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {columns?.map((column) => (
                <th
                  key={column?.key}
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/80 transition-colors duration-200"
                  onClick={() => column?.sortable && handleSort(column?.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column?.label}</span>
                    {column?.sortable && (
                      <Icon
                        name={
                          sortConfig?.key === column?.key
                            ? sortConfig?.direction === 'asc' ?'ChevronUp' :'ChevronDown' :'ChevronsUpDown'
                        }
                        size={14}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {paginatedData?.length === 0 ? (
              <tr>
                <td colSpan={columns?.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <Icon name="Search" size={48} className="text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No data found</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData?.map((item, index) => (
                <tr key={index} className="hover:bg-muted/50 transition-colors duration-200">
                  {columns?.map((column) => (
                    <td key={column?.key} className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                      {renderCellContent(item, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedAndFilteredData?.length)} of {sortedAndFilteredData?.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
              />
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;