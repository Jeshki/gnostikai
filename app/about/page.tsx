import { AboutView } from "@/components/AboutView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kas yra gnosticizmas?",
  description:
    "Gnosticizmas kaip mokslinis skėtis: setianai, valentinianai, Tomas, Nag Hammadi ir viešosios nuosavybės korpusas. AEON — ne bažnyčia ir ne iniciacija.",
};

export default function AboutPage() {
  return <AboutView />;
}
