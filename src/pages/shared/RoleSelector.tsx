import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Leaf, Volume2 } from 'lucide-react';

const RoleSelector: React.FC = () => {
  const { setRole, setLanguage, language } = useAppContext();
  const navigate = useNavigate();

  const handleStart = (selectedRole: 'collector' | 'recycler') => {
    setRole(selectedRole);
    navigate(`/${selectedRole}`);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'hi') utterance.lang = 'hi-IN';
      else if (language === 'mr') utterance.lang = 'mr-IN';
      else utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <Leaf className="w-16 h-16 text-green-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">ECOSETU</h1>
          <p className="text-lg text-gray-600 font-medium">
            {language === 'hi' ? 'आपका ई-वेस्ट, सही कीमत पर सही जगह।' : 
             language === 'mr' ? 'तुमचा ई-कचरा, योग्य किमतीत योग्य ठिकाणी.' : 
             'Your e-waste, right price, right place.'}
          </p>
          <button onClick={() => speak(language === 'en' ? 'Your e-waste, right price, right place.' : 'Aapka e-waste, sahi keemat par sahi jagah')} className="text-gray-400 hover:text-green-600 transition-colors">
            <Volume2 className="w-6 h-6 inline" />
          </button>
        </div>

        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => setLanguage('hi')}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${language === 'hi' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            🇮🇳 हिंदी
          </button>
          <button 
            onClick={() => setLanguage('mr')}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${language === 'mr' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            मराठी
          </button>
          <button 
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${language === 'en' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            English
          </button>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Select your role to start</p>
          <button
            onClick={() => handleStart('collector')}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-4 rounded-2xl shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>{language === 'en' ? 'Start as Collector' : 'कलेक्टर के रूप में शुरू करें'}</span>
          </button>
          
          <button
            onClick={() => handleStart('recycler')}
            className="w-full bg-white border-2 border-gray-200 hover:border-green-600 text-gray-700 font-bold py-4 rounded-2xl transition-all active:scale-95"
          >
            {language === 'en' ? 'Recycler Login' : 'रिसाइकलर लॉगिन'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
