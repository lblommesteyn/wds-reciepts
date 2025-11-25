"use client";

import SwaggerUI from "swagger-ui-react";

export default function SwaggerPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 space-y-1">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Receiptly
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Swagger UI – OpenAPI explorer
          </h1>
          <p className="text-sm text-slate-400">
            Live rendering of the `/api/openapi` spec for quick request testing.
          </p>
        </header>
      </div>
      <SwaggerUI
        url="/api/openapi"
        docExpansion="list"
        defaultModelsExpandDepth={-1}
        displayRequestDuration
        persistAuthorization
      />
    </div>
  );
}
