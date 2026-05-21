"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  FileText, ArrowLeft, Printer, Shield, User, MapPin, 
  Truck, DollarSign, Calendar, Tag, AlertCircle, Edit
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import axios from "axios";
import Link from "next/link";

export default function BiltyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, user } = useAuthStore();
  
  const [bilty, setBilty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBilty = useCallback(async () => {
    if (!token || !id) return;
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.get(`/api/bilties/${id}`, { headers });
      setBilty(data.bilty);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to load Bilty details");
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    fetchBilty();
  }, [fetchBilty]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex-center flex-col gap-3">
        <div className="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
        <span className="text-sm text-white/50">Loading Bilty Details...</span>
      </div>
    );
  }

  if (error || !bilty) {
    return (
      <div className="glass-card p-6 max-w-md mx-auto text-center space-y-4 my-8">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto animate-bounce" />
        <h2 className="text-lg font-bold text-white">Error Loading Bilty</h2>
        <p className="text-sm text-white/60">{error || "Bilty not found."}</p>
        <button onClick={() => router.push("/bilty")} className="btn-secondary w-full flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link href="/bilty" className="btn-icon">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="text-xs text-white/40 font-mono">Bilty Details</div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
              LR No: <span className="font-mono text-brand-400">{bilty.lrNumber}</span>
              <span className={`badge ${getStatusColor(bilty.status)} text-xs`}>
                {bilty.status.replace("_", " ")}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/bilty/${id}/edit`} className="btn-secondary gap-1.5">
            <Edit className="w-4 h-4" /> Edit Bilty
          </Link>
          <Link href={`/bilty/${id}/print`} target="_blank" className="btn-primary gap-1.5">
            <Printer className="w-4 h-4" /> Print Document
          </Link>
        </div>
      </div>

      {/* Main Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Route and Parties */}
        <div className="md:col-span-2 space-y-6">
          {/* Card 1: Consignor & Consignee */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white/70 flex items-center gap-2 border-b border-white/5 pb-2">
              <User className="w-4 h-4 text-brand-400" /> Shipments Parties
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-[10px] text-white/30 uppercase font-mono">Consignor (Sender)</span>
                <div className="text-sm font-bold text-white">{bilty.consignor?.name || "—"}</div>
                <div className="text-xs text-white/60">{bilty.consignor?.address || "No Address"}</div>
                {bilty.consignor?.gstin && <div className="text-xs text-white/40 font-mono mt-1">GSTIN: {bilty.consignor.gstin}</div>}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-white/30 uppercase font-mono">Consignee (Receiver)</span>
                <div className="text-sm font-bold text-white">{bilty.consignee?.name || "—"}</div>
                <div className="text-xs text-white/60">{bilty.consignee?.address || "No Address"}</div>
                {bilty.consignee?.gstin && <div className="text-xs text-white/40 font-mono mt-1">GSTIN: {bilty.consignee.gstin}</div>}
              </div>
            </div>
            
            {bilty.billingParty && (
              <div className="pt-3 border-t border-white/5 space-y-1">
                <span className="text-[10px] text-white/30 uppercase font-mono">Billing Party (Payer)</span>
                <div className="text-xs font-semibold text-white">{bilty.billingParty.name}</div>
                {bilty.billingParty.gstin && <div className="text-[10px] text-white/40 font-mono">GSTIN: {bilty.billingParty.gstin}</div>}
              </div>
            )}
          </div>

          {/* Card 2: Transit Details */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white/70 flex items-center gap-2 border-b border-white/5 pb-2">
              <Truck className="w-4 h-4 text-brand-400" /> Transit & Cargo Details
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] text-white/30 font-mono block">FROM CITY</span>
                <span className="text-sm font-semibold text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-white/30" /> {bilty.fromCity}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-white/30 font-mono block">TO CITY</span>
                <span className="text-sm font-semibold text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-white/30" /> {bilty.toCity}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-white/30 font-mono block">VEHICLE NO</span>
                <span className="text-sm font-semibold text-brand-400 font-mono">{bilty.vehicle?.vehicleNumber || "—"}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-white/30 font-mono block">DRIVER NAME</span>
                <span className="text-sm font-semibold text-white">{bilty.driverName || "—"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-white/5">
              <div className="space-y-0.5">
                <span className="text-[10px] text-white/30 font-mono block">GOODS DESCRIPTION</span>
                <span className="text-xs text-white/80">{bilty.goodsDescription || "—"}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-white/30 font-mono block">QUANTITY</span>
                <span className="text-xs text-white/80">{bilty.quantity} {bilty.unit || "Units"}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-white/30 font-mono block">CHARGED WEIGHT</span>
                <span className="text-xs text-white/80">{bilty.weight} Tons</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-white/30 font-mono block">E-WAY BILL NO</span>
                <span className="text-xs text-brand-400 font-mono">{bilty.ewayBillNumber || "—"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Charges Summary */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white/70 flex items-center gap-2 border-b border-white/5 pb-2">
              <DollarSign className="w-4 h-4 text-brand-400" /> Freight Charges
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Base Freight</span>
                <span className="text-white font-mono">{formatCurrency(bilty.freightAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Loading Charges</span>
                <span className="text-white font-mono">{formatCurrency(bilty.loadingCharges || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Unloading Charges</span>
                <span className="text-white font-mono">{formatCurrency(bilty.unloadingCharges || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Other Charges</span>
                <span className="text-white font-mono">{formatCurrency(bilty.otherCharges || 0)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5">
                <span className="text-white/60">GST ({bilty.gstRate || 0}%)</span>
                <span className="text-white font-mono">{formatCurrency(bilty.gstAmount || 0)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-white/5">
                <span className="text-white">Total Freight</span>
                <span className="text-brand-400 font-mono">{formatCurrency(bilty.totalAmount)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5 text-emerald-400 font-semibold">
                <span>Advance Paid</span>
                <span className="font-mono">-{formatCurrency(bilty.advanceAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t-2 border-dashed border-white/10 text-amber-400">
                <span>Balance Due</span>
                <span className="font-mono">{formatCurrency(bilty.balanceAmount)}</span>
              </div>
            </div>
          </div>

          {/* Document Properties */}
          <div className="glass-card p-4 text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-white/40">Created Date:</span>
              <span className="text-white/70 font-mono">{formatDate(bilty.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Updated Date:</span>
              <span className="text-white/70 font-mono">{formatDate(bilty.updatedAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Payment Type:</span>
              <span className="text-white/70 uppercase font-mono">{bilty.paymentType || "To Pay"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
