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
import { Hotel, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import StarRating from "../components/StarRating";
import {
  useCreateHotel,
  useDeleteHotel,
  useHotels,
  useUpdateHotel,
} from "../hooks/useBackend";
import type { Hotel as HotelType } from "../types";
import { AdminMobileNav, AdminSidebar } from "./AdminDashboardPage";

const STAR_OPTIONS = ["1", "2", "3", "4", "5"] as const;

interface HotelFormData {
  name: string;
  location: string;
  description: string;
  amenities: string;
  pricePerNight: string;
  starRating: string;
  totalRooms: string;
  imageUrls: string;
}

const EMPTY_FORM: HotelFormData = {
  name: "",
  location: "",
  description: "",
  amenities: "",
  pricePerNight: "",
  starRating: "3",
  totalRooms: "",
  imageUrls: "",
};

function HotelFormDialog({
  open,
  onClose,
  initial,
  mode,
  editId,
}: {
  open: boolean;
  onClose: () => void;
  initial: HotelFormData;
  mode: "add" | "edit";
  editId?: bigint;
}) {
  const [form, setForm] = useState<HotelFormData>(initial);
  const createHotel = useCreateHotel();
  const updateHotel = useUpdateHotel();

  const set = (field: keyof HotelFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = {
      name: form.name,
      location: form.location,
      description: form.description,
      imageUrls: form.imageUrls
        ? form.imageUrls
            .split(",")
            .map((u) => u.trim())
            .filter(Boolean)
        : [],
      amenities: form.amenities
        ? form.amenities
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : [],
      pricePerNight: BigInt(form.pricePerNight || "0"),
      starRating: BigInt(form.starRating || "3"),
      totalRooms: BigInt(form.totalRooms || "0"),
    };
    if (mode === "edit" && editId !== undefined) {
      updateHotel.mutate({ id: editId, input }, { onSuccess: onClose });
    } else {
      createHotel.mutate(input, { onSuccess: onClose });
    }
  };

  const isPending = createHotel.isPending || updateHotel.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid={`admin.hotels.${mode}_dialog`}
      >
        <DialogHeader>
          <DialogTitle className="font-display">
            {mode === "add" ? "Add New Hotel" : "Edit Hotel"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="hotel-name">Hotel Name</Label>
            <Input
              id="hotel-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Sparsa Resorts Kanyakumari"
              required
              data-ocid="admin.hotels.form.name_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hotel-location">Location</Label>
            <Input
              id="hotel-location"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Beachfront, Kanyakumari"
              required
              data-ocid="admin.hotels.form.location_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hotel-desc">Description</Label>
            <Textarea
              id="hotel-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the hotel..."
              rows={3}
              required
              data-ocid="admin.hotels.form.description_textarea"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hotel-amenities">
              Amenities{" "}
              <span className="text-muted-foreground font-normal">
                (comma-separated)
              </span>
            </Label>
            <Input
              id="hotel-amenities"
              value={form.amenities}
              onChange={(e) => set("amenities", e.target.value)}
              placeholder="Pool, WiFi, Restaurant, Spa"
              data-ocid="admin.hotels.form.amenities_input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="hotel-price">Price per Night (₹)</Label>
              <Input
                id="hotel-price"
                type="number"
                min="0"
                value={form.pricePerNight}
                onChange={(e) => set("pricePerNight", e.target.value)}
                placeholder="3500"
                required
                data-ocid="admin.hotels.form.price_input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hotel-stars">Star Rating</Label>
              <Select
                value={form.starRating}
                onValueChange={(v) => set("starRating", v)}
              >
                <SelectTrigger
                  id="hotel-stars"
                  data-ocid="admin.hotels.form.star_rating_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAR_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {"★".repeat(Number(s))} ({s} stars)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hotel-rooms">Total Rooms</Label>
            <Input
              id="hotel-rooms"
              type="number"
              min="1"
              value={form.totalRooms}
              onChange={(e) => set("totalRooms", e.target.value)}
              placeholder="48"
              required
              data-ocid="admin.hotels.form.total_rooms_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hotel-images">
              Image URLs{" "}
              <span className="text-muted-foreground font-normal">
                (comma-separated)
              </span>
            </Label>
            <Input
              id="hotel-images"
              value={form.imageUrls}
              onChange={(e) => set("imageUrls", e.target.value)}
              placeholder="https://example.com/img1.jpg"
              data-ocid="admin.hotels.form.image_urls_input"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="admin.hotels.form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="admin.hotels.form.submit_button"
            >
              {isPending
                ? "Saving…"
                : mode === "add"
                  ? "Add Hotel"
                  : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminHotelsPage() {
  const { data: hotels, isLoading } = useHotels();
  const deleteHotel = useDeleteHotel();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<HotelType | null>(null);

  const openAdd = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (hotel: HotelType) => {
    setEditTarget(hotel);
    setDialogOpen(true);
  };

  const formInitial: HotelFormData = editTarget
    ? {
        name: editTarget.name,
        location: editTarget.location,
        description: editTarget.description,
        amenities: editTarget.amenities.join(", "),
        pricePerNight: editTarget.pricePerNight.toString(),
        starRating: editTarget.starRating.toString(),
        totalRooms: editTarget.totalRooms.toString(),
        imageUrls: editTarget.imageUrls.join(", "),
      }
    : EMPTY_FORM;

  return (
    <div
      className="flex min-h-[calc(100vh-4rem)]"
      data-ocid="admin.hotels_page"
    >
      <AdminSidebar activePath="/admin/hotels" />

      <div className="flex-1 min-w-0">
        <AdminMobileNav activePath="/admin/hotels" />

        <div className="p-6 lg:p-8 bg-background min-h-full">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-0.5">
                Hotels
              </h1>
              <p className="text-sm text-muted-foreground">
                {hotels?.length ?? 0} properties listed
              </p>
            </div>
            <Button
              onClick={openAdd}
              data-ocid="admin.hotels.add_button"
              className="transition-smooth"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Hotel
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
              data-ocid="admin.hotels.table"
            >
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground hidden sm:table-cell">
                      Stars
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground hidden md:table-cell">
                      Price/Night
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground hidden lg:table-cell">
                      Rooms
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(hotels ?? []).map((hotel, i) => (
                    <tr
                      key={hotel.id.toString()}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-smooth"
                      data-ocid={`admin.hotels.row.item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Hotel className="w-3.5 h-3.5 text-accent shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium text-foreground truncate max-w-[12rem]">
                              {hotel.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {hotel.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <StarRating
                          rating={Number(hotel.starRating)}
                          size="sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell font-medium text-primary">
                        ₹{hotel.pricePerNight.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell text-muted-foreground">
                        {hotel.totalRooms.toString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEdit(hotel)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-smooth"
                            aria-label={`Edit ${hotel.name}`}
                            data-ocid={`admin.hotels.edit_button.${i + 1}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete "${hotel.name}"?`)) {
                                deleteHotel.mutate(hotel.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
                            aria-label={`Delete ${hotel.name}`}
                            data-ocid={`admin.hotels.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(hotels ?? []).length === 0 && (
                <div
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="admin.hotels.empty_state"
                >
                  <Hotel className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No hotels yet</p>
                  <p className="text-xs mt-1">Add your first property</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <HotelFormDialog
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
