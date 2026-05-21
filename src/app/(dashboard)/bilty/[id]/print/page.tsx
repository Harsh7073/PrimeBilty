"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import axios from "axios";

interface CanvasElement {
  id: string;
  type: "text" | "qr" | "barcode" | "logo" | "static";
  name: string;
  value: string;
  x: number; // in mm
  y: number; // in mm
  width: number; // in mm
  height: number; // in mm
  fontSize: number; // in pt
  color: string;
  align: "left" | "center" | "right";
  bold: boolean;
  rotation: number;
}

export default function BiltyPrintPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuthStore();

  const [bilty, setBilty] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    if (!token || !id) return;
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // 1. Fetch Bilty data
      const bRes = await axios.get(`/api/bilties/${id}`, { headers });
      const biltyData = bRes.data.bilty;
      setBilty(biltyData);

      // 2. Fetch active user details to get assigned template
      const meRes = await axios.get("/api/auth/me", { headers });
      const userWithTemplate = meRes.data.user;

      if (userWithTemplate?.printTemplate) {
        setTemplate(userWithTemplate.printTemplate);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to load printing data.");
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Replace template variables with real Bilty values
  const resolveValue = (val: string) => {
    if (!bilty) return "";
    let res = val;
    
    const mappings: Record<string, string> = {
      "{{lr_number}}": bilty.lrNumber || "",
      "{{lr_date}}": formatDate(bilty.createdAt),
      "{{consignor_name}}": bilty.consignor?.name || "",
      "{{consignor_address}}": bilty.consignor?.address || "",
      "{{consignor_gst}}": bilty.consignor?.gstin || "",
      "{{consignee_name}}": bilty.consignee?.name || "",
      "{{consignee_address}}": bilty.consignee?.address || "",
      "{{consignee_gst}}": bilty.consignee?.gstin || "",
      "{{from_city}}": bilty.fromCity || "",
      "{{to_city}}": bilty.toCity || "",
      "{{via}}": bilty.via || "",
      "{{vehicle_number}}": bilty.vehicle?.vehicleNumber || "",
      "{{driver_name}}": bilty.driverName || "",
      "{{goods_description}}": bilty.goodsDescription || "",
      "{{quantity}}": String(bilty.quantity || 0),
      "{{unit}}": bilty.unit || "",
      "{{weight}}": String(bilty.weight || 0),
      "{{freight_amount}}": formatCurrency(bilty.freightAmount),
      "{{gst_amount}}": formatCurrency(bilty.gstAmount || 0),
      "{{total_amount}}": formatCurrency(bilty.totalAmount),
      "{{advance_amount}}": formatCurrency(bilty.advanceAmount),
      "{{balance_amount}}": formatCurrency(bilty.balanceAmount),
      "{{payment_type}}": bilty.paymentType || "To Pay",
      "{{e_way_bill}}": bilty.ewayBillNumber || "",
      "{{current_date}}": new Date().toLocaleDateString(),
    };

    Object.keys(mappings).forEach(key => {
      res = res.replace(key, mappings[key]);
    });

    return res;
  };

  const triggerPrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex-center flex-col gap-3">
        <div className="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
        <span className="text-sm text-white/50">Preparing print document...</span>
      </div>
    );
  }

  if (error || !bilty) {
    return (
      <div className="min-h-screen bg-dark-950 flex-center p-6">
        <div className="glass-card p-6 max-w-md w-full text-center space-y-4">
          <h2 className="text-lg font-bold text-white">Printing Error</h2>
          <p className="text-sm text-white/60">{error || "Failed to load document for printing."}</p>
          <button onClick={() => window.close()} className="btn-secondary w-full">
            Close Window
          </button>
        </div>
      </div>
    );
  }

  // Parse layout elements
  let elements: CanvasElement[] = [];
  if (template) {
    try {
      elements = JSON.parse(template.jsonLayout || "[]");
    } catch {
      elements = [];
    }
  }

  const hasCustomTemplate = template && elements.length > 0;

  return (
    <div className="min-h-screen bg-neutral-100 py-6 print:py-0 print:bg-white flex flex-col items-center">
      {/* Top print bar - hidden during prints */}
      <div className="w-[210mm] bg-white border border-neutral-200 shadow-sm p-4 mb-4 rounded-xl flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-sm font-semibold text-neutral-800">Print Preview</h1>
          <p className="text-xs text-neutral-500">
            {hasCustomTemplate 
              ? `Using Custom Template: ${template.designNo} - ${template.designName}` 
              : "Using Standard System Bilty Template"}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => router.back()} 
            className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-600"
          >
            Go Back
          </button>
          <button 
            onClick={triggerPrint} 
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow"
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="w-[210mm] h-[297mm] bg-white shadow-lg print:shadow-none border border-neutral-200 print:border-0 relative overflow-hidden select-none">
        {hasCustomTemplate ? (
          /* Render visual design template custom items */
          elements.map((el) => {
            const resolvedText = resolveValue(el.value);
            const style: React.CSSProperties = {
              position: "absolute",
              left: `${el.x}mm`,
              top: `${el.y}mm`,
              width: `${el.width}mm`,
              height: `${el.height}mm`,
              fontSize: `${el.fontSize}pt`,
              color: el.color,
              textAlign: el.align,
              fontWeight: el.bold ? "bold" : "normal",
              transform: `rotate(${el.rotation}deg)`,
              fontFamily: "monospace",
              display: "flex",
              alignItems: "center",
              justifyContent: el.align === "center" ? "center" : el.align === "right" ? "flex-end" : "flex-start",
              lineHeight: "1.2",
            };

            return (
              <div key={el.id} style={style}>
                {el.type === "text" || el.type === "static" ? (
                  <span>{resolvedText}</span>
                ) : el.type === "qr" ? (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(resolvedText || "LR-" + bilty.lrNumber)}`}
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : el.type === "barcode" ? (
                  <img
                    src={`https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(resolvedText || bilty.lrNumber)}&code=Code128&translate-esc=true`}
                    alt="Barcode"
                    className="w-full h-full object-contain"
                  />
                ) : el.type === "logo" ? (
                  <div className="w-full h-full flex items-center justify-center font-bold border border-black/40 text-black p-1 text-[10px]">
                    COMPANY LOGO
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          /* Render default professional system bilty receipt */
          <div className="p-8 h-full flex flex-col justify-between text-neutral-800 text-xs">
            <div className="space-y-6">
              {/* Top Invoice Header */}
              <div className="flex justify-between items-start border-b-2 border-neutral-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-wider text-blue-600">TruckBilty Enterprise</h2>
                  <p className="text-neutral-500 text-[10px] mt-0.5">Reliable Logistics & Transport Solutions</p>
                </div>
                <div className="text-right">
                  <h1 className="text-lg font-black uppercase text-neutral-800">Goods Receipt (Bilty)</h1>
                  <span className="font-mono text-sm font-semibold bg-neutral-100 px-2 py-0.5 rounded text-neutral-700">LR No: {bilty.lrNumber}</span>
                </div>
              </div>

              {/* Date / Core Info */}
              <div className="grid grid-cols-3 gap-4 border-b border-neutral-200 pb-4">
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono block">DATE</span>
                  <span className="font-semibold text-neutral-700">{formatDate(bilty.createdAt)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono block">VEHICLE NUMBER</span>
                  <span className="font-semibold font-mono text-neutral-700">{bilty.vehicle?.vehicleNumber || "—"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono block">ROUTE</span>
                  <span className="font-semibold text-neutral-700">{bilty.fromCity} → {bilty.toCity}</span>
                </div>
              </div>

              {/* Consignor vs Consignee */}
              <div className="grid grid-cols-2 gap-8 border-b border-neutral-200 pb-4">
                <div>
                  <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">CONSIGNOR (Sender)</h3>
                  <div className="font-bold text-neutral-800 text-sm">{bilty.consignor?.name || "—"}</div>
                  <div className="text-neutral-500 mt-0.5">{bilty.consignor?.address || "No Address"}</div>
                  {bilty.consignor?.gstin && <div className="text-neutral-600 font-mono mt-1 font-semibold">GSTIN: {bilty.consignor.gstin}</div>}
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">CONSIGNEE (Receiver)</h3>
                  <div className="font-bold text-neutral-800 text-sm">{bilty.consignee?.name || "—"}</div>
                  <div className="text-neutral-500 mt-0.5">{bilty.consignee?.address || "No Address"}</div>
                  {bilty.consignee?.gstin && <div className="text-neutral-600 font-mono mt-1 font-semibold">GSTIN: {bilty.consignee.gstin}</div>}
                </div>
              </div>

              {/* Goods Table */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200">
                      <th className="p-3">Goods Description</th>
                      <th className="p-3 text-right">Quantity</th>
                      <th className="p-3 text-right">Charged Weight</th>
                      <th className="p-3 text-right">E-Way Bill No</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-neutral-200">
                      <td className="p-3 font-medium text-neutral-800">{bilty.goodsDescription || "General Cargo"}</td>
                      <td className="p-3 text-right text-neutral-600">{bilty.quantity} {bilty.unit || "Units"}</td>
                      <td className="p-3 text-right text-neutral-600">{bilty.weight} Tons</td>
                      <td className="p-3 text-right font-mono text-neutral-600">{bilty.ewayBillNumber || "—"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* QR and Barcode Visuals */}
              <div className="grid grid-cols-2 gap-4 items-center border-t border-neutral-100 pt-6">
                <div>
                  <img
                    src={`https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(bilty.lrNumber)}&code=Code128`}
                    alt="LR Barcode"
                    className="h-10 object-contain"
                  />
                  <span className="text-[9px] text-neutral-400 font-mono block mt-1">LR Barcode validation</span>
                </div>
                <div className="flex justify-end">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[9px] text-neutral-400 font-mono block">Scan to Verify</span>
                      <span className="text-[10px] text-neutral-500">Security QR Code</span>
                    </div>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Bilty-${bilty.lrNumber}`}
                      alt="Verification QR"
                      className="w-12 h-12"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Charge Summary */}
            <div className="border-t-2 border-neutral-800 pt-6 mt-12 flex justify-between items-end">
              <div className="max-w-[60%] text-[10px] text-neutral-400 leading-relaxed">
                <strong>Terms & Conditions:</strong> Cargo is carried at owner's risk unless insurance coverage is declared. Demurrage charges applicable if not claimed within 24 hours of arrival at destination. Subject to local jurisdiction.
              </div>
              <div className="w-72 space-y-2 border border-neutral-200 p-4 rounded-lg bg-neutral-50">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Base Freight</span>
                  <span className="font-semibold text-neutral-700 font-mono">{formatCurrency(bilty.freightAmount)}</span>
                </div>
                {bilty.gstAmount > 0 && (
                  <div className="flex justify-between text-neutral-500 text-[11px]">
                    <span>GST ({bilty.gstRate || 0}%)</span>
                    <span className="font-mono">{formatCurrency(bilty.gstAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-neutral-200 pt-2 font-bold text-neutral-800">
                  <span>Total Charges</span>
                  <span className="font-mono">{formatCurrency(bilty.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 text-[11px]">
                  <span>Advance Paid</span>
                  <span className="font-mono">-{formatCurrency(bilty.advanceAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-300 pt-1.5 font-black text-neutral-900 text-sm">
                  <span>Balance Due</span>
                  <span className="font-mono text-blue-600">{formatCurrency(bilty.balanceAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
