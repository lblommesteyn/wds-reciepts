"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <ApiReferenceReact
        configuration={{
          spec: {
            url: "/api/openapi",
          },
          layout: "modern",
          hideModels: true,
          theme: "midnight",
          metaData: {
            title: "Receiptly API reference",
            description:
              "Auto-generated from OpenAPI. Includes OCR upload and Supabase health endpoints.",
          },
        }}
      />
    </div>
  );
}
