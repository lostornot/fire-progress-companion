import { CheckinForm } from "@/features/checkins/components/checkin-form";
import { CheckinHistory } from "@/features/checkins/components/checkin-history";

export default function CheckinsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <CheckinForm />
      <CheckinHistory />
    </div>
  );
}
