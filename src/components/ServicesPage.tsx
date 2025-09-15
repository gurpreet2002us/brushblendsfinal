import React from 'react';
import { Brush, Hammer, Palette, ArrowRight, CheckCircle } from 'lucide-react';
import { useArtworks } from '../hooks/useArtworks';

interface ServicesPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function ServicesPage({ onNavigate }: ServicesPageProps) {
  const { artworks } = useArtworks();
  const fabricArtwork = artworks.find(a => a.category?.toLowerCase() === 'fabric painting' && a.images && a.images.length > 0);
  const fabricImg = fabricArtwork?.images?.[0] || 'https://telxrnjmmvhmmryfqxuo.supabase.co/storage/v1/object/public/images/artwork-images/1752063861593-4rm83xh09zm.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  const tailoringImg = '/stitching-tailoring.png';
  const tailoringFallback = 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Services</h1>
          <p className="text-lg text-gray-600">Fabric painting is our hero service. Stitching is available as an optional add-on. Explore offerings below.</p>
        </div>
      </section>

      {/* Fabric Painting */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
              <Brush className="h-4 w-4 mr-2" />
              Core Service
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Custom Fabric Painting</h2>
            <p className="text-gray-700 mb-6">We hand-paint your chosen fabric with premium, wash-safe textile paints. Bring your own fabric or let us source it. Perfect for dupattas, sarees, suits, and gowns.</p>
            <ul className="space-y-2 mb-6">
              {["Client-provided or sourced fabric","Design consultation with references","Durable, vibrant paints","Sealed and heat-set for longevity"].map((point) => (
                <li key={point} className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />{point}
                </li>
              ))}
            </ul>
            <div className="flex gap-3">
              <button onClick={() => onNavigate('custom-order')} className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700">
                Start Custom Order
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button onClick={() => onNavigate('gallery')} className="inline-flex items-center px-6 py-3 border-2 border-amber-600 text-amber-600 rounded-lg font-semibold hover:bg-amber-50">
                View Painted Fabrics
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <img src={fabricImg} alt="Fabric painting example" className="w-full h-80 object-cover" />
          </div>
        </div>
      </section>

      {/* Stitching Add-on */}
      <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1 bg-white rounded-2xl shadow-md overflow-hidden">
            <img src={tailoringImg} alt="Suit tailoring and stitching" className="w-full h-80 object-cover" onError={(e) => { const t = e.target as HTMLImageElement; if (t.src !== tailoringFallback) t.src = tailoringFallback; }} />
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
              <Hammer className="h-4 w-4 mr-2 text-amber-700" />
              Optional Add-on
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Stitching</h2>
            <p className="text-gray-700 mb-6">Turn your painted fabric into a ready-to-wear outfit. Choose from standard silhouettes or share a reference.</p>
            <ul className="space-y-2 mb-6">
              {["Custom sizing and fitting","Finishings to protect artwork","Timelines aligned with painting"].map((point) => (
                <li key={point} className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-amber-600 mr-2" />{point}
                </li>
              ))}
            </ul>
            <button onClick={() => onNavigate('custom-order')} className="inline-flex items-center px-6 py-3 border-2 border-amber-600 text-amber-700 rounded-lg font-semibold hover:bg-amber-600 hover:text-white transition-colors">
              Add Stitching During Order
            </button>
          </div>
        </div>
      </section>

      {/* Other Services / Shop distinction */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Artworks & Other Services</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow p-6">
              <Palette className="h-8 w-8 text-amber-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Oil Paintings</h4>
              <p className="text-gray-600 mb-4">Timeless canvas artworks available in the shop.</p>
              <button onClick={() => onNavigate('oil')} className="text-amber-600 font-semibold hover:underline">Browse Oil Paintings →</button>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <Palette className="h-8 w-8 text-emerald-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Handcraft Items</h4>
              <p className="text-gray-600 mb-4">Unique artisanal products available for direct checkout.</p>
              <button onClick={() => onNavigate('handcraft')} className="text-emerald-600 font-semibold hover:underline">Browse Handcraft →</button>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <Palette className="h-8 w-8 text-blue-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Skin Care</h4>
              <p className="text-gray-600 mb-4">Skincare and oils offered as products in the shop.</p>
              <button onClick={() => onNavigate('skin-care')} className="text-blue-600 font-semibold hover:underline">Browse Skin Care →</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 