import type { OpenAPIV3_1 } from "openapi-types";

const servers: OpenAPIV3_1.Document["servers"] = [
  {
    url: "http://localhost:3000",
    description: "Local development (Next.js dev server).",
  },
  {
    url: "https://your-production-domain",
    description: "Replace with the deployed domain when available.",
  },
];

export const openApiDocument: OpenAPIV3_1.Document = {
  openapi: "3.1.0",
  info: {
    title: "Receiptly API",
    version: "0.1.0",
    description:
      "Internal endpoints for OCR experiments and Supabase connectivity checks.",
  },
  servers,
  tags: [
    { name: "OCR", description: "Receipt upload and parsing" },
    { name: "Supabase", description: "Health checks for Supabase connectivity" },
  ],
  paths: {
    "/api/ocr": {
      post: {
        tags: ["OCR"],
        summary: "Upload receipt for OCR",
        description:
          "Accepts a single file upload and returns a stubbed OCR payload until the real pipeline is wired.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "JPEG, PNG, HEIC, HEIF, or PDF up to 10MB.",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Upload succeeded – stub response is returned.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OcrResponse" },
              },
            },
          },
          "400": {
            description: "Missing or invalid file upload.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OcrErrorResponse" },
              },
            },
          },
          "500": {
            description:
              "Server misconfiguration (Supabase credentials missing) or upload failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OcrErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/supabase-test": {
      get: {
        tags: ["Supabase"],
        summary: "Hello world RPC test",
        description:
          "Executes the `hello_world` Postgres function via Supabase to confirm credentials are configured correctly.",
        responses: {
          "200": {
            description: "Supabase responded successfully.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SupabaseHelloResponse",
                },
              },
            },
          },
          "500": {
            description: "Supabase returned an error or is misconfigured.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SupabaseErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      OcrResponse: {
        type: "object",
        properties: {
          rawText: {
            type: "string",
            example: "SAMPLE",
          },
          message: {
            type: "string",
            example: "File uploaded successfully",
          },
          storedPath: {
            type: "string",
            description: "Supabase storage path of the uploaded asset.",
            example:
              "uploads/2025-11-19/c0b292bb-ef5a-4d0c-b3a7-a5ef9e3fbe58.png",
          },
          publicUrl: {
            type: "string",
            description:
              "Shareable URL. Requires the bucket/object to be public or served via CDN.",
            example:
              "https://pkuertuopioehtohlvqi.supabase.co/storage/v1/object/public/receipts/uploads/2025-11-19/c0b292bb.png",
          },
        },
        required: ["rawText", "message", "storedPath"],
      },
      SupabaseHelloResponse: {
        type: "object",
        properties: {
          ok: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Supabase connection succeeded",
          },
          data: {
            type: "string",
            example: "hello world",
          },
        },
        required: ["ok", "message"],
      },
      OcrErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "string",
            example: "A file upload is required under the \"file\" field.",
          },
        },
        required: ["error"],
      },
      SupabaseErrorResponse: {
        type: "object",
        properties: {
          ok: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Supabase authentication failed",
          },
        },
        required: ["ok", "message"],
      },
    },
  },
};
