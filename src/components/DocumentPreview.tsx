import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';

interface DocumentPreviewProps {
  content: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ content }) => {
  const handleDownloadPDF = () => {
    const element = document.getElementById('document-content');
    const opt = {
      margin: [15, 15],
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait'
      }
    };
    
    // Add temporary styles for PDF generation
    const originalStyle = element?.style.cssText;
    if (element) {
      element.style.width = '210mm'; // A4 width
      element.style.padding = '20mm';
      element.style.backgroundColor = 'white';
    }

    html2pdf().set(opt).from(element).save().then(() => {
      // Restore original styles
      if (element && originalStyle !== undefined) {
        element.style.cssText = originalStyle;
      }
    });
  };

  const handleDownloadTXT = () => {
    // Convert markdown to plain text by removing markdown syntax
    const plainText = content
      .replace(/#{1,6} /g, '') // Remove headers
      .replace(/\*\*/g, '') // Remove bold
      .replace(/\*/g, '') // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
      .replace(/^\s*[-+*]\s/gm, '• ') // Convert list items to bullets
      .replace(/^\s*\d+\.\s/gm, '• ') // Convert numbered lists to bullets
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
      .replace(/\n{3,}/g, '\n\n') // Normalize spacing
      .trim();

    const blob = new Blob([plainText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.txt';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Document Preview
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={handleDownloadPDF}
            className="border-2 hover:bg-blue-50 transition-colors duration-300"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleDownloadTXT}
            className="border-2 hover:bg-blue-50 transition-colors duration-300"
          >
            <Download className="w-4 h-4 mr-2" />
            TXT
          </Button>
        </div>
      </div>
      <Card className="flex-1 p-6 overflow-auto shadow-xl">
        <div 
          id="document-content" 
          className="prose max-w-none dark:prose-invert prose-headings:text-blue-900 prose-a:text-blue-600 prose-strong:text-blue-900 prose-blockquote:border-blue-600"
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </Card>
    </div>
  );
};

export default DocumentPreview;