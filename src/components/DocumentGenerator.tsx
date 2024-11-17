import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, FileText } from 'lucide-react';
import { generateDocument, editDocument } from '@/lib/gemini';
import DocumentPreview from './DocumentPreview';
import ChatInterface from './ChatInterface';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const DocumentGenerator = () => {
  const [view, setView] = useState('input');
  const [prompt, setPrompt] = useState('');
  const [document, setDocument] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const generatedContent = await generateDocument(prompt);
      setDocument(generatedContent);
      setView('editor');
      setMessages([
        {
          role: 'assistant',
          content: 'I\'ve generated your document. How would you like to improve it?',
        },
      ]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || loading) return;
    
    const userMessage = chatInput;
    setChatInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    
    setLoading(true);
    try {
      const updatedContent = await editDocument(document, userMessage);
      setDocument(updatedContent);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I\'ve updated the document based on your request. What else would you like to change?',
        },
      ]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update document. Please try again.',
        variant: 'destructive',
      });
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (view === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="bg-white rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <FileText className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Document Generator
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Transform your ideas into professional documents instantly
            </p>
          </div>
          <Card className="p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col gap-6">
              <Input
                placeholder="Describe the document you want to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="text-lg p-6 border-2 focus:border-blue-500"
              />
              <Button 
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</>
                ) : (
                  'Generate Document'
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex">
      {/* Document Preview - Left Side */}
      <div className="flex-1 p-6">
        <DocumentPreview content={document} />
      </div>

      {/* Chat Interface - Right Side */}
      <div className="w-[400px] p-6 bg-white shadow-lg">
        <ChatInterface
          messages={messages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleSendMessage={handleSendMessage}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default DocumentGenerator;