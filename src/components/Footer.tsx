import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Logo size="md" variant="light" />
            <p className="text-gray-300 text-sm leading-relaxed">
              Discover beautiful handcrafted fabric paintings, oil artworks, and unique handcraft items. 
              Each piece is carefully created to bring beauty and emotion to your space.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1ENvyjjDzD/" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/brush_n_blends/profilecard/?igsh=bjdibzAxdm9zdjdt" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              {/* <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('home')} className="text-gray-300 hover:text-amber-500 transition-colors duration-200 text-sm">Home</button></li>
              <li><button onClick={() => onNavigate('gallery')} className="text-gray-300 hover:text-amber-500 transition-colors duration-200 text-sm">Gallery</button></li>
              <li><button onClick={() => onNavigate('fabric')} className="text-gray-300 hover:text-amber-500 transition-colors duration-200 text-sm">Fabric Paintings</button></li>
              <li><button onClick={() => onNavigate('oil')} className="text-gray-300 hover:text-amber-500 transition-colors duration-200 text-sm">Oil Paintings</button></li>
              <li><button onClick={() => onNavigate('handcraft')} className="text-gray-300 hover:text-amber-500 transition-colors duration-200 text-sm">Handcraft Items</button></li>
              <li><button onClick={() => onNavigate('about')} className="text-gray-300 hover:text-amber-500 transition-colors duration-200 text-sm">About Us</button></li>
              <li><button onClick={() => onNavigate('contact')} className="text-gray-300 hover:text-amber-500 transition-colors duration-200 text-sm">Contact</button></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Customer Service</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('shipping')} className="text-gray-300 hover:text-amber-500 transition-colors duration-200 text-sm">Shipping Info</button></li>
              <li><button onClick={() => onNavigate('returns')} className="text-gray-300 hover:text-amber-500 transition-colors duration-200 text-sm">Returns & Exchanges</button></li>
              <li><button onClick={() => onNavigate('size-guide')} className="text-gray-300 hover:text-amber-500 transition-colors duration-200 text-sm">Size Guide</button></li>
              <li><button onClick={() => onNavigate('care-instructions')} className="text-gray-300 hover:text-amber-500 transition-colors duration-200 text-sm">Care Instructions</button></li>
              <li><button onClick={() => onNavigate('faq')} className="text-gray-300 hover:text-amber-500 transition-colors duration-200 text-sm">FAQ</button></li>
              <li><button onClick={() => onNavigate('track-order')} className="text-gray-300 hover:text-amber-500 transition-colors duration-200 text-sm">Track Your Order</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span className="text-gray-300 text-sm">info@brushnblends.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span className="text-gray-300 text-sm">+91 98373 78157</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-gray-300 text-sm">
                  <p>H. No. 42, Ganga Lane</p>
                  <p>Vim Square, Kichha Road</p>
                  <p>Rudrapur, Uttarakhand 263153</p>
                  <p>India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h5 className="text-sm font-medium text-gray-400 mb-2">We Accept</h5>
              <div className="flex items-center space-x-4">
                <span className="text-xs bg-gray-800 px-2 py-1 rounded">UPI</span>
                {/* <span className="text-xs bg-gray-800 px-2 py-1 rounded">Cards</span>
                <span className="text-xs bg-gray-800 px-2 py-1 rounded">Net Banking</span> */}
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-gray-400">
                🔒 100% Secure Payments | 📦 Free Shipping Above ₹2000
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2024 Brush n Blends. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <button 
                onClick={() => onNavigate('privacy')}
                className="text-xs text-gray-400 hover:text-amber-500 transition-colors duration-200"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => onNavigate('terms')}
                className="text-xs text-gray-400 hover:text-amber-500 transition-colors duration-200"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => onNavigate('cookies')}
                className="text-xs text-gray-400 hover:text-amber-500 transition-colors duration-200"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}