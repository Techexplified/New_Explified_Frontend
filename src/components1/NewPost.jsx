import { useState } from 'react';
import { Upload, Play, ArrowLeft, ArrowRight, X, MapPin, Music, Users, Camera, CircleSlash2, Edit, Pencil } from 'lucide-react';

export default function NewPostPage() {
  const [activeTab, setActiveTab] = useState('Post');
  const [showUploadScreen, setShowUploadScreen] = useState(false);
  const [showEditScreen, setShowEditScreen] = useState(false);
  const [showPreviewScreen, setShowPreviewScreen] = useState(false);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00 pm');

  const handleNext = () => {
    if (showUploadScreen && !showEditScreen && !showPreviewScreen) {
      setShowEditScreen(true);
    } else if (showEditScreen && !showPreviewScreen) {
      setShowPreviewScreen(true);
    }
  };

  const handleBack = () => {
    if (showPreviewScreen) {
      setShowPreviewScreen(false);
    } else if (showEditScreen) {
      setShowEditScreen(false);
    } else if (showUploadScreen) {
      setShowUploadScreen(false);
    }
  };

  const timeOptions = ['08:00 Am', '09:00 pm', '12:00 Pm', 'Custom'];

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 lg:px-12 mt-[-30px]">
      {/* Header Navigation */}
      
      {(showUploadScreen || showEditScreen || showPreviewScreen) && (
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 border border-cyan-400 text-cyan-400 px-5 py-2 rounded-full text-sm lg:text-base hover:bg-cyan-400 hover:text-black transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          {showUploadScreen && !showEditScreen && !showPreviewScreen && (
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 border border-cyan-400 text-cyan-400 px-5 py-2 rounded-full text-sm lg:text-base hover:bg-cyan-400 hover:text-black transition"
            >
              Next
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col items-center max-w-7xl mx-auto mt-2">
        <h1 className="text-3xl lg:text-4xl font-light mb-6">
          {showPreviewScreen ? 'Preview' : 'New Post'}
        </h1>

        {/* Progress Bar */}
        <div className="w-full max-w-2xl mb-10">
          <div className="w-full bg-gray-600 rounded-full h-3">
            <div className={`bg-cyan-400 h-3 rounded-full transition-all duration-500 ${
              showPreviewScreen ? 'w-full' : showEditScreen ? 'w-2/3' : 'w-1/3'
            }`}></div>
          </div>
        </div>

        {/* Toggle */}
        {!showEditScreen && !showPreviewScreen && (
          <div className="flex items-center gap-6 mb-12">
            <button
              onClick={() => setActiveTab('Post')}
              className={`text-xl lg:text-2xl ${activeTab === 'Post' ? 'text-white' : 'text-gray-500'}`}
            >
              Post
            </button>
            <div
              onClick={() => setActiveTab(activeTab === 'Post' ? 'Reel' : 'Post')}
              className={`w-14 h-8 bg-gray-600 rounded-full flex items-center transition-colors duration-300 cursor-pointer ${
                activeTab === 'Reel' ? 'bg-cyan-400' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  activeTab === 'Reel' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </div>
            <button
              onClick={() => setActiveTab('Reel')}
              className={`text-xl lg:text-2xl ${activeTab === 'Reel' ? 'text-white' : 'text-gray-500'}`}
            >
              Reel
            </button>
          </div>
        )}

        {/* Content Area */}
        {!showUploadScreen ? (
          <div className="w-full max-w-2xl">
            {/* Upload Message Box */}
            <div className="border border-gray-700 rounded-xl p-10 text-center mb-10">
              <p className="text-gray-300 text-lg lg:text-xl leading-relaxed">
                Just upload the content
                <br />
                and
                <br />
                let us take care of the formalities
              </p>
            </div>

            {/* Upload Button */}
            <div className="flex justify-center mb-10">
              <button 
                onClick={() => setShowUploadScreen(true)}
                className="flex items-center gap-3 border-2 border-cyan-400 text-cyan-400 px-10 py-4 text-lg rounded-full hover:bg-cyan-400 hover:text-black transition"
              >
                <Upload size={22} />
                Upload
              </button>
            </div>

            {/* Ask Questions */}
            <div className="relative">
              <input
                type="text"
                placeholder="Ask me questions"
                className="w-full bg-transparent border border-gray-600 rounded-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 text-base lg:text-lg"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-cyan-400 rounded-full p-3 hover:bg-cyan-300 transition">
                <Play size={18} className="text-black ml-0.5" />
              </button>
            </div>
          </div>
        ) : showPreviewScreen ? (
          /* Preview Screen */
          <div className="w-full max-w-2xl">
            {/* Preview Images */}
            <div className="flex justify-center gap-4 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-24 h-24 bg-gray-400 rounded-lg" />
              ))}
            </div>

            {/* Content Strength */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-white text-lg">Content strength :</span>
              <span className="text-green-500 text-lg font-semibold">Strong</span>
            </div>

            {/* Filters Section */}
            <div className="mb-2">
              <h3 className="text-white text-lg mb-2">Filters :</h3>
              <div className="flex justify-center">
                <div className="w-32 h-20 bg-gray-600 rounded-lg" />
              </div>
            </div>

            {/* Caption Section */}
            <div className="mb-6">
              <h3 className="text-white text-lg mb-3">Caption :</h3>
              <div className="relative border border-cyan-400 rounded-lg">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-black mt-3 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-300 resize-none "
                  rows={3}
                  placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, enim! Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, enim!"
                />
                
                <button className="absolute top-3 right-3 text-gray-400 hover:text-white">
                  <Pencil size={20} />
                </button>
              </div>
            </div>

            {/* Additional Options with Cyan Borders */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-4">
                <Music size={20} className="text-gray-400" />
                <span className="text-gray-400">-</span>
                <div className="flex-1 border border-cyan-400 rounded-lg px-4 py-2">
                  <select className="bg-transparent text-white w-full focus:outline-none">
                    <option value="">Select music</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <MapPin size={20} className="text-gray-400" />
                <span className="text-gray-400">-</span>
                <div className="flex-1 border border-cyan-400 rounded-lg px-4 py-2">
                  <select className="bg-transparent text-white w-full focus:outline-none">
                    <option value="">Add location</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Users size={20} className="text-gray-400" />
                <span className="text-gray-400">-</span>
                <div className="flex-1  border border-cyan-400 rounded-lg px-4 py-2">
                  <select className="bg-transparent text-white w-full focus:outline-none">
                    <option value="">Tag people</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Camera size={20} className="text-gray-400" />
                <span className="text-gray-400">-</span>
                <div className="flex-1  border border-cyan-400 rounded-lg px-4 py-2">
                  <select className="bg-transparent text-white w-full focus:outline-none">
                    <option value="">Camera settings</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Scheduled Time */}
            <div className="text-center mb-6">
              <p className="text-white text-lg">Scheduled at : {selectedTime}</p>
            </div>

            {/* Schedule Button */}
            <div className="flex justify-center mb-8">
              <button className="bg-black text-white border px-8 py-3 rounded-full text-lg font-medium hover:bg-cyan-400 hover:text-black transition">
                Schedule
              </button>
            </div>

            {/* Ask Questions */}
            <div className="relative">
              <input
                type="text"
                placeholder="Ask me questions"
                className="w-full bg-transparent border border-gray-600 rounded-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 text-base lg:text-lg"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-cyan-400 rounded-full p-3 hover:bg-cyan-300 transition">
                <Play size={18} className="text-black ml-0.5" />
              </button>
            </div>
          </div>
        ) : showEditScreen ? (
          /* Edit Screen */
          <div className="w-full max-w-4xl">
            {/* Preview Images */}
            <div className="flex justify-center gap-4 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-32 h-32 bg-gray-400 rounded-lg" />
              ))}
            </div>

            {/* Filters Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg">Filters :</h3>
                <button className="text-cyan-400 hover:text-cyan-300 transition">
                  See more
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                <div className="w-20 h-20 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-gray-400">
                  <CircleSlash2 />
                </div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-20 bg-gray-600 rounded-lg flex-shrink-0" />
                ))}
              </div>
            </div>

            {/* Caption Section */}
            <div className="mb-6">
              <h3 className="text-white text-lg mb-3">Caption :</h3>
              <div className="relative border border-cyan-400 rounded-lg">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-black mt-3 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-300 resize-none "
                  rows={3}
                  placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, enim! Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, enim!"
                />
                
                <button className="absolute top-3 right-3 text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Hashtags Section */}
            <div className="mb-6">
              <h3 className="text-white text-lg mb-3">Hashtags :</h3>
              <div className="relative border border-cyan-400 rounded-lg">
                <textarea
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="w-full bg-black mt-3 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-300 resize-none "
                  rows={2}
                  placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, enim! Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, enim!"
                />
                
                <button className="absolute top-3 right-3 text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Additional Options */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-4">
                <Music size={20} className="text-gray-400" />
                <span className="text-gray-400">-</span>
                <div className="flex-1 border border-cyan-400 rounded-lg px-4 py-2">
                  <select className="bg-transparent text-white w-full focus:outline-none">
                    <option value="">Select music</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <MapPin size={20} className="text-gray-400" />
                <span className="text-gray-400">-</span>
                <div className="flex-1 border border-cyan-400 rounded-lg px-4 py-2">
                  <select className="bg-transparent text-white w-full focus:outline-none">
                    <option value="">Add location</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Users size={20} className="text-gray-400" />
                <span className="text-gray-400">-</span>
                <div className="flex-1  border border-cyan-400 rounded-lg px-4 py-2">
                  <select className="bg-transparent text-white w-full focus:outline-none">
                    <option value="">Tag people</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Camera size={20} className="text-gray-400" />
                <span className="text-gray-400">-</span>
                <div className="flex-1  border border-cyan-400 rounded-lg px-4 py-2">
                  <select className="bg-transparent text-white w-full focus:outline-none">
                    <option value="">Camera settings</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Best Time to Post */}
            <div className="mb-4">
              <h3 className="text-white text-lg mb-4">Best time to post :</h3>
              <div className="flex gap-4 flex-wrap">
                {timeOptions.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-6 py-2 rounded-full border transition ${
                      selectedTime === time
                        ? 'border-cyan-400 bg-cyan-400 text-black'
                        : 'border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className='flex justify-end'>
              <button 
                onClick={handleNext}
                className="flex items-center gap-2 border border-cyan-400 text-cyan-400 px-5 py-2 rounded-full text-sm lg:text-base hover:bg-cyan-400 hover:text-black transition"
              >
                Next
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Ask Questions */}
            <div className="mt-4 relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Ask me questions"
                className="w-full bg-transparent border border-gray-600 rounded-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 text-base lg:text-lg"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-cyan-400 rounded-full p-3 hover:bg-cyan-300 transition">
                <Play size={18} className="text-black ml-0.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Upload Screen */
          <div className="w-full max-w-6xl">
            {/* Preview Grid */}
            <div className="flex justify-center flex-wrap gap-6 mb-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-40 h-40 bg-gray-400 rounded-xl" />
              ))}
            </div>

            {/* Content Strength */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-white text-xl">Content strength :</span>
              <span className="text-red-500 text-xl">Weak</span>
            </div>

            {/* Tools */}
            <div className="mb-12 text-center">
              <p className="text-white text-xl mb-6">Use our tools to improvise :</p>
              <div className="flex justify-center flex-wrap gap-4">
                {['Ai video generator', 'BG Editor', 'Auto Uploader'].map((tool) => (
                  <button
                    key={tool}
                    className="border border-gray-600 text-gray-300 px-6 py-3 rounded-full text-base hover:border-[#23b5b5] hover:text-[#23b5b5] transition"
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>

            {/* Ask Again */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Ask me questions"
                className="w-full bg-transparent border border-gray-600 rounded-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 text-base lg:text-lg"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-cyan-400 rounded-full p-3 hover:bg-cyan-300 transition">
                <Play size={18} className="text-black ml-0.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}