"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FileText, ArrowLeft, ArrowRight, Check, Truck, Users, IndianRupee, Info, Plus } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import Link from "next/link";

const STEPS = [
  { id: 1, label: "Route & Vehicle", icon: Truck },
  { id: 2, label: "Parties", icon: Users },
  { id: 3, label: "Freight", icon: IndianRupee },
  { id: 4, label: "Review", icon: Check },
];

const FieldInput = ({ label, value, onChange, placeholder = "", type = "text", required = false }: any) => (
  <div>
    <label className="label-base">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input-base" required={required} />
  </div>
);

const SelectInput = ({ label, value, onChange, options, required = false }: any) => (
  <div>
    <label className="label-base">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="select-base" required={required}>
      <option value="">Select...</option>
      {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const DEFAULT_FORM = {
  fromCity: "", toCity: "", via: "",
  vehicleId: "", driverId: "",
  consignorId: "", consigneeId: "", billingPartyId: "",
  goodsDescription: "", quantity: "", unit: "", weight: "", weightUnit: "Ton",
  freightAmount: 0, advanceAmount: 0, loadingCharges: 0, unloadingCharges: 0, otherCharges: 0,
  gstRate: 0, paymentType: "TO-PAY", eWayBillNumber: "", notes: "",
};


export default function CreateBiltyPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(DEFAULT_FORM);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [parties, setParties] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [vRes, pRes] = await Promise.all([
          axios.get("/api/vehicles", { headers }),
          axios.get("/api/parties", { headers })
        ]);
        setVehicles(vRes.data.vehicles || []);
        setParties(pRes.data.parties || []);
      } catch (err) {
        console.error("Failed to load metadata", err);
      }
    };
    fetchData();
  }, [token]);

  const set = (key: string, val: any) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const consignors = parties.filter(p => p.type === "CONSIGNOR" || p.type === "CUSTOMER");
  const consignees = parties.filter(p => p.type === "CONSIGNEE" || p.type === "CUSTOMER");
  const billingParties = parties.filter(p => p.type === "BILLING" || p.type === "CUSTOMER");

  const freightAmount = Number(form.freightAmount) || 0;
  const loadingCharges = Number(form.loadingCharges) || 0;
  const unloadingCharges = Number(form.unloadingCharges) || 0;
  const otherCharges = Number(form.otherCharges) || 0;
  
  const baseFreight = freightAmount + loadingCharges + unloadingCharges + otherCharges;
  const gstAmount = baseFreight * ((form.gstRate || 0) / 100);
  const totalFreight = baseFreight + gstAmount;
  const balanceAmount = totalFreight - (Number(form.advanceAmount) || 0);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      // Map state fields for API payload if needed
      const payload = {
        ...form,
        freightAmount,
        advanceAmount: Number(form.advanceAmount) || 0,
        loadingCharges,
        unloadingCharges,
        otherCharges,
        gstRate: Number(form.gstRate) || 0,
        gstAmount,
        totalAmount: totalFreight,
        balanceAmount,
      };

      await axios.post("/api/bilties", payload, { headers });
      router.push("/bilty");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create Bilty");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/bilty" className="btn-icon">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-400" /> Create New Bilty
          </h1>
          <p className="page-subtitle">Fill in the loading receipt details</p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div
              onClick={() => s.id < step && setStep(s.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                s.id === step ? "bg-brand-500/15 text-brand-300 border border-brand-500/25" :
                s.id < step ? "text-white/60 cursor-pointer hover:text-white/80" : "text-white/25"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex-center text-xs font-bold ${s.id <= step ? "bg-brand-500 text-white" : "bg-white/10 text-white/30"}`}>
                {s.id < step ? <Check className="w-3 h-3" /> : s.id}
              </div>
              <span className="hidden sm:inline font-medium">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-1 ${step > s.id ? "bg-brand-500/40" : "bg-white/10"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-6"
      >
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white mb-4">Route & Vehicle Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <FieldInput label="From City" value={form.fromCity} onChange={(v: string) => set("fromCity", v)} placeholder="Delhi" required />
              <FieldInput label="To City" value={form.toCity} onChange={(v: string) => set("toCity", v)} placeholder="Mumbai" required />
            </div>
            <FieldInput label="Via (Optional)" value={form.via} onChange={(v: string) => set("via", v)} placeholder="Pune" />
            <SelectInput
              label="Vehicle"
              value={form.vehicleId}
              onChange={(v: string) => set("vehicleId", v)}
              options={vehicles.map(v => ({ value: v.id, label: `${v.vehicleNumber} — ${v.type?.name || ""}` }))}
              required
            />
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
              <Info className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-white/40">No vehicles? <Link href="/masters/vehicles" className="text-brand-400">Add one in Masters</Link> first.</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white mb-4">Parties & Goods</h3>
            <SelectInput
              label="Consignor (Sender)"
              value={form.consignorId}
              onChange={(v: string) => set("consignorId", v)}
              options={consignors.map(p => ({ value: p.id, label: `${p.name} — ${p.city || ""}` }))}
              required
            />
            <SelectInput
              label="Consignee (Receiver)"
              value={form.consigneeId}
              onChange={(v: string) => set("consigneeId", v)}
              options={consignees.map(p => ({ value: p.id, label: `${p.name} — ${p.city || ""}` }))}
              required
            />
            <SelectInput
              label="Billing Party"
              value={form.billingPartyId}
              onChange={(v: string) => set("billingPartyId", v)}
              options={billingParties.map(p => ({ value: p.id, label: `${p.name} — ${p.city || ""}` }))}
              required
            />
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
              <Info className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-white/40">No parties? <Link href="/masters/parties" className="text-brand-400">Add them in Masters</Link> first.</p>
            </div>
            <div className="divider" />
            <h4 className="text-sm font-medium text-white/60">Goods Details</h4>
            <FieldInput label="Goods Description" value={form.goodsDescription} onChange={(v: string) => set("goodsDescription", v)} placeholder="Electronics, Furniture..." />
            <div className="grid grid-cols-3 gap-3">
              <FieldInput label="Quantity" value={form.quantity} onChange={(v: string) => set("quantity", v)} type="number" placeholder="100" />
              <FieldInput label="Unit" value={form.unit} onChange={(v: string) => set("unit", v)} placeholder="Box" />
              <FieldInput label="Weight (Ton)" value={form.weight} onChange={(v: string) => set("weight", v)} type="number" placeholder="5.5" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white mb-4">Freight & Payment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-base">Freight Amount <span className="text-red-400">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">₹</span>
                  <input type="number" value={form.freightAmount} onChange={(e) => set("freightAmount", Number(e.target.value))} className="input-base pl-7" min="0" />
                </div>
              </div>
              <div>
                <label className="label-base">Advance Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">₹</span>
                  <input type="number" value={form.advanceAmount} onChange={(e) => set("advanceAmount", Number(e.target.value))} className="input-base pl-7" min="0" />
                </div>
              </div>
              <div>
                <label className="label-base">Loading Charges</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">₹</span>
                  <input type="number" value={form.loadingCharges} onChange={(e) => set("loadingCharges", Number(e.target.value))} className="input-base pl-7" min="0" />
                </div>
              </div>
              <div>
                <label className="label-base">Unloading Charges</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">₹</span>
                  <input type="number" value={form.unloadingCharges} onChange={(e) => set("unloadingCharges", Number(e.target.value))} className="input-base pl-7" min="0" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-base">Other Charges</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">₹</span>
                  <input type="number" value={form.otherCharges} onChange={(e) => set("otherCharges", Number(e.target.value))} className="input-base pl-7" min="0" />
                </div>
              </div>
              <SelectInput
                label="GST Rate"
                value={String(form.gstRate)}
                onChange={(v: string) => set("gstRate", Number(v))}
                options={[{ value: "0", label: "0% (Exempt)" }, { value: "5", label: "5%" }, { value: "12", label: "12%" }, { value: "18", label: "18%" }, { value: "28", label: "28%" }]}
              />
            </div>
            <SelectInput
              label="Payment Type"
              value={form.paymentType}
              onChange={(v: string) => set("paymentType", v)}
              options={[{ value: "TO-PAY", label: "To Pay" }, { value: "PAID", label: "Paid" }, { value: "TBB", label: "To Be Billed" }]}
            />
            <FieldInput label="E-Way Bill Number" value={form.eWayBillNumber} onChange={(v: string) => set("eWayBillNumber", v)} placeholder="2412345..." />

            {/* Freight Summary */}
            <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20 space-y-2">
              <h4 className="text-sm font-semibold text-brand-300">Freight Summary</h4>
              {[
                ["Base Freight", form.freightAmount],
                ["Loading Charges", form.loadingCharges],
                ["Unloading Charges", form.unloadingCharges],
                ["Other Charges", form.otherCharges],
                [`GST (${form.gstRate}%)`, gstAmount],
              ].map(([label, val]) => (
                <div key={label as string} className="flex-between text-sm">
                  <span className="text-white/50">{label as string}</span>
                  <span className="text-white/70">₹{Number(val).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-2 flex-between">
                <span className="font-semibold text-white">Total Freight</span>
                <span className="font-bold text-brand-300 text-base">₹{totalFreight.toFixed(2)}</span>
              </div>
              <div className="flex-between text-sm">
                <span className="text-white/50">Less Advance</span>
                <span className="text-emerald-400">-₹{Number(form.advanceAmount).toFixed(2)}</span>
              </div>
              <div className="flex-between">
                <span className="font-semibold text-white">Balance Due</span>
                <span className="font-bold text-amber-300">₹{balanceAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white mb-4">Review & Confirm</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Route", value: `${form.fromCity} → ${form.toCity}` },
                { label: "Vehicle", value: vehicles.find(v => v.id === form.vehicleId)?.vehicleNumber || "—" },
                { label: "Consignor", value: parties.find(p => p.id === form.consignorId)?.name || "—" },
                { label: "Consignee", value: parties.find(p => p.id === form.consigneeId)?.name || "—" },
                { label: "Billing Party", value: parties.find(p => p.id === form.billingPartyId)?.name || "—" },
                { label: "Payment Type", value: form.paymentType },
                { label: "Total Freight", value: `₹${totalFreight.toFixed(2)}` },
                { label: "Balance Due", value: `₹${balanceAmount.toFixed(2)}` },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-xs text-white/35 mb-1">{label}</div>
                  <div className="text-sm font-medium text-white">{value}</div>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-300">All details look good! An auto LR number will be generated upon submission.</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : router.back()}
          className="btn-secondary"
        >
          <ArrowLeft className="w-4 h-4" /> {step === 1 ? "Cancel" : "Back"}
        </button>
        {step < 4 ? (
          <button
            onClick={() => {
              // Basic validation
              if (step === 1 && (!form.fromCity || !form.toCity || !form.vehicleId)) {
                setError("Please fill all required fields"); return;
              }
              if (step === 2 && (!form.consignorId || !form.consigneeId || !form.billingPartyId)) {
                setError("Please select all parties"); return;
              }
              setError("");
              setStep(step + 1);
            }}
            className="btn-primary"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary disabled:opacity-60"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check className="w-4 h-4" /> Create Bilty</>}
          </button>
        )}
      </div>
    </div>
  );
}
