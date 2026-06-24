import { useRef, useState } from 'react';

export default function FileUpload({ onTextReady }) {
  const inputRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [pasteValue, setPasteValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    setStatus('loading');
    setError('');
    setFileName(file.name);
    try {
      const { extractText } = await import('../utils/textExtractor.js');
      const text = await extractText(file);
      if (!text || !text.trim()) {
        throw new Error('No readable text was found in that file.');
      }
      setStatus('idle');
      onTextReady(text, file.name);
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Something went wrong reading that file.');
    }
  }

  function handleInputChange(e) {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }

  function handlePasteSubmit(e) {
    e.preventDefault();
    if (!pasteValue.trim()) return;
    onTextReady(pasteValue, 'Pasted text');
  }

  return (
    <div className="upload">
      <div
        className={`upload-dropzone ${isDragging ? 'is-dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".docx,.pdf,.txt"
          onChange={handleInputChange}
          hidden
        />
        <div className="upload-icon" aria-hidden="true">⇧</div>
        <p className="upload-title">
          {status === 'loading' ? `Reading ${fileName}…` : 'Drop a .docx, .pdf, or .txt file'}
        </p>
        <p className="upload-subtitle">or click to browse</p>
        {status === 'error' && <p className="upload-error">{error}</p>}
      </div>

      <div className="upload-divider">
        <span>or paste text</span>
      </div>

      <form className="upload-paste" onSubmit={handlePasteSubmit}>
        <textarea
          placeholder="Paste any text here…"
          value={pasteValue}
          onChange={(e) => setPasteValue(e.target.value)}
          rows={5}
        />
        <button type="submit" className="btn btn-primary" disabled={!pasteValue.trim()}>
          Start reading
        </button>
      </form>
    </div>
  );
}
