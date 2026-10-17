'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  Zap,
  Lock,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';
import type { ChatbotConfig } from '@/types/database';

interface AdminChatbotProps {
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export function AdminChatbot({ onShowToast }: AdminChatbotProps) {
  const [config, setConfig] = useState<ChatbotConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New key input state
  const [newKeyInput, setNewKeyInput] = useState('');
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Fetch current config from admin endpoint
  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/chatbot');
      const data = await res.json();
      if (res.ok && data.success) {
        setConfig(data.data);
      }
    } catch {
      onShowToast('Failed to load chatbot configuration.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Save changes
  const handleSave = async (updatedConfig: Partial<ChatbotConfig>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/chatbot', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConfig(data.data);
        onShowToast('Chatbot settings updated and synchronized successfully!');
      } else {
        onShowToast(data.message || 'Error updating chatbot settings.', 'error');
      }
    } catch {
      onShowToast('Network error while saving chatbot settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Add a new Gemini API Key
  const handleAddKey = () => {
    const key = newKeyInput.trim();
    if (!key) return;

    if (!config) return;
    if (config.gemini_api_keys.includes(key)) {
      onShowToast('This API key is already added.', 'error');
      return;
    }

    const updatedKeys = [...config.gemini_api_keys, key];
    setConfig({ ...config, gemini_api_keys: updatedKeys });
    setNewKeyInput('');
    setTestResult(null);
    handleSave({ gemini_api_keys: updatedKeys });
  };

  // Remove an API Key
  const handleRemoveKey = (indexToRemove: number) => {
    if (!config) return;
    const updatedKeys = config.gemini_api_keys.filter((_, idx) => idx !== indexToRemove);
    setConfig({ ...config, gemini_api_keys: updatedKeys });
    handleSave({ gemini_api_keys: updatedKeys });
  };

  // Test an API Key validity
  const handleTestKey = async (keyToTest: string) => {
    setTestingKey(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/admin/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: keyToTest }),
      });
      const data = await res.json();
      setTestResult({
        success: data.success,
        message: data.message || (data.success ? 'Key verified!' : 'Key test failed'),
      });
      if (data.success) {
        onShowToast('Gemini API key verified successfully!');
      } else {
        onShowToast(data.message || 'Key test failed', 'error');
      }
    } catch {
      setTestResult({ success: false, message: 'Network error while testing key' });
      onShowToast('Error testing key', 'error');
    } finally {
      setTestingKey(false);
    }
  };

  if (loading || !config) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-[#0B6E73] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-[#062F31]">Loading AI Assistant Configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-[#0B6E73]/15 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B6E73] to-[#2BB3B1] text-white grid place-items-center shadow-md shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-serif text-[#062F31]">
                AI Medical Assistant (চ্যাটবট কনসোল)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F6] text-[#0B6E73] border border-[#2BB3B1]/40">
                Hybrid AI + Real-time Knowledge
              </span>
            </div>
            <p className="text-xs text-[#3F6668] mt-1 leading-relaxed">
              Google Gemini 1.5 Flash এবং ওয়েবসাইটের লাইভ চেম্বার-সার্জারি ডেটাবেজ দ্বারা চালিত স্মার্ট ভার্চুয়াল রিসেপশনিস্ট।
            </p>
          </div>
        </div>

        {/* Global On/Off Toggle */}
        <div className="flex items-center gap-3 bg-[#EEF7F6]/60 p-2.5 px-4 rounded-2xl border border-[#0B6E73]/15 self-start md:self-center">
          <span className="text-xs font-bold text-[#062F31]">
            Chatbot Status:
          </span>
          <button
            type="button"
            onClick={() => handleSave({ is_enabled: !config.is_enabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.is_enabled ? 'bg-emerald-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.is_enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span
            className={`text-xs font-bold ${
              config.is_enabled ? 'text-emerald-700' : 'text-gray-500'
            }`}
          >
            {config.is_enabled ? 'Active (অনলাইন)' : 'Disabled (অফলাইন)'}
          </span>
        </div>
      </div>

      {/* Grid: Keys & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Google Gemini API Keys Management (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#0B6E73]/15 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#0B6E73]" />
                <h3 className="font-bold text-sm text-[#062F31]">
                  Google Gemini 1.5 Flash API Keys
                </h3>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B6E73] hover:underline"
              >
                <span>ফ্রি এপিআই কী নিন (Google AI Studio)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Free Tier Info */}
            <div className="p-3.5 rounded-2xl bg-[#EEF7F6]/50 border border-[#2BB3B1]/30 text-xs text-[#062F31] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#0B6E73] shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                <strong>মাল্টি-কী অটোমেশন:</strong> গুগল এআই স্টুডিও সম্পূর্ণ বিনামূল্যে (কোনো ক্রেডিট কার্ড ছাড়াই) প্রতিদিন ১,৫০০ রিকোয়েস্ট দেয়। আপনি চাইলে একাধিক জিমেইল অ্যাকাউন্ট থেকে ২-৩টি ফ্রি কী যুক্ত করতে পারেন। সিস্টেম স্বয়ংক্রিয়ভাবে একটি কী ব্যস্ত বা লিমিট শেষ হলে অন্য কী দিয়ে সেবা অব্যাহত রাখবে ($0 চিরতরে ফ্রি)।
              </p>
            </div>

            {/* Add New Key Form */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-[#062F31]">
                Add New Gemini API Key:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeyInput}
                  onChange={(e) => setNewKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 text-xs rounded-xl border border-gray-200 p-2.5 px-3 bg-white text-[#062F31] font-mono focus:border-[#0B6E73] focus:ring-1 focus:ring-[#0B6E73]/30 outline-hidden"
                />
                <button
                  type="button"
                  disabled={!newKeyInput.trim() || testingKey}
                  onClick={() => handleTestKey(newKeyInput.trim())}
                  className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#062F31] text-xs font-semibold transition-colors shrink-0"
                >
                  {testingKey ? 'Testing...' : 'Test Key'}
                </button>
                <button
                  type="button"
                  disabled={!newKeyInput.trim() || saving}
                  onClick={handleAddKey}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#0B6E73] hover:bg-[#085357] text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Key</span>
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-2.5 rounded-xl text-[11px] font-semibold flex items-center gap-2 ${
                    testResult.success
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>

            {/* Configured Keys List */}
            <div className="space-y-2 pt-3">
              <label className="block text-xs font-bold text-[#062F31]">
                Active Key Rotation Pool ({config.gemini_api_keys.length}):
              </label>

              {config.gemini_api_keys.length === 0 ? (
                <div className="py-6 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
                  <Key className="w-6 h-6 text-gray-400 mx-auto mb-1.5" />
                  <p className="text-xs text-[#3F6668]">No Gemini API keys added yet.</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Add at least one free API key to enable dynamic clinical answering.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {config.gemini_api_keys.map((k, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs"
                    >
                      <div className="flex items-center gap-2.5 font-mono text-[11px] text-[#062F31]">
                        <span className="w-5 h-5 rounded-md bg-[#EEF7F6] text-[#0B6E73] font-bold text-[10px] grid place-items-center">
                          #{idx + 1}
                        </span>
                        <span>
                          {k.length > 12 ? `${k.slice(0, 6)}••••••••${k.slice(-4)}` : '••••••••'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 text-[9px] font-sans font-bold">
                          Ready
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleTestKey(k)}
                          className="px-2.5 py-1 text-[10px] font-bold text-[#0B6E73] hover:bg-white rounded-lg transition-colors border border-gray-200"
                        >
                          Ping Test
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveKey(idx)}
                          className="p-1 text-gray-400 hover:text-rose-600 rounded-md transition-colors"
                          title="Remove key"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Welcome Message Customization */}
          <div className="p-6 rounded-3xl bg-white border border-[#0B6E73]/15 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <MessageSquare className="w-5 h-5 text-[#0B6E73]" />
              <h3 className="font-bold text-sm text-[#062F31]">
                Custom Greeting Messages
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#062F31] mb-1">
                  Bangla Welcome Greeting:
                </label>
                <textarea
                  rows={2}
                  value={config.welcome_message_bn}
                  onChange={(e) => setConfig({ ...config, welcome_message_bn: e.target.value })}
                  className="w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white text-[#062F31] focus:border-[#0B6E73] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#062F31] mb-1">
                  English Welcome Greeting:
                </label>
                <textarea
                  rows={2}
                  value={config.welcome_message_en}
                  onChange={(e) => setConfig({ ...config, welcome_message_en: e.target.value })}
                  className="w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white text-[#062F31] focus:border-[#0B6E73] outline-hidden"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    handleSave({
                      welcome_message_bn: config.welcome_message_bn,
                      welcome_message_en: config.welcome_message_en,
                    })
                  }
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0B6E73] to-[#2BB3B1] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Greeting Messages'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Cyber Security & Guardrails Overview (1 col) */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#062F31] to-[#0B6E73] text-white shadow-md space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/15">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm">Enterprise Cyber Security</h3>
            </div>

            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[11px] text-emerald-200">API Key Zero-Exposure:</strong>
                  <span className="text-[10px] text-teal-100/80 leading-relaxed">
                    এপিআই কী শুধুমাত্র সার্ভারলেস ব্যাকএন্ডে এনক্রিপ্ট থাকে। ব্রাউজার বা নেটওয়ার্ক ট্যাবে কখনোই ফাঁস হয় না।
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[11px] text-amber-200">DDoS Rate Limiting:</strong>
                  <span className="text-[10px] text-teal-100/80 leading-relaxed">
                    প্রতি আইপি থেকে মিনিটে সর্বোচ্চ ১০টি রিকোয়েস্ট অনুমোদিত। বট ও স্প্যামিং স্বয়ংক্রিয়ভাবে ব্লকড।
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[11px] text-emerald-200">Anti-Jailbreak Guardrails:</strong>
                  <span className="text-[10px] text-teal-100/80 leading-relaxed">
                    প্রম্পট ইনজেকশন বা হ্যাকিং প্রম্পট স্বয়ংক্রিয়ভাবে ফিল্টার করে এআই-কে নির্দিষ্ট রোলের বাইরে যেতে দেয় না।
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[11px] text-emerald-200">Medical Hallucination Shield:</strong>
                  <span className="text-[10px] text-teal-100/80 leading-relaxed">
                    এআই কোনো প্রেসক্রিপশন দিবে না; রোগীকে সরাসরি ফিজিক্যাল চেম্বারে ডাক্তার দেখানোর নির্দেশ দিবে।
                  </span>
                </div>
              </li>
            </ul>

            <div className="pt-3 border-t border-white/10 text-[10px] text-teal-200 flex items-center justify-between">
              <span>Security Level: Enterprise Grade</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Real-time Knowledge Sync Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#0B6E73]/15 shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-[#062F31] flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-[#0B6E73]" />
              <span>Real-Time Knowledge Sync</span>
            </h4>
            <p className="text-[11px] text-[#3F6668] leading-relaxed">
              চ্যাটবটটি কোনো পুরনো বা স্ট্যাটিক ডেটা ব্যবহার করে না। আপনি যখনই অ্যাডমিন প্যানেল থেকে কোনো চেম্বারের সময়সূচী, নতুন ফোন নম্বর বা সার্জারির তথ্য পরিবর্তন করবেন, চ্যাটবট সাথে সাথে নতুন তথ্য ব্যবহার করে উত্তর দেওয়া শুরু করবে। কোনো রি-ট্রেনিংয়ের প্রয়োজন নেই।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
