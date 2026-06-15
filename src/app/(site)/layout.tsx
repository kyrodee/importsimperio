import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getCustomerHeaderState } from "@/lib/customer";
import { getCategories, getSiteSettings } from "@/lib/db";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, categories, customerState] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getCustomerHeaderState(),
  ]);

  return (
    <>
      <SiteHeader settings={settings} categories={categories} customerState={customerState} />
      {children}
      <SiteFooter settings={settings} categories={categories} />
    </>
  );
}
