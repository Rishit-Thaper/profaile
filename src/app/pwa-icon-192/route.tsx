import { renderPwaIcon } from "@/features/pwa/render-icon";

export const dynamic = "force-static";

export function GET() {
  return renderPwaIcon(192);
}
