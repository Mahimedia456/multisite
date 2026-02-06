import React from "react";
import Card from "./Card";

export default function StatCard({ title, value, subtitle, imageSrc }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        {imageSrc ? <img src={imageSrc} alt="" className="h-16 w-16 object-contain" /> : null}
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-500">{title}</div>
          <div className="mt-1 text-3xl font-black text-slate-900">{value}</div>
          <div className="mt-2 text-sm text-slate-600">{subtitle}</div>
        </div>
      </div>
    </Card>
  );
}
