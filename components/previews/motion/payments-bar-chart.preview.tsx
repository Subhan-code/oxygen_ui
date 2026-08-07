"use client";

import { PaymentsBarChart } from "@/components/motion/payments-bar-chart";

export function PaymentsBarChartPreview() {
  return (
    <div className="flex min-h-[380px] w-full items-center justify-center p-6">
      <PaymentsBarChart />
    </div>
  );
}

export default PaymentsBarChartPreview;
