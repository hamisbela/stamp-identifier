import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, Mail, ImageIcon, Loader2 } from 'lucide-react';
import { analyzeImage } from '../lib/gemini';
import SupportBlock from '../components/SupportBlock';

// Default stamp image path
const DEFAULT_IMAGE = "/default-stamp.jpeg";

// Default analysis for the stamp
const DEFAULT_ANALYSIS = `1. Stamp Identification:
- Name: 1-cent Benjamin Franklin
- Country of Origin: United States
- Year of Issue: 1851
- Scott Catalog Number: US #5
- Series/Collection: First U.S. Postage Stamps
- Denomination: 1 cent
- Color: Blue

2. Historical & Design Details:
- Subject/Theme: Benjamin Franklin (First U.S. Postmaster General)
- Designer: Unknown
- Printer: Toppan, Carpenter, Casilear & Co.
- Printing Method: Line engraving
- Paper Type: Handmade, slightly bluish
- Perforations: Imperforate
- Watermark: None
- Notable Features: Franklin facing right profile, classic design

3. Condition Assessment:
- Overall Condition: Fine
- Centering: Decent, slightly shifted to left
- Gum/Back: Original gum with light hinge mark
- Cancellation: Light circular date stamp
- Faults: Minor corner crease, small thin
- Color Freshness: Good, minimal fading
- Visual Appeal: Above average

4. Rarity & Valuation:
- Scarcity: Moderately scarce
- Estimated Value (Used): $150-200 USD
- Estimated Value (Mint): $500-600 USD
- Recent Auction Results: Similar examples sold for $175-275 depending on condition
- Value Trend: Steadily increasing
- Demand Level: Moderate to high (popular with US collectors)
- Investment Potential: Good long-term value retention

5. Additional Information:
- Historical Context: Among the first general issue stamps of the United States
- Interesting Facts: Benjamin Franklin was chosen as he established the U.S. postal system
- Common Forgeries: Look for crude line work and incorrect paper
- Collection Recommendations: Essential for any U.S. classics collection
- Similar Stamps: Compare with later Franklin issues of 1857-61
- Authentication Recommendations: Certificate recommended for high-value examples`;

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load default image and analysis without API call
    const loadDefaultContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(DEFAULT_IMAGE);
        if (!response.ok) {
          throw new Error('Failed to load default image');
        }
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setImage(base64data);
          setAnalysis(DEFAULT_ANALYSIS);
          setLoading(false);
        };
        reader.onerror = () => {
          setError('Failed to load default image');
          setLoading(false);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Error loading default image:', err);
        setError('Failed to load default image');
        setLoading(false);
      }
    };

    loadDefaultContent();
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('Image size should be less than 20MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      setError(null);
      handleAnalyze(base64String);
    };
    reader.onerror = () => {
      setError('Failed to read the image file. Please try again.');
    };
    reader.readAsDataURL(file);

    // Reset the file input so the same file can be selected again
    e.target.value = '';
  }, []);

  const handleAnalyze = async (imageData: string) => {
    setLoading(true);
    setError(null);
    const stampPrompt = "Analyze this stamp image and provide the following information:\n1. Stamp identification (name, country of origin, year of issue, catalog number, series/collection, denomination, color)\n2. Historical and design details (subject/theme, designer, printer, printing method, paper type, perforations, watermark, notable features)\n3. Condition assessment (overall condition, centering, gum/back, cancellation, faults, color freshness, visual appeal)\n4. Rarity and valuation (scarcity, estimated value for used and mint conditions, recent auction results, value trend, demand level, investment potential)\n5. Additional information (historical context, interesting facts, common forgeries, collection recommendations, similar stamps, authentication recommendations)\n\nThis is for informational purposes only. Provide estimated values in USD.";
    try {
      const result = await analyzeImage(imageData, stampPrompt);
      setAnalysis(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatAnalysis = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Remove any markdown-style formatting
      const cleanLine = line.replace(/[*_#`]/g, '').trim();
      if (!cleanLine) return null;

      // Format section headers (lines starting with numbers)
      if (/^\d+\./.test(cleanLine)) {
        return (
          <div key={index} className="mt-8 first:mt-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {cleanLine.replace(/^\d+\.\s*/, '')}
            </h3>
          </div>
        );
      }
      
      // Format list items with specific properties
      if (cleanLine.startsWith('-') && cleanLine.includes(':')) {
        const [label, ...valueParts] = cleanLine.substring(1).split(':');
        const value = valueParts.join(':').trim();
        return (
          <div key={index} className="flex gap-2 mb-3 ml-4">
            <span className="font-semibold text-gray-800 min-w-[120px]">{label.trim()}:</span>
            <span className="text-gray-700">{value}</span>
          </div>
        );
      }
      
      // Format regular list items
      if (cleanLine.startsWith('-')) {
        return (
          <div key={index} className="flex gap-2 mb-3 ml-4">
            <span className="text-gray-400">•</span>
            <span className="text-gray-700">{cleanLine.substring(1).trim()}</span>
          </div>
        );
      }

      // Regular text
      return (
        <p key={index} className="mb-3 text-gray-700">
          {cleanLine}
        </p>
      );
    }).filter(Boolean);
  };

  return (
    <div className="bg-gray-50 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Free Stamp Identifier</h1>
          <p className="text-base sm:text-lg text-gray-600">Upload a stamp photo for identification, historical information, and valuation</p>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-12">
          <div className="flex flex-col items-center justify-center mb-6">
            <label 
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Upload className="h-5 w-5" />
              Upload Stamp Photo
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleImageUpload}
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">PNG, JPG, JPEG or WEBP (MAX. 20MB)</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading && !image && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          )}

          {image && (
            <div className="mb-6">
              <div className="relative rounded-lg mb-4 overflow-hidden bg-gray-100">
                <img
                  src={image}
                  alt="Stamp preview"
                  className="w-full h-auto max-h-[500px] object-contain mx-auto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnalyze(image)}
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="-ml-1 mr-2 h-5 w-5" />
                      Identify Stamp
                    </>
                  )}
                </button>
                <button
                  onClick={triggerFileInput}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Another Photo
                </button>
              </div>
            </div>
          )}

          {analysis && (
            <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Stamp Analysis Results</h2>
              <div className="text-gray-700">
                {formatAnalysis(analysis)}
              </div>
            </div>
          )}
        </div>

        <SupportBlock />

        <div className="prose max-w-none my-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Free Stamp Identifier: Your Ultimate Philatelic Recognition Tool</h2>
          
          <p>Welcome to our free stamp identifier tool, powered by advanced artificial intelligence technology.
             This tool helps you identify postage stamps from around the world, providing essential information about their 
             origin, historical significance, condition, and estimated value.</p>

          <h3>How Our Stamp Identifier Works</h3>
          <p>Our tool uses AI to analyze stamp photos and provide detailed information about the postage stamps.
             Simply upload a clear photo of any stamp, and our AI will help you identify its country of origin, 
             approximate date, rarity, and estimated value - perfect for collectors, philatelists, and those who've 
             discovered stamps in old correspondence.</p>

          <h3>Key Features of Our Stamp Identifier</h3>
          <ul>
            <li>Comprehensive stamp recognition for global postal issues</li>
            <li>Detailed historical and design analysis</li>
            <li>Condition assessment and grading guidance</li>
            <li>Rarity information and value estimation</li>
            <li>Philatelic context and collecting recommendations</li>
            <li>100% free to use</li>
          </ul>

          <h3>Perfect For:</h3>
          <ul>
            <li>Stamp collectors and philatelists</li>
            <li>Identifying inherited stamp collections</li>
            <li>Discovering the value of stamps found in attics or old letters</li>
            <li>Learning about postal history and stamp design</li>
            <li>Making informed buying and selling decisions</li>
          </ul>

          <p>Try our free stamp identifier today and discover the fascinating stories behind your postal treasures!
             No registration required - just upload a photo and start exploring the world of philately.</p>
        </div>

        <SupportBlock />
      </div>
    </div>
  );
}