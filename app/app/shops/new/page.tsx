import { createShop } from "../actions";

export default function NewShopPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Add shop</h1>
      </div>

      <form action={createShop} className="card max-w-lg space-y-4 p-6">
        <div>
          <label className="label" htmlFor="business_name">
            Business name
          </label>
          <input id="business_name" name="business_name" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="contact_name">
            Contact name
          </label>
          <input id="contact_name" name="contact_name" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="contact_email">
            Contact email
          </label>
          <input id="contact_email" name="contact_email" type="email" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="contact_phone">
            Contact phone
          </label>
          <input id="contact_phone" name="contact_phone" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="service_area">
            Service area
          </label>
          <input id="service_area" name="service_area" placeholder="e.g. Quincy, MA" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="notes">
            Notes
          </label>
          <textarea id="notes" name="notes" rows={3} className="input" />
        </div>
        <button type="submit" className="btn-primary w-full">
          Add shop
        </button>
      </form>
    </>
  );
}
