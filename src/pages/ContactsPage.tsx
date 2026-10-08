import React, { useState } from 'react';
import { Plus, Phone, Trash2, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';


const ContactsPage: React.FC = () => {
  const { user, addEmergencyContact, removeEmergencyContact } = useAuth();

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', relationship: '' });

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.relationship) {
      addEmergencyContact(formData);
      setFormData({ name: '', phone: '', relationship: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-full space-y-6 bg-amber-50/50 text-black font-sans transition-colors duration-200">
      
      <div className="border-b border-amber-200 pb-6 text-left">
        <h2 className="text-2xl font-black text-black tracking-tight flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-amber-600" />
          Contact Directory
        </h2>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Manage emergency contacts linked to safety alerts and TWILIO distress broadcasts.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Emergency Contacts Card */}
        <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Emergency Contacts
            </h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-indigo-600/10 active:scale-95 border border-indigo-500/20"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Contact
            </button>
          </div>

          <div className="space-y-3">
            {user?.emergencyContacts?.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl hover:border-slate-305 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-extrabold text-xs">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-extrabold text-slate-800">
                      {contact.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                      {contact.relationship} • <span className="font-mono text-indigo-600">{contact.phone}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(`tel:${contact.phone}`)}
                    className="p-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100/50 text-indigo-600 rounded-xl transition-all active:scale-90"
                    title={`Call ${contact.name}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeEmergencyContact(contact.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 border border-red-100/50 text-red-500 rounded-xl transition-all active:scale-90"
                    title={`Remove ${contact.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {(!user?.emergencyContacts || user.emergencyContacts.length === 0) && (
              <div className="text-center py-12 text-slate-400">
                <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-20 text-indigo-600" />
                <p className="text-xs font-semibold">No emergency contacts added</p>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">Add safety contacts to transmit coordinate broadcasts in panic scenarios.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl text-slate-805 text-slate-800">
            <h3 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-widest text-left">
              Add Emergency Contact
            </h3>
            <form onSubmit={handleAddContact} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                required
              />
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                required
              >
                <option value="">Select Relationship</option>
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Spouse">Spouse</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Friend</option>
                <option value="Emergency Services">Emergency Services</option>
              </select>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-400 hover:bg-amber-500 text-black rounded-2xl transition-all text-xs font-black uppercase tracking-wider active:scale-95 border border-amber-500/20"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsPage;