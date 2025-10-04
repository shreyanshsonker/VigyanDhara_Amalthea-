import React from 'react';
import Icon from '../AppIcon';

const AuthenticationHeader = ({ showBackButton = false, onBackClick }) => {
  return (
    <header className="w-full bg-background border-b border-border">
      <div className="max-w-md mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {showBackButton ? (
            <button
              onClick={onBackClick}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Back
            </button>
          ) : (
            <div />
          )}
          
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Receipt" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                ExpenseFlow
              </span>
            </div>
          </div>
          
          <div />
        </div>
      </div>
    </header>
  );
};

export default AuthenticationHeader;