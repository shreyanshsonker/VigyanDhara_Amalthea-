import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const AddEmployeeModal = ({ isOpen, onClose, onAddEmployee }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    manager: '',
    startDate: '',
    salary: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const departments = [
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const managers = [
    { value: 'john-doe', label: 'John Doe (Sales Manager)' },
    { value: 'jane-smith', label: 'Jane Smith (Marketing Manager)' },
    { value: 'mike-johnson', label: 'Mike Johnson (Engineering Manager)' },
    { value: 'sarah-wilson', label: 'Sarah Wilson (HR Manager)' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newEmployee = {
        id: Date.now().toString(),
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`,
        status: 'active',
        createdAt: new Date().toISOString(),
        // Generate temporary password
        tempPassword: Math.random().toString(36).slice(-8)
      };
      
      onAddEmployee(newEmployee);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        position: '',
        manager: '',
        startDate: '',
        salary: '',
        phone: ''
      });
      setErrors({});
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      position: '',
      manager: '',
      startDate: '',
      salary: '',
      phone: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-card-foreground">Add New Employee</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              iconName="X"
              className="text-muted-foreground hover:text-foreground"
            />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
              required
              disabled={isLoading}
            />
            
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={errors.lastName}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
              disabled={isLoading}
            />
            
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Department"
              name="department"
              value={formData.department}
              onChange={(value) => handleSelectChange('department', value)}
              options={departments}
              error={errors.department}
              required
              disabled={isLoading}
            />
            
            <Input
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              error={errors.position}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Manager"
              name="manager"
              value={formData.manager}
              onChange={(value) => handleSelectChange('manager', value)}
              options={managers}
              error={errors.manager}
              disabled={isLoading}
            />
            
            <Input
              label="Start Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              error={errors.startDate}
              required
              disabled={isLoading}
            />
          </div>
          
          <Input
            label="Salary (Optional)"
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            error={errors.salary}
            disabled={isLoading}
            placeholder="Enter annual salary"
          />
          
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName="UserPlus"
              iconPosition="left"
            >
              {isLoading ? 'Adding Employee...' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
