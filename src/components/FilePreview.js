import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { supabase } from '../lib/supabase';
import CopyButton from './CopyButton';

const FilePreview = ({ file }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFileUrl = async () => {
      try {
        const { data } = await supabase.storage
          .from('quote-files')
          .createSignedUrl(file.storage_path, 3600); // URL valid for 1 hour

        if (data?.signedUrl) {
          setFileUrl(data.signedUrl);
        }
      } catch (error) {
        console.error('Error getting file URL:', error);
      } finally {
        setLoading(false);
      }
    };

    if (file.storage_path) {
      getFileUrl();
    }
  }, [file.storage_path]);

  const isImage = (fileName) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  };

  const getFileIcon = (fileName) => {
    if (isImage(fileName)) return 'fas fa-image';
    if (/\.pdf$/i.test(fileName)) return 'fas fa-file-pdf';
    if (/\.(doc|docx)$/i.test(fileName)) return 'fas fa-file-word';
    if (/\.(xls|xlsx)$/i.test(fileName)) return 'fas fa-file-excel';
    return 'fas fa-file-alt';
  };

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = file.file_name;
      link.click();
    }
  };

  if (loading) {
    return (
      <Card className="file-card">
        <Card.Body className="text-center">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 mb-0">Loading file...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="file-card" style={{ height: '100%' }}>
      <Card.Body className="text-center d-flex flex-column">
        {isImage(file.file_name) && fileUrl ? (
          <div className="mb-2" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={fileUrl} 
              alt={file.file_name}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '150px',
                objectFit: 'cover',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={handleDownload}
            />
          </div>
        ) : (
          <div className="mb-2" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i 
              className={`${getFileIcon(file.file_name)} file-icon`} 
              style={{ fontSize: '3rem', color: 'var(--primary-blue)' }}
            ></i>
          </div>
        )}
        
        <div className="mt-auto">
          <h6 className="file-name mb-1" style={{ fontSize: '0.9rem' }}>
            {file.file_name}
            <CopyButton text={file.file_name} label="file name" />
          </h6>
          <small className="file-info text-muted d-block mb-2">
            {(file.file_size / 1024 / 1024).toFixed(2)} MB
          </small>
          
          {fileUrl && (
            <Button 
              size="sm" 
              variant="outline-primary" 
              onClick={handleDownload}
              className="w-100"
            >
              <i className="fas fa-download me-1"></i>
              Download
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default FilePreview;