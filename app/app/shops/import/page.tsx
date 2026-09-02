import { CsvImportForm } from "@/components/CsvImportForm";
import { importShops } from "./actions";

export default function ImportShopsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Import shops</h1>
        <p className="mt-1 text-sm text-muted">
          Required column: <code className="font-mono text-xs">business_name</code>. Optional:
          contact_name, contact_email, contact_phone, service_area, source, notes.
        </p>
      </div>

      <div className="card max-w-lg p-6">
        <CsvImportForm action={importShops} />
      </div>
    </>
  );
}
