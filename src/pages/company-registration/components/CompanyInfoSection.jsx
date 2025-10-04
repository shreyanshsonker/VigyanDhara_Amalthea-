import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CompanyInfoSection = ({ 
  formData, 
  errors, 
  countries, 
  onInputChange, 
  onCountryChange 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Company Information</h2>
        <p className="text-muted-foreground">Tell us about your organization</p>
      </div>
      <div className="space-y-4">
        <Input
          label="Company Name"
          type="text"
          name="companyName"
          placeholder="Enter your company name"
          value={formData?.companyName}
          onChange={onInputChange}
          error={errors?.companyName}
          required
          description="This will be displayed across your expense management system"
        />

        <Select
          label="Country"
          placeholder="Select your country"
          options={countries}
          value={formData?.country}
          onChange={onCountryChange}
          error={errors?.country}
          required
          searchable
          description="This determines your base currency and regional settings"
          className="mt-4"
        />

        {formData?.currency && (
          <div className="bg-muted rounded-lg p-4 border border-border">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm font-medium text-foreground">
                Base Currency: {formData?.currency}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All expenses will be tracked in this currency with automatic conversion support
            </p>
          </div>
        )}

        <Input
          label="Company Size"
          type="number"
          name="companySize"
          placeholder="Number of employees"
          value={formData?.companySize}
          onChange={onInputChange}
          error={errors?.companySize}
          min="1"
          max="10000"
          description="Approximate number of employees who will use the system"
        />
      </div>
    </div>
  );
};

export default CompanyInfoSection;