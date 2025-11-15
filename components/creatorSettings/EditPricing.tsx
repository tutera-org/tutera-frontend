import { BigSingleAvatar } from "../Reuse/Avatar";
import EditForm from "./EditForm";

export default function EditPricing() {
  return (
    <div className="mt-6 sm:mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
      <aside className="lg:col-span-1 flex justify-center lg:justify-start">
        {/* Image and icon */}
        <BigSingleAvatar name="Ansah Chikeh" />
      </aside>

      <EditForm />
    </div>
  );
}
