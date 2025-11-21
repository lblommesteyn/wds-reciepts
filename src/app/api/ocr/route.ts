import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { SUPABASE_RECEIPTS_BUCKET, supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

type FormDataFile = Blob & {
  name?: string;
  type?: string;
};

const buildStoragePath = (filename?: string) => {
  const safeName = filename?.replace(/\s+/g, "-").toLowerCase();
  const extension =
    safeName && safeName.includes(".")
      ? safeName.split(".").pop()
      : undefined;
  const uniqueId = randomUUID();
  const base = `uploads/${new Date().toISOString().split("T")[0]}`;
  return extension
    ? `${base}/${uniqueId}.${extension}`
    : `${base}/${uniqueId}`;
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json(
      { error: 'A file upload is required under the "file" field.' },
      { status: 400 },
    );
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      {
        error:
          "Supabase service role is not configured. Set SUPABASE_SERVICE_ROLE_KEY in .env.local.",
      },
      { status: 500 },
    );
  }

  const typedFile = file as FormDataFile;
  const arrayBuffer = await typedFile.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);
  const uploadPath = buildStoragePath(
    typeof typedFile.name === "string" ? typedFile.name : undefined,
  );
  const contentType =
    typeof typedFile.type === "string"
      ? typedFile.type
      : "application/octet-stream";

  const { error: uploadError } = await supabaseAdmin.storage
    .from(SUPABASE_RECEIPTS_BUCKET)
    .upload(uploadPath, fileBuffer, {
      contentType,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      {
        error: `Supabase storage upload failed: ${uploadError.message}`,
      },
      { status: 500 },
    );
  }

  const { data: publicData } = supabaseAdmin.storage
    .from(SUPABASE_RECEIPTS_BUCKET)
    .getPublicUrl(uploadPath);
  const publicUrl = publicData?.publicUrl ?? null;

  return NextResponse.json(
    {
      message: "File uploaded successfully",
      storedPath: uploadPath,
      publicUrl,
    },
    { status: 200 },
  );
}
