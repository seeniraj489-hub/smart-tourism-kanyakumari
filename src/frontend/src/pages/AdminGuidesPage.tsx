import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Phone, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import {
  useCreateGuide,
  useDeleteGuide,
  useGuides,
  useUpdateGuide,
} from "../hooks/useBackend";
import type { Guide, GuideSpecialization } from "../types";
import { AdminMobileNav, AdminSidebar } from "./AdminDashboardPage";

const SPECIALIZATIONS: GuideSpecialization[] = [
  "Historical Tours",
  "Nature & Wildlife",
  "Local Cuisine",
  "Photography Tours",
  "Adventure",
  "Cultural Heritage",
];

interface GuideFormData {
  name: string;
  specialization: GuideSpecialization;
  bio: string;
  languagesSpoken: string;
  phoneNumber: string;
  ratePerDay: string;
  experienceYears: string;
}

const EMPTY_FORM: GuideFormData = {
  name: "",
  specialization: "Historical Tours",
  bio: "",
  languagesSpoken: "",
  phoneNumber: "",
  ratePerDay: "",
  experienceYears: "",
};

function GuideFormDialog({
  open,
  onClose,
  initial,
  mode,
  editId,
}: {
  open: boolean;
  onClose: () => void;
  initial: GuideFormData;
  mode: "add" | "edit";
  editId?: bigint;
}) {
  const [form, setForm] = useState<GuideFormData>(initial);
  const createGuide = useCreateGuide();
  const updateGuide = useUpdateGuide();

  const set = (field: keyof GuideFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = {
      name: form.name,
      specialization: form.specialization,
      bio: form.bio,
      languagesSpoken: form.languagesSpoken
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
      phoneNumber: form.phoneNumber,
      ratePerDay: BigInt(form.ratePerDay || "0"),
      experienceYears: BigInt(form.experienceYears || "0"),
      imageUrl: "",
      isAvailable: true,
    };
    if (mode === "edit" && editId !== undefined) {
      updateGuide.mutate({ id: editId, input }, { onSuccess: onClose });
    } else {
      createGuide.mutate(input, { onSuccess: onClose });
    }
  };

  const isPending = createGuide.isPending || updateGuide.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid={`admin.guides.${mode}_dialog`}
      >
        <DialogHeader>
          <DialogTitle className="font-display">
            {mode === "add" ? "Add New Guide" : "Edit Guide"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="guide-name">Full Name</Label>
            <Input
              id="guide-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Rajan Pillai"
              required
              data-ocid="admin.guides.form.name_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="guide-spec">Specialization</Label>
            <Select
              value={form.specialization}
              onValueChange={(v) => set("specialization", v)}
            >
              <SelectTrigger
                id="guide-spec"
                data-ocid="admin.guides.form.specialization_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPECIALIZATIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="guide-bio">Bio</Label>
            <Textarea
              id="guide-bio"
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Describe the guide's experience and background..."
              rows={3}
              required
              data-ocid="admin.guides.form.bio_textarea"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="guide-langs">
              Languages Spoken{" "}
              <span className="text-muted-foreground font-normal">
                (comma-separated)
              </span>
            </Label>
            <Input
              id="guide-langs"
              value={form.languagesSpoken}
              onChange={(e) => set("languagesSpoken", e.target.value)}
              placeholder="Tamil, English, Malayalam"
              required
              data-ocid="admin.guides.form.languages_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="guide-phone">Phone Number</Label>
            <Input
              id="guide-phone"
              type="tel"
              value={form.phoneNumber}
              onChange={(e) => set("phoneNumber", e.target.value)}
              placeholder="+91 94430 12345"
              required
              data-ocid="admin.guides.form.phone_input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="guide-rate">Rate per Day (₹)</Label>
              <Input
                id="guide-rate"
                type="number"
                min="0"
                value={form.ratePerDay}
                onChange={(e) => set("ratePerDay", e.target.value)}
                placeholder="1200"
                required
                data-ocid="admin.guides.form.rate_input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="guide-exp">Experience (years)</Label>
              <Input
                id="guide-exp"
                type="number"
                min="0"
                value={form.experienceYears}
                onChange={(e) => set("experienceYears", e.target.value)}
                placeholder="10"
                required
                data-ocid="admin.guides.form.experience_input"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="admin.guides.form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="admin.guides.form.submit_button"
            >
              {isPending
                ? "Saving…"
                : mode === "add"
                  ? "Add Guide"
                  : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminGuidesPage() {
  const { data: guides, isLoading } = useGuides();
  const deleteGuide = useDeleteGuide();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Guide | null>(null);

  const openAdd = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (guide: Guide) => {
    setEditTarget(guide);
    setDialogOpen(true);
  };

  const formInitial: GuideFormData = editTarget
    ? {
        name: editTarget.name,
        specialization: editTarget.specialization,
        bio: editTarget.bio,
        languagesSpoken: editTarget.languagesSpoken.join(", "),
        phoneNumber: editTarget.phoneNumber,
        ratePerDay: editTarget.ratePerDay.toString(),
        experienceYears: editTarget.experienceYears.toString(),
      }
    : EMPTY_FORM;

  return (
    <div
      className="flex min-h-[calc(100vh-4rem)]"
      data-ocid="admin.guides_page"
    >
      <AdminSidebar activePath="/admin/guides" />

      <div className="flex-1 min-w-0">
        <AdminMobileNav activePath="/admin/guides" />

        <div className="p-6 lg:p-8 bg-background min-h-full">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-0.5">
                Local Guides
              </h1>
              <p className="text-sm text-muted-foreground">
                {guides?.length ?? 0} guides registered
              </p>
            </div>
            <Button
              onClick={openAdd}
              data-ocid="admin.guides.add_button"
              className="transition-smooth"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Guide
            </Button>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="space-y-2">
              {["a", "b", "c"].map((k) => (
                <Skeleton key={k} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div
              className="bg-card border border-border rounded-xl overflow-hidden surface-card"
              data-ocid="admin.guides.table"
            >
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground hidden sm:table-cell">
                      Specialization
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground hidden lg:table-cell">
                      Phone
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground hidden md:table-cell">
                      Rate/Day
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(guides ?? []).map((guide, i) => (
                    <tr
                      key={guide.id.toString()}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-smooth"
                      data-ocid={`admin.guides.row.item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-secondary/15 flex items-center justify-center text-secondary-foreground font-semibold text-xs shrink-0">
                            {guide.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-foreground truncate max-w-[10rem]">
                              {guide.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {guide.experienceYears.toString()} yrs exp
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          {guide.specialization}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <a
                          href={`tel:${guide.phoneNumber}`}
                          className="flex items-center gap-1 text-accent hover:underline text-xs"
                        >
                          <Phone className="w-3 h-3" /> {guide.phoneNumber}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell font-medium text-primary">
                        ₹{guide.ratePerDay.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${
                            guide.isAvailable
                              ? "bg-secondary/15 text-secondary-foreground border-secondary/30"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {guide.isAvailable ? "Available" : "Busy"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEdit(guide)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-smooth"
                            aria-label={`Edit ${guide.name}`}
                            data-ocid={`admin.guides.edit_button.${i + 1}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete "${guide.name}"?`)) {
                                deleteGuide.mutate(guide.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
                            aria-label={`Delete ${guide.name}`}
                            data-ocid={`admin.guides.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(guides ?? []).length === 0 && (
                <div
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="admin.guides.empty_state"
                >
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No guides yet</p>
                  <p className="text-xs mt-1">
                    Register your first local guide
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <GuideFormDialog
        key={editTarget?.id.toString() ?? "new"}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initial={formInitial}
        mode={editTarget ? "edit" : "add"}
        editId={editTarget?.id}
      />
    </div>
  );
}
