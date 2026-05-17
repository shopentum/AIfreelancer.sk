import { NextRequest } from "next/server";
import {
  handlePrusafinanceContactOptions,
  handlePrusafinanceContactPost,
} from "@/lib/prusafinance/contact-handler";

export async function OPTIONS(request: NextRequest) {
  return handlePrusafinanceContactOptions(request);
}

export async function POST(request: NextRequest) {
  return handlePrusafinanceContactPost(request);
}
