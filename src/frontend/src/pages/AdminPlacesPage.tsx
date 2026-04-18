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
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  useCreatePlace,
  useDeletePlace,
  usePlaces,
  useUpdatePlace,
} from "../hooks/useBackend";
import type { Place, PlaceCategory } from "../types";
import { AdminMobileNav, AdminSidebar } from "./AdminDashboardPage";

const CATEGORIES: PlaceCategory[] = [
  "Beach",
  "Waterfall",
  "Temple",
  "Historical",
  "Nature",
  "Viewpoint",
  "Museum",
];

interface PlaceFormData {
  name: string;
  category: PlaceCategory;
  description: string;
  address: string;
  bestTimeToVisit: string;
  imageUrls: string;
}

const EMPTY_FORM: PlaceFormData = {
  name: "",
  category: "Beach",
  description: "",
  address: "",
  bestTimeToVisit: "",
  imageUrls: "",
};

function PlaceFormDialog({
  open,
  onClose,
  initial,
  mode,
  editId,
}: {
  open: boolean;
  onClose: () => void;
  initial: PlaceFormData;
  mode: "add" | "edit";
  editId?: bigint;
}) {
  const [form, setForm] = useState<PlaceFormData>(initial);
  const createPlace = useCreatePlace();
  const updatePlace = useUpdatePlace();

  const set = (field: keyof PlaceFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = {
      name: form.name,
      category: form.category,
      description: form.description,
      address: form.address,
      bestTimeToVisit: form.bestTimeToVisit,
      imageUrls: form.imageUrls
        ? form.imageUrls
            .split(",")
            .map((u) => u.trim())
            .filter(Boolean)
        : [],
      isFeatured: false,
    };
    if (mode === "edit" && editId !== undefined) {
      updatePlace.mutate({ id: editId, input }, { onSuccess: onClose });
    } else {
      createPlace.mutate(input, { onSuccess: onClose });
    }
  };

  const isPending = createPlace.isPending || updatePlace.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg"
        data-ocid={`admin.places.${mode}_dialog`}
      >
        <DialogHeader>
          <DialogTitle className="font-display">
            {mode === "add" ? "Add New Place" : "Edit Place"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="place-name">Name</Label>
              <Input
                id="place-name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Vivekananda Rock Memorial"
                required
                data-ocid="admin.places.form.name_input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="place-category">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => set("category", v)}
              >
                <SelectTrigger
                  id="place-category"
                  data-ocid="admin.places.form.category_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="place-desc">Description</Label>
              <Textarea
                id="place-desc"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe this tourist attraction..."
                rows={3}
                required
                data-ocid="admin.places.form.description_textarea"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="place-address">Address</Label>
              <Input
                id="place-address"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Kanyakumari, Tamil Nadu"
                required
                data-ocid="admin.places.form.address_input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="place-best-time">Best Time to Visit</Label>
              <Input
                id="place-best-time"
                value={form.bestTimeToVisit}
                onChange={(e) => set("bestTimeToVisit", e.target.value)}
                placeholder="October to March"
                required
                data-ocid="admin.places.form.best_time_input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="place-images">
                Image URLs{" "}
                <span className="text-muted-foreground font-normal">
                  (comma-separated)
                </span>
              </Label>
              <Input
                id="place-images"
                value={form.imageUrls}
                onChange={(e) => set("imageUrls", e.target.value)}
                placeholder="https://example.com/img1.jpg, https://..."
                data-ocid="admin.places.form.image_urls_input"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="admin.places.form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="admin.places.form.submit_button"
            >
              {isPending
                ? "Saving…"
                : mode === "add"
                  ? "Add Place"
                  : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminPlacesPage() {
  const { data: places, isLoading } = usePlaces();
  const deletePlace = useDeletePlace();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Place | null>(null);

  const openAdd = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (place: Place) => {
    setEditTarget(place);
    setDialogOpen(true);
  };

  const formInitial: PlaceFormData = editTarget
    ? {
        name: editTarget.name,
        category: editTarget.category,
        description: editTarget.description,
        address: editTarget.address,
        bestTimeToVisit: editTarget.bestTimeToVisit,
        imageUrls: editTarget.imageUrls.join(", "),
      }
    : EMPTY_FORM;

  return (
    <div
      className="flex min-h-[calc(100vh-4rem)]"
      data-ocid="admin.places_page"
    >
      <AdminSidebar activePath="/admin/places" />

      <div className="flex-1 min-w-0">
        <AdminMobileNav activePath="/admin/places" />

        <div className="p-6 lg:p-8 bg-background min-h-full">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-0.5">
                Tourist Places
              </h1>
              <p className="text-sm text-muted-foreground">
                {places?.length ?? 0} locations listed
              </p>
            </div>
            <Button
              onClick={openAdd}
              data-ocid="admin.places.add_button"
              className="transition-smooth"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Place
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
              data-ocid="admin.places.table"
            >
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground hidden sm:table-cell">
                      Category
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground hidden lg:table-cell">
                      Best Time
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">
                      Featured
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(places ?? []).map((place, i) => (
                    <tr
                      key={place.id.toString()}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-smooth"
                      data-ocid={`admin.places.row.item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="font-medium text-foreground truncate max-w-[12rem]">
                            {place.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge variant="secondary">{place.category}</Badge>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                        {place.bestTimeToVisit}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {place.isFeatured ? (
                          <span className="text-xs bg-secondary/15 text-secondary-foreground px-2 py-0.5 rounded-full border border-secondary/30">
                            Featured
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEdit(place)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-smooth"
                            aria-label={`Edit ${place.name}`}
                            data-ocid={`admin.places.edit_button.${i + 1}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete "${place.name}"?`)) {
                                deletePlace.mutate(place.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
                            aria-label={`Delete ${place.name}`}
                            data-ocid={`admin.places.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(places ?? []).length === 0 && (
                <div
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="admin.places.empty_state"
                >
                  <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No places yet</p>
                  <p className="text-xs mt-1">
                    Add your first tourist attraction
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <PlaceFormDialog
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
