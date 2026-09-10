import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const FacilitySettings: React.FC = () => {
  const { recyclers } = useAppContext();
  const facility = recyclers[0]; // GreenCycle

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-paper-300 shadow-tactile flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-industrial-950">
            Facility Profile & Compliance Credentials
          </h2>
          <p className="text-xs text-industrial-500 font-medium mt-0.5">
            Central Pollution Control Board (CPCB) Authorization & Weighbridge Registry
          </p>
        </div>

        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold px-3 py-1.5 rounded-xl">
          ✓ CPCB VERIFIED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Facility Identification */}
        <div className="bg-white rounded-2xl p-6 border border-paper-300 shadow-tactile space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-forest-900 text-emerald-300 flex items-center justify-center font-display font-black text-2xl shadow-tactile border border-forest-800">
            GC
          </div>

          <div>
            <h3 className="font-display font-bold text-base text-industrial-950">
              {facility.name}
            </h3>
            <p className="text-xs text-industrial-500">{facility.legalEntity}</p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-paper-200 text-xs text-industrial-700">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-industrial-400 shrink-0 mt-0.5" />
              <span>{facility.address}, {facility.city}, Maharashtra, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-industrial-400 shrink-0" />
              <span>{facility.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-industrial-400 shrink-0" />
              <span>compliance@greencycle.eco</span>
            </div>
          </div>
        </div>

        {/* Middle & Right Column: Regulatory Licences */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-paper-300 shadow-tactile space-y-4">
            <h3 className="font-display font-bold text-sm text-industrial-950 uppercase tracking-wider">
              Statutory Permits & Authorizations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-paper-50 p-4 rounded-xl border border-paper-300 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-industrial-900">CPCB E-Waste License</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Active</span>
                </div>
                <p className="font-mono text-emerald-800 font-bold">{facility.cpcbReg}</p>
                <p className="text-[11px] text-industrial-500">Valid through: 31-March-2028</p>
              </div>

              <div className="bg-paper-50 p-4 rounded-xl border border-paper-300 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-industrial-900">Weighbridge Calibration</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">Certified</span>
                </div>
                <p className="font-mono text-industrial-800 font-bold">WB-CAL-MH/2026/0912</p>
                <p className="text-[11px] text-industrial-500">Legal Metrology Dept. Certified</p>
              </div>

              <div className="bg-paper-50 p-4 rounded-xl border border-paper-300 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-industrial-900">EPR Target Fulfillment</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">74% Target</span>
                </div>
                <p className="font-mono text-amber-900 font-bold">13,680 / 18,500 MT</p>
                <p className="text-[11px] text-industrial-500">Annual Quota Progress</p>
              </div>

              <div className="bg-paper-50 p-4 rounded-xl border border-paper-300 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-industrial-900">Form-6 Hazardous Manifest</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Digital API</span>
                </div>
                <p className="font-mono text-emerald-800 font-bold">E-Waste Rules 2022</p>
                <p className="text-[11px] text-industrial-500">Auto-synced with National Portal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilitySettings;
