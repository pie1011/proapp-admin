import React, { useState } from 'react';

const CopyButton = ({ text, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="btn btn-sm btn-outline-secondary ms-2 copy-btn"
      title={`Copy ${label || 'text'}`}
      style={{
        padding: '0.25rem 0.5rem',
        fontSize: '0.75rem',
        border: 'none',
        borderRadius: '4px',
        background: copied ? '#28a745' : '#f8f9fa',
        color: copied ? 'white' : '#6c757d',
        transition: 'color 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          e.target.style.color = '#495057'; // Slightly darker gray
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          e.target.style.color = '#6c757d'; // Back to original gray
        }
      }}
    >
      {copied ? (
        <i className="fas fa-check" style={{color: 'inherit'}}></i>
      ) : (
        <i className="fas fa-copy" style={{color: 'inherit'}}></i>
      )}
    </button>
  );
};

export default CopyButton;