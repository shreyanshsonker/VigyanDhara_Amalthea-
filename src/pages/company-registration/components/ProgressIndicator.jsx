import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, title: 'Company Info', description: 'Basic company details' },
    { number: 2, title: 'Admin Account', description: 'Administrator setup' },
    { number: 3, title: 'Configuration', description: 'Initial preferences' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps?.map((step, index) => (
          <div key={step?.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                currentStep > step?.number 
                  ? 'bg-success border-success text-white' 
                  : currentStep === step?.number
                  ? 'bg-primary border-primary text-white' :'bg-background border-border text-muted-foreground'
              }`}>
                {currentStep > step?.number ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <span className="text-sm font-medium">{step?.number}</span>
                )}
              </div>
              <div className="text-center mt-2">
                <p className={`text-sm font-medium ${
                  currentStep >= step?.number ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step?.title}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {step?.description}
                </p>
              </div>
            </div>
            
            {index < steps?.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                currentStep > step?.number ? 'bg-success' : 'bg-border'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;