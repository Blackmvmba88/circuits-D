import { useState, useEffect } from 'react';
import { Camera, Upload, Image as ImageIcon } from 'lucide-react';

interface PhotoCaptureProps {
  onPhotoCapture?: (photoData: { url: string; name: string; timestamp: Date }) => void;
}

export function PhotoCapture({ onPhotoCapture }: PhotoCaptureProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCapture = () => {
    if (selectedFile && previewUrl) {
      onPhotoCapture?.({
        url: previewUrl,
        name: selectedFile.name,
        timestamp: new Date(),
      });
      alert(`Photo captured: ${selectedFile.name}\n\nThis is a stub implementation. In a future version, this will:\n- Extract component positions from the image\n- Create a 3D board representation\n- Allow manual annotation of components`);
    }
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="photo-capture">
      <div className="capture-header">
        <div className="header-content">
          <Camera size={24} />
          <div>
            <h2>Board Photo Capture</h2>
            <p className="subtitle">Upload a photo of your PCB for analysis (Phase 0 - Stub)</p>
          </div>
        </div>
      </div>

      <div className="capture-content">
        <div className="upload-area">
          {!previewUrl ? (
            <label htmlFor="photo-upload" className="upload-label">
              <ImageIcon size={48} />
              <span className="upload-text">Click to upload board photo</span>
              <span className="upload-hint">Supported: JPG, PNG (max 10MB)</span>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </label>
          ) : (
            <div className="preview-container">
              <img src={previewUrl} alt="Board preview" className="preview-image" />
              <div className="preview-info">
                <span className="file-name">{selectedFile?.name}</span>
                <span className="file-size">
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : ''}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="capture-info">
          <h3>📸 Photo Capture Pipeline (Roadmap)</h3>
          <div className="info-section">
            <h4>Phase 0 (Current - Stub)</h4>
            <ul>
              <li>✓ File upload interface</li>
              <li>✓ Image preview</li>
              <li>⏳ Save photo metadata to AppState</li>
            </ul>
          </div>
          <div className="info-section">
            <h4>Phase 1 (Manual Annotation)</h4>
            <ul>
              <li>⏳ Click to mark component locations</li>
              <li>⏳ Label components with RefDes</li>
              <li>⏳ Link to netlist</li>
              <li>⏳ Generate 3D board from annotations</li>
            </ul>
          </div>
          <div className="info-section">
            <h4>Phase 2 (Computer Vision)</h4>
            <ul>
              <li>⏳ Automatic component detection</li>
              <li>⏳ PCB outline extraction</li>
              <li>⏳ Component type classification</li>
              <li>⏳ Net tracing from copper traces</li>
            </ul>
          </div>
        </div>

        {previewUrl && (
          <div className="capture-actions">
            <button className="btn-secondary" onClick={handleClear}>
              <Upload size={18} />
              Choose Different Photo
            </button>
            <button className="btn-primary" onClick={handleCapture}>
              <Camera size={18} />
              Capture & Analyze
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PhotoCapture;
