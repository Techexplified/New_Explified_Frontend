import React, { useState } from 'react';
import { Archive, Merge, FileType, PenTool, RefreshCw, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExplifiedDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  const handleToolClick = (toolId) => {
    console.log(`Opening ${toolId}`);
  };

  return (
    <div className="min-h-screen w-full bg-black text-white p-6">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#23b5b5' }}>
          Welcome to Explified
        </h1>
        <p className="text-lg text-gray-300">All-in-one PDF toolkit</p>
      </header>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Popular Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Compress PDF */}
          <div
            onClick={() => navigate('/pdf-tools/compress')}
            className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 hover:border-[#23b5b5] transition cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white group-hover:bg-[#23b5b5] rounded-lg flex items-center justify-center mr-4">
                <Archive className="w-6 h-6 text-black" />
              </div>
              <h4 className="text-lg font-semibold group-hover:text-[#23b5b5] transition">
                Compress PDF
              </h4>
            </div>
            <p className="text-gray-400 text-sm">Reduce file size while keeping quality.</p>
          </div>

          {/* Merge PDF */}
          <div
            onClick={() => navigate('/pdf-tools/merge')}
            className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 hover:border-[#23b5b5] transition cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white group-hover:bg-[#23b5b5] rounded-lg flex items-center justify-center mr-4">
                <Merge className="w-6 h-6 text-black" />
              </div>
              <h4 className="text-lg font-semibold group-hover:text-[#23b5b5] transition">
                Merge PDF
              </h4>
            </div>
            <p className="text-gray-400 text-sm">Combine multiple PDFs into one.</p>
          </div>

          {/* PDF to Word */}
          <div
            onClick={() => navigate('/pdf-tools/pdftoword')}
            className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 hover:border-[#23b5b5] transition cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white group-hover:bg-[#23b5b5] rounded-lg flex items-center justify-center mr-4">
                <FileType className="w-6 h-6 text-black" />
              </div>
              <h4 className="text-lg font-semibold group-hover:text-[#23b5b5] transition">
                PDF to Word
              </h4>
            </div>
            <p className="text-gray-400 text-sm">Convert PDFs to editable Word docs.</p>
          </div>

          {/* Digital Signature */}
          <div
            onClick={() => navigate('/pdf-tools/sign')}
            className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 hover:border-[#23b5b5] transition cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white group-hover:bg-[#23b5b5] rounded-lg flex items-center justify-center mr-4">
                <PenTool className="w-6 h-6 text-black" />
              </div>
              <h4 className="text-lg font-semibold group-hover:text-[#23b5b5] transition">
                Digital Signature
              </h4>
            </div>
            <p className="text-gray-400 text-sm">Sign documents electronically.</p>
          </div>

          {/* Convert Tools */}
          <div
            onClick={() => navigate('/pdf-tools/pdftoany')}
            className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 hover:border-[#23b5b5] transition cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white group-hover:bg-[#23b5b5] rounded-lg flex items-center justify-center mr-4">
                <RefreshCw className="w-6 h-6 text-black" />
              </div>
              <h4 className="text-lg font-semibold group-hover:text-[#23b5b5] transition">
                Convert Tools
              </h4>
            </div>
            <p className="text-gray-400 text-sm">Convert PDFs to/from other formats.</p>
          </div>

          {/* Edit Text */}
          <div
            onClick={() => navigate('/pdf-tools/edit')}
            className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 hover:border-[#23b5b5] transition cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white group-hover:bg-[#23b5b5] rounded-lg flex items-center justify-center mr-4">
                <Edit3 className="w-6 h-6 text-black" />
              </div>
              <h4 className="text-lg font-semibold group-hover:text-[#23b5b5] transition">
                Edit Text
              </h4>
            </div>
            <p className="text-gray-400 text-sm">Edit text in PDF documents.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExplifiedDashboard;
