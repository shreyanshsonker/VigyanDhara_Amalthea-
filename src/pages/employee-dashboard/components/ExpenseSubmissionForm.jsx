import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ExpenseSubmissionForm = ({ onExpenseSubmitted }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    receipt: null,
    isOcrProcessing: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  const categories = [
    { value: 'meals', label: 'Meals & Entertainment' },
    { value: 'travel', label: 'Travel' },
    { value: 'office', label: 'Office Supplies' },
    { value: 'software', label: 'Software & Subscriptions' },
    { value: 'training', label: 'Training & Development' },
    { value: 'communication', label: 'Communication' },
    { value: 'other', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        receipt: file
      }));
      
      // Simulate OCR processing
      processReceiptWithOCR(file);
    }
  };

  const processReceiptWithOCR = async (file) => {
    setFormData(prev => ({ ...prev, isOcrProcessing: true }));
    
    // Simulate OCR processing delay
    setTimeout(() => {
      // Mock OCR result
      const mockOcrResult = {
        amount: '125.50',
        vendor: 'Starbucks Coffee',
        date: new Date().toISOString().split('T')[0],
        category: 'meals',
        confidence: 0.95
      };
      
      setOcrResult(mockOcrResult);
      
      // Auto-fill form with OCR data
      setFormData(prev => ({
        ...prev,
        amount: mockOcrResult.amount,
        vendor: mockOcrResult.vendor,
        date: mockOcrResult.date,
        category: mockOcrResult.category,
        isOcrProcessing: false
      }));
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newExpense = {
        id: Date.now().toString(),
        ...formData,
        amount: parseFloat(formData.amount),
        status: 'pending',
        submittedAt: new Date().toISOString(),
        receipt: formData.receipt ? URL.createObjectURL(formData.receipt) : null
      };
      
      onExpenseSubmitted(newExpense);
      
      // Reset form
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        vendor: '',
        receipt: null,
        isOcrProcessing: false
      });
      setOcrResult(null);
      setErrors({});
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Submit New Expense</h2>
          <p className="text-muted-foreground">
            Upload a receipt to auto-fill the form or enter details manually.
          </p>
        </div>

        {/* OCR Processing Indicator */}
        {formData.isOcrProcessing && (
          <div className="mb-6 bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Loader2" size={20} className="animate-spin text-primary" />
              <div>
                <p className="font-medium text-primary">Processing Receipt with OCR</p>
                <p className="text-sm text-muted-foreground">
                  Extracting information from your receipt...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* OCR Results */}
        {ocrResult && (
          <div className="mb-6 bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="CheckCircle" size={20} className="text-success mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-success mb-2">Receipt Processed Successfully</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="ml-2 font-medium">${ocrResult.amount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Vendor:</span>
                    <span className="ml-2 font-medium">{ocrResult.vendor}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <span className="ml-2 font-medium">{ocrResult.date}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <span className="ml-2 font-medium capitalize">{ocrResult.category}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Confidence: {(ocrResult.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Receipt Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Receipt Upload (Optional)
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="receipt-upload"
                disabled={formData.isOcrProcessing}
              />
              <label
                htmlFor="receipt-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Icon name="Upload" size={32} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {formData.receipt ? formData.receipt.name : 'Click to upload receipt'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </label>
            </div>
            {formData.receipt && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-success">
                <Icon name="CheckCircle" size={16} />
                <span>Receipt uploaded successfully</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              error={errors.amount}
              required
              disabled={isSubmitting}
              placeholder="0.00"
              step="0.01"
            />
            
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={(value) => handleSelectChange('category', value)}
              options={categories}
              error={errors.category}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Vendor"
              name="vendor"
              value={formData.vendor}
              onChange={handleInputChange}
              error={errors.vendor}
              disabled={isSubmitting}
              placeholder="e.g., Starbucks, Uber, Office Depot"
            />
            
            <Input
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              error={errors.date}
              required
              disabled={isSubmitting}
            />
          </div>

          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={errors.description}
            required
            disabled={isSubmitting}
            placeholder="Brief description of the expense"
            multiline
            rows={3}
          />

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  amount: '',
                  category: '',
                  description: '',
                  date: new Date().toISOString().split('T')[0],
                  vendor: '',
                  receipt: null,
                  isOcrProcessing: false
                });
                setOcrResult(null);
                setErrors({});
              }}
              disabled={isSubmitting}
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              iconName="Send"
              iconPosition="left"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Expense'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseSubmissionForm;
