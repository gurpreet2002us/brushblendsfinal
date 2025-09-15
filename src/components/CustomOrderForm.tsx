import React, { useState, useEffect } from 'react';
import { ArrowRight, Upload, Brush, Hammer, CheckCircle, Eye } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { useSupabase } from '../hooks/useSupabase';

interface CustomOrderFormProps {
  onNavigate: (page: string, data?: any) => void;
}

type Step = 1 | 2 | 3 | 4;

type FabricSource = 'client_provided' | 'purchase_for_me';

type FormState = {
  fabricSource: FabricSource | '';
  fabricNotes: string;
  designStyle: string;
  inspirationFiles: File[];
  wantStitching: boolean | null;
};

type SelectedDesign = {
  artworkId: string;
  title: string;
  image?: string;
  category?: string;
  price?: number;
} | null;

export default function CustomOrderForm({ onNavigate }: CustomOrderFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    fabricSource: '',
    fabricNotes: '',
    designStyle: '',
    inspirationFiles: [],
    wantStitching: null,
  });
  const [selectedDesign, setSelectedDesign] = useState<SelectedDesign>(null);
  const { createOrderRequest } = useOrders();
  const { user } = useSupabase();
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('customOrderSelectedDesign');
      if (raw) {
        const parsed = JSON.parse(raw);
        setSelectedDesign(parsed);
        setForm((f) => ({ ...f, designStyle: `${parsed.title} (from product)` }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (user) {
      const defaultName = (user.user_metadata?.name as string) || (user.email?.split('@')[0] as string) || '';
      setContact((c) => ({ ...c, name: c.name || defaultName, email: c.email || (user.email || ''), phone: c.phone || (user.user_metadata?.phone || '') }));
    }
  }, [user]);

  const canNext = () => {
    if (step === 1) return form.fabricSource !== '';
    if (step === 2) return form.designStyle.trim().length > 0;
    if (step === 3) return form.wantStitching !== null;
    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 5);
    setForm((f) => ({ ...f, inspirationFiles: arr }));
  };

  const onSubmit = async () => {
    if (!selectedDesign?.artworkId) {
      alert('Please start a custom order from a product to submit.');
      return;
    }
    if (!contact.name || !contact.email || !contact.phone) {
      alert('Please provide your name, email, and phone.');
      return;
    }
    setSubmitting(true);
    const message = `Fabric Source: ${form.fabricSource || '—'}\nNotes: ${form.fabricNotes || '—'}\nDesign: ${form.designStyle || '—'}\nStitching: ${form.wantStitching ? 'Yes' : 'No'}`;
    const { error } = await createOrderRequest(selectedDesign.artworkId, {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      message
    });
    setSubmitting(false);
    if (error) {
      alert(typeof error === 'string' ? error : 'Failed to submit request');
      return;
    }
    setSubmitted(true);
    try { localStorage.removeItem('customOrderSelectedDesign'); } catch {}
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-xl w-full p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Received</h2>
          <p className="text-gray-600 mb-6">We will review your design and share a quote via email or WhatsApp shortly.</p>
          <div className="bg-gray-50 rounded-lg p-4 text-left text-sm text-gray-700 mb-6">
            <p><span className="font-semibold">Fabric:</span> {form.fabricSource === 'client_provided' ? 'Client provided' : 'Purchase for me'}</p>
            <p><span className="font-semibold">Notes:</span> {form.fabricNotes || '—'}</p>
            <p><span className="font-semibold">Design Style:</span> {form.designStyle}</p>
            <p><span className="font-semibold">Stitching:</span> {form.wantStitching ? 'Yes' : 'No'}</p>
          </div>
          <button onClick={() => onNavigate('home')} className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Fabric Order</h1>
          <p className="text-gray-600">Follow the steps to request a quote for your hand-painted fabric.</p>
        </div>

        {selectedDesign && (
          <div className="mb-6 bg-white rounded-xl shadow border border-gray-100 p-4 flex items-center gap-4">
            {selectedDesign.image && (
              <img src={selectedDesign.image} alt={selectedDesign.title} className="w-16 h-16 object-cover rounded" />
            )}
            <div className="flex-1">
              <div className="text-sm text-gray-500">Selected design</div>
              <div className="font-semibold text-gray-900">{selectedDesign.title}</div>
            </div>
            <button onClick={() => onNavigate('artwork', selectedDesign.artworkId)} className="text-amber-600 text-sm hover:underline inline-flex items-center">
              View Product <Eye className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}

        {/* Stepper */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[1,2,3,4].map((s) => (
            <div key={s} className={`h-2 rounded ${s <= step ? 'bg-amber-600' : 'bg-gray-200'}`}></div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Step 1: Select Fabric Type</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <button onClick={() => setForm((f) => ({ ...f, fabricSource: 'client_provided' }))} className={`p-4 border rounded-lg text-left ${form.fabricSource === 'client_provided' ? 'border-amber-600 ring-2 ring-amber-100' : 'border-gray-300'}`}>
                  <div className="flex items-center mb-1">
                    <Brush className="h-5 w-5 text-amber-600 mr-2" />
                    <span className="font-medium text-gray-900">Client Provides Fabric</span>
                  </div>
                  <p className="text-sm text-gray-600">You will ship or drop off your fabric.</p>
                </button>
                <button onClick={() => setForm((f) => ({ ...f, fabricSource: 'purchase_for_me' }))} className={`p-4 border rounded-lg text-left ${form.fabricSource === 'purchase_for_me' ? 'border-amber-600 ring-2 ring-amber-100' : 'border-gray-300'}`}>
                  <div className="flex items-center mb-1">
                    <Brush className="h-5 w-5 text-amber-600 mr-2" />
                    <span className="font-medium text-gray-900">Purchase Fabric For Me</span>
                  </div>
                  <p className="text-sm text-gray-600">We will source the appropriate base fabric.</p>
                </button>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fabric notes (optional)</label>
              <textarea value={form.fabricNotes} onChange={(e) => setForm((f) => ({ ...f, fabricNotes: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-amber-500 focus:border-amber-500" rows={3} placeholder="Type, color, length, special preferences..." />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Step 2: Design Style</h2>
              {selectedDesign && (
                <div className="mb-3 text-sm text-gray-600">Design preselected from: <span className="font-medium text-gray-900">{selectedDesign.title}</span>. You can add notes or changes below.</div>
              )}
              <label className="block text-sm font-medium text-gray-700 mb-1">Describe your design</label>
              <textarea value={form.designStyle} onChange={(e) => setForm((f) => ({ ...f, designStyle: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-amber-500 focus:border-amber-500 mb-4" rows={4} placeholder="Floral motifs, Mughal patterns, minimal abstracts, placement, colors..." />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload inspiration (up to 5 images)</label>
                <div className="flex items-center gap-3">
                  <input type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} />
                  <Upload className="h-5 w-5 text-gray-500" />
                </div>
                {form.inspirationFiles.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">{form.inspirationFiles.length} file(s) selected</p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Step 3: Stitching Add-on</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <button onClick={() => setForm((f) => ({ ...f, wantStitching: true }))} className={`p-4 border rounded-lg text-left ${form.wantStitching === true ? 'border-purple-600 ring-2 ring-purple-100' : 'border-gray-300'}`}>
                  <div className="flex items-center mb-1">
                    <Hammer className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="font-medium text-gray-900">Yes, add stitching</span>
                  </div>
                  <p className="text-sm text-gray-600">We'll tailor it into your chosen outfit.</p>
                </button>
                <button onClick={() => setForm((f) => ({ ...f, wantStitching: false }))} className={`p-4 border rounded-lg text-left ${form.wantStitching === false ? 'border-purple-600 ring-2 ring-purple-100' : 'border-gray-300'}`}>
                  <div className="flex items-center mb-1">
                    <Hammer className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="font-medium text-gray-900">No, painting only</span>
                  </div>
                  <p className="text-sm text-gray-600">You'll handle stitching separately.</p>
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Submit</h2>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 mb-6">
                {selectedDesign && (
                  <p className="mb-1"><span className="font-semibold">Design:</span> {selectedDesign.title}</p>
                )}
                <p><span className="font-semibold">Fabric:</span> {form.fabricSource ? (form.fabricSource === 'client_provided' ? 'Client provided' : 'Purchase for me') : '—'}</p>
                <p><span className="font-semibold">Notes:</span> {form.fabricNotes || '—'}</p>
                <p><span className="font-semibold">Design Style:</span> {form.designStyle || '—'}</p>
                <p><span className="font-semibold">Stitching:</span> {form.wantStitching === null ? '—' : form.wantStitching ? 'Yes' : 'No'}</p>
              </div>

              {/* Contact info (required if missing) */}
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-amber-500 focus:border-amber-500" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-amber-500 focus:border-amber-500" placeholder="you@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-amber-500 focus:border-amber-500" placeholder="+91 98765 43210" />
                </div>
              </div>

              <button disabled={submitting} onClick={onSubmit} className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit & Get Quote'}
                {!submitting && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
            </div>
          )}
        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))} className="text-gray-700 font-medium hover:underline">Back</button>
          {step !== 4 ? (
            <button disabled={!canNext()} onClick={() => setStep((s) => (s < 4 ? ((s + 1) as Step) : s))} className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold ${canNext() ? 'bg-gray-900 text-white hover:bg-black' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
              Next
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
} 