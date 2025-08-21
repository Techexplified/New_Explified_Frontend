import React, { useState, useRef, useEffect } from 'react';
import { Upload, Pencil, Save, ChevronLeft, ChevronRight, FileText, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const SignPdf = () => {
  const [pdfBytes, setPdfBytes] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pageSignatures, setPageSignatures] = useState({});
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  const [scale, setScale] = useState(1); // Higher default scale for better quality
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const containerRef = useRef(null);

  // Load libraries and initialize
  useEffect(() => {
    const loadLibraries = async () => {
      // Load Fabric.js
      if (!window.fabric) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = '/libs/fabric.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Load PDF.js
      if (!window.pdfjsLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = '/libs/pdf.min.js';
          script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/libs/pdf.worker.min.js';
            resolve();
          };
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Load PDF-lib
      if (!window.PDFLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = '/libs/pdf-lib.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      setLibrariesLoaded(true);
    };

    loadLibraries().catch(console.error);
  }, []);

  // Initialize Fabric canvas when libraries are loaded
  useEffect(() => {
    if (librariesLoaded && canvasRef.current && !fabricCanvas.current) {
      try {
        const canvas = new window.fabric.Canvas(canvasRef.current, {
          backgroundColor: '#ffffff',
          selection: true,
          preserveObjectStacking: true,
        });
        
        // Set initial canvas size
        canvas.setHeight(600);
        canvas.setWidth(800);
        
        fabricCanvas.current = canvas;
        
      } catch (error) {
        console.error('Error initializing Fabric canvas:', error);
      }
    }

    return () => {
      if (fabricCanvas.current) {
        fabricCanvas.current.dispose();
        fabricCanvas.current = null;
      }
    };
  }, [librariesLoaded]);

  // Calculate optimal canvas size based on container and PDF dimensions
  const calculateOptimalSize = (pdfWidth, pdfHeight, containerWidth, containerHeight) => {
    const padding = 40; // Padding around the canvas
    const maxWidth = Math.min(containerWidth - padding, 1200); // Max width limit
    const maxHeight = Math.min(containerHeight - padding, 800); // Max height limit
    
    // Calculate scale to fit within container while maintaining aspect ratio
    const scaleToFitWidth = maxWidth / pdfWidth;
    const scaleToFitHeight = maxHeight / pdfHeight;
    const optimalScale = Math.min(scaleToFitWidth, scaleToFitHeight, 2); // Max scale of 2x
    
    return {
      width: Math.round(pdfWidth * optimalScale),
      height: Math.round(pdfHeight * optimalScale),
      scale: optimalScale
    };
  };

  // Save signatures for a specific page
  const savePageSignature = (pageNum) => {
    return new Promise((resolve) => {
      if (!fabricCanvas.current) {
        resolve({});
        return;
      }
      
      const canvas = fabricCanvas.current;
      const signatureObjects = canvas.getObjects().filter(obj => !obj.isBackground);
      
      setPageSignatures(prev => {
        let updated = { ...prev };
        
        if (signatureObjects.length > 0) {
          const signatureData = signatureObjects.map(obj => obj.toObject());
          updated[pageNum] = signatureData;
          
        } else {
          delete updated[pageNum];
          
        }
        
        setTimeout(() => resolve(updated), 0);
        return updated;
      });
    });
  };

  // Get current signatures directly from canvas
  const getCurrentPageSignatures = () => {
    if (!fabricCanvas.current) return [];
    
    const canvas = fabricCanvas.current;
    const signatureObjects = canvas.getObjects().filter(obj => !obj.isBackground);
    
    return signatureObjects.length > 0 ? signatureObjects.map(obj => obj.toObject()) : [];
  };

  // Load signatures for a specific page
  const loadPageSignature = async (pageNum) => {
    if (!fabricCanvas.current) return;
    
    const canvas = fabricCanvas.current;
    
    // Remove all signature objects (keep only background)
    const allObjects = [...canvas.getObjects()];
    allObjects.forEach(obj => {
      if (!obj.isBackground) {
        canvas.remove(obj);
      }
    });

    // Load saved signatures for this page
    if (pageSignatures[pageNum] && pageSignatures[pageNum].length > 0) {
      const signatureData = pageSignatures[pageNum];
      
      
      await new Promise((resolve) => {
        if (signatureData.length === 0) {
          resolve();
          return;
        }
        
        window.fabric.util.enlivenObjects(signatureData, (objects) => {
          objects.forEach(obj => {
            obj.set({ isBackground: false });
            canvas.add(obj);
          });
          canvas.renderAll();
          
          resolve();
        });
      });
    } else {
      // No signatures found for this page
    }
  };

  // Enhanced PDF page rendering with better quality
  const renderPdfPage = async (pageNum, passedPdfDoc = pdfDoc) => {
    const pdfToUse = passedPdfDoc || pdfDoc;
    
    if (!fabricCanvas.current) {
      console.error('Fabric canvas not initialized');
      return;
    }
    if (!pdfToUse) {
      console.error('PDF document not initialized');
      return;
    }

    try {
      
      const page = await pdfToUse.getPage(pageNum);
      
      // Use a simpler, more reliable approach for sizing
      const viewport = page.getViewport({ scale: scale });
      
      // Create temporary canvas for PDF rendering
      const tempCanvas = document.createElement('canvas');
      const context = tempCanvas.getContext('2d');
      tempCanvas.height = viewport.height;
      tempCanvas.width = viewport.width;

      // Render PDF page to temporary canvas
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      // Convert to image data URL
      const imageDataUrl = tempCanvas.toDataURL('image/png');

      // Update Fabric canvas size
      const canvas = fabricCanvas.current;
      canvas.setHeight(viewport.height);
      canvas.setWidth(viewport.width);
      
      // Update canvas size state
      setCanvasSize({ width: viewport.width, height: viewport.height });

      // Clear canvas completely
      canvas.clear();
      
      // Add PDF as background image
      window.fabric.Image.fromURL(imageDataUrl, (fabricImg) => {
        fabricImg.set({
          left: 0,
          top: 0,
          selectable: false,
          evented: false,
          isBackground: true,
          hoverCursor: 'default',
          moveCursor: 'default'
        });
        
        // Clear any existing background
        canvas.setBackgroundImage(null, () => {
          canvas.add(fabricImg);
          canvas.sendToBack(fabricImg);
          canvas.backgroundColor = '#ffffff';
          canvas.renderAll();
          
          console.log(`Background image set for page ${pageNum}`);
          console.log(`Canvas size: ${viewport.width}x${viewport.height}`);
          
          // Load signatures after background is properly set
          setTimeout(async () => {
            await loadPageSignature(pageNum);
          }, 200);
        });
      }, {
        crossOrigin: 'anonymous'
      });

    } catch (error) {
      
      alert('Error rendering PDF page: ' + error.message);
    }
  };

  // Handle PDF upload
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a valid PDF file');
      return;
    }

    if (!librariesLoaded) {
      alert('Libraries are still loading. Please wait...');
      return;
    }

    try {
      
      const arrayBuffer = await file.arrayBuffer();
      setPdfBytes(arrayBuffer.slice(0));
      
      const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      setPageSignatures({});
      
      
      
      // Small delay to ensure state is updated
      setTimeout(async () => {
        await renderPdfPage(1, pdf);
      }, 100);
      
    } catch (error) {
      console.error('Error loading PDF:', error);
      alert('Error loading PDF: ' + error.message);
    }
  };

  // Navigation functions
  const goToPreviousPage = async () => {
    if (currentPage <= 1) return;
    
    const newPage = currentPage - 1;
    
    
    await savePageSignature(currentPage);
    setCurrentPage(newPage);
    await renderPdfPage(newPage);
  };

  const goToNextPage = async () => {
    if (currentPage >= totalPages) return;
    
    const newPage = currentPage + 1;
    
    
    await savePageSignature(currentPage);
    setCurrentPage(newPage);
    await renderPdfPage(newPage);
  };

  // Zoom functions
  const handleZoomIn = async () => {
    if (scale >= 3) return;
    const newScale = Math.min(scale + 0.25, 3);
    setScale(newScale);
    if (pdfDoc && currentPage) {
      setTimeout(async () => {
        await renderPdfPage(currentPage);
      }, 50);
    }
  };

  const handleZoomOut = async () => {
    if (scale <= 0.5) return;
    const newScale = Math.max(scale - 0.25, 0.5);
    setScale(newScale);
    if (pdfDoc && currentPage) {
      setTimeout(async () => {
        await renderPdfPage(currentPage);
      }, 50);
    }
  };

  const handleResetZoom = async () => {
    setScale(1.5);
    if (pdfDoc && currentPage) {
      setTimeout(async () => {
        await renderPdfPage(currentPage);
      }, 50);
    }
  };

  // Toggle drawing mode with enhanced brush settings
  const handleDrawSignature = () => {
    if (!fabricCanvas.current) return;
    
    const canvas = fabricCanvas.current;
    
    if (isDrawing) {
      canvas.isDrawingMode = false;
      setIsDrawing(false);
    } else {
      canvas.isDrawingMode = true;
      // Enhanced brush settings for better quality
      canvas.freeDrawingBrush.width = 3;
      canvas.freeDrawingBrush.color = '#000000';
      canvas.freeDrawingBrush.shadow = {
        blur: 1,
        offsetX: 0,
        offsetY: 0,
        affectStroke: true,
        color: 'rgba(0,0,0,0.1)'
      };
      setIsDrawing(true);
    }
  };

  // Upload signature image with better quality handling
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !fabricCanvas.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const canvas = fabricCanvas.current;
      
      if (canvas.isDrawingMode) {
        canvas.isDrawingMode = false;
        setIsDrawing(false);
      }

      const img = new Image();
      img.onload = () => {
        const fabricImg = new window.fabric.Image(img);
        
        // Better default sizing for uploaded signatures
        const maxWidth = canvas.width * 0.3;
        const maxHeight = canvas.height * 0.15;
        const scaleToFit = Math.min(maxWidth / img.width, maxHeight / img.height);
        
        fabricImg.set({
          left: canvas.width * 0.1,
          top: canvas.height * 0.8,
          scaleX: scaleToFit,
          scaleY: scaleToFit,
          isBackground: false,

          borderColor: '#23b5b5',
          cornerColor: '#23b5b5',
          cornerSize: 12,
          transparentCorners: false,
          cornerStrokeColor: '#ffffff',
          borderDashArray: [5, 5],

          
          shadow: {
            blur: 2,
            offsetX: 1,
            offsetY: 1,
            color: 'rgba(0,0,0,0.1)'
          }
        });
        
        canvas.add(fabricImg);
        canvas.setActiveObject(fabricImg);
        canvas.renderAll();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    
    e.target.value = '';
  };

  // Enhanced save function with better quality preservation
  const handleSaveSignedPdf = async () => {
    if (!pdfBytes || !window.PDFLib) {
      alert('Please upload a PDF first!');
      return;
    }

    try {
      
      
      const currentPageSigs = getCurrentPageSignatures();
      const allSignatures = { ...pageSignatures };
      if (currentPageSigs.length > 0) {
        allSignatures[currentPage] = currentPageSigs;
        console.log(`Including ${currentPageSigs.length} signatures from current page ${currentPage}`);
      }

      
      
      const pdfDoc = await window.PDFLib.PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const signatures = allSignatures[pageNum];
        if (signatures && signatures.length > 0) {
          
          const page = pages[pageNum - 1];
          const { width, height } = page.getSize();

          // Create high-resolution temporary canvas for signatures
          const tempCanvas = document.createElement('canvas');
          const tempFabricCanvas = new window.fabric.Canvas(tempCanvas);
          
          // Use higher resolution for better quality in final PDF
          const exportScale = 2;
          const exportWidth = fabricCanvas.current.width * exportScale;
          const exportHeight = fabricCanvas.current.height * exportScale;
          
          tempFabricCanvas.setWidth(exportWidth);
          tempFabricCanvas.setHeight(exportHeight);

          await new Promise((resolve) => {
            window.fabric.util.enlivenObjects(signatures, (objects) => {
              objects.forEach(obj => {
                // Scale up the objects for higher resolution export
                obj.set({
                  left: obj.left * exportScale,
                  top: obj.top * exportScale,
                  scaleX: (obj.scaleX || 1) * exportScale,
                  scaleY: (obj.scaleY || 1) * exportScale
                });
                tempFabricCanvas.add(obj);
              });
              tempFabricCanvas.renderAll();
              
              resolve();
            });
          });

          // Export with maximum quality
          const sigDataUrl = tempFabricCanvas.toDataURL({
            format: 'png',
            backgroundColor: 'rgba(0,0,0,0)',
            quality: 1,
            multiplier: 1
          });

          if (sigDataUrl && sigDataUrl !== 'data:,' && !sigDataUrl.includes('data:,')) {
            try {
              const pngBytes = await fetch(sigDataUrl).then(res => res.arrayBuffer());
              const pngImage = await pdfDoc.embedPng(pngBytes);

              // Calculate scaling to match PDF page dimensions
              const scaleX = width / exportWidth;
              const scaleY = height / exportHeight;

              page.drawImage(pngImage, {
                x: 0,
                y: 0,
                width: exportWidth * scaleX,
                height: exportHeight * scaleY,
              });
              
              
            } catch (imageError) {
              console.error(`Error adding signature to page ${pageNum}:`, imageError);
            }
          }

          tempFabricCanvas.dispose();
        }
      }

      
      const pdfBytesOutput = await pdfDoc.save();
      const blob = new Blob([pdfBytesOutput], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'signed-document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('High-quality PDF signed and downloaded successfully!');
      
      if (currentPageSigs.length > 0) {
        setPageSignatures(prev => ({
          ...prev,
          [currentPage]: currentPageSigs
        }));
      }
      
    } catch (error) {
      console.error('Error saving PDF:', error);
      alert('Error saving PDF: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen p-4 text-white bg-black flex flex-col items-center" ref={containerRef}>
      <h1 className="text-4xl text-[#23b5b5] font-bold mb-6">Enhanced PDF Signer</h1>

      {/* Loading Status */}
      {!librariesLoaded && (
        <div className="text-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#23b5b5] mx-auto mb-2"></div>
          <p className="text-[#23b5b5]">Loading libraries...</p>
        </div>
      )}

      {librariesLoaded && (
        <>
          {/* Upload Section */}
          <div className="mb-6">
            <label
              htmlFor="fileInput"
              className="inline-flex items-center px-6 py-3 rounded-lg text-black font-semibold cursor-pointer transition-all hover:scale-105"
              style={{ backgroundColor: '#23b5b5' }}
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload PDF
            </label>
            <input
              type="file"
              accept=".pdf"
              id="fileInput"
              className="hidden"
              onChange={handlePdfUpload}
            />
          </div>

          {/* Controls */}
          {totalPages > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-4 bg-gray-800 px-4 py-2 rounded-lg">
              {/* Page Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage <= 1}
                  className="p-2 rounded-md bg-[#23b5b5] text-black disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#23b5b5]" />
                  <span className="text-white font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage >= totalPages}
                  className="p-2 rounded-md bg-[#23b5b5] text-black disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2 border-l border-gray-600 pl-4">
                <button
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5}
                  className="p-2 rounded-md bg-gray-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-all"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                
                <span className="text-white text-sm font-medium min-w-[60px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                
                <button
                  onClick={handleZoomIn}
                  disabled={scale >= 3}
                  className="p-2 rounded-md bg-gray-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-all"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleResetZoom}
                  className="p-2 rounded-md bg-gray-600 text-white hover:bg-gray-500 transition-all"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Signature Tools */}
          {totalPages > 0 && (
            <div className="mb-6 flex gap-4">
              <button
                onClick={handleDrawSignature}
                className={`px-4 py-2 font-semibold rounded-lg transition-all hover:scale-105 ${
                  isDrawing 
                    ? 'bg-red-500 text-white' 
                    : 'bg-[#23b5b5] text-black'
                }`}
              >
                <Pencil className="w-4 h-4 mr-2 inline" />
                {isDrawing ? 'Stop Drawing' : 'Draw Signature'}
              </button>

              <label
                htmlFor="uploadSign"
                className="px-4 py-2 text-black font-semibold rounded-lg cursor-pointer transition-all hover:scale-105"
                style={{ backgroundColor: '#23b5b5' }}
              >
                <Upload className="w-4 h-4 mr-2 inline" />
                Upload Signature
                <input
                  type="file"
                  accept="image/*"
                  id="uploadSign"
                  className="hidden"
                  onChange={handleSignatureUpload}
                />
              </label>
            </div>
          )}

          {/* Enhanced Canvas Container */}
          <div className="border-2 border-gray-700 bg-white rounded-xl overflow-hidden mb-6 shadow-2xl max-w-full">
            <canvas
              ref={canvasRef}
              style={{ 
                display: 'block', 
                maxWidth: '95vw', 
                maxHeight: '75vh'
              }}
            />
          </div>

          {/* Quality Info */}
          {totalPages > 0 && (
            <div className="mb-4 text-center text-gray-400 text-sm">
              Canvas: {canvasSize.width} × {canvasSize.height} pixels | High-Quality Rendering Enabled
            </div>
          )}

          {/* Save Button */}
          {totalPages > 0 && (
            <button
              onClick={handleSaveSignedPdf}
              className="px-8 py-4 rounded-lg text-black font-bold text-lg transition-all hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#23b5b5' }}
            >
              <Save className="w-5 h-5 mr-2 inline" />
              Save High-Quality PDF
            </button>
          )}

          {/* Empty State */}
          {totalPages === 0 && (
            <div className="text-center text-gray-400 mt-8">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Upload a PDF to start signing with enhanced quality</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SignPdf;