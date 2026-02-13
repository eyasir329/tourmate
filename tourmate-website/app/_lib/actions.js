"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updateProfile(formData) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error("Invalid National ID");
  }

  const updateData = {
    nationality,
    countryFlag,
    nationalID,
  };
  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.id);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  revalidatePath("/account/profile");
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const numGuestsRaw = formData.get("numGuests");
  const observationsRaw = formData.get("observations");

  const numGuests = Number(numGuestsRaw);
  if (!Number.isFinite(numGuests) || numGuests <= 0) {
    throw new Error("Invalid number of guests");
  }

  // Normalize dates for Postgres (timestamptz/date) compatibility
  const startDate = bookingData?.startDate
    ? new Date(bookingData.startDate).toISOString()
    : null;
  const endDate = bookingData?.endDate
    ? new Date(bookingData.endDate).toISOString()
    : null;
  if (!startDate || !endDate) {
    throw new Error("Invalid reservation dates");
  }

  const cabinPrice = Number(bookingData?.cabinPrice);
  const numNights = Number(bookingData?.numNights);
  if (!Number.isFinite(cabinPrice) || cabinPrice < 0) {
    throw new Error("Invalid cabin price");
  }
  if (!Number.isFinite(numNights) || numNights <= 0) {
    throw new Error("Invalid number of nights");
  }

  const newBooking = {
    ...bookingData,
    startDate,
    endDate,
    cabinPrice,
    numNights,
    guestId: session.user.id,
    numGuests,
    observations: (observationsRaw ?? "").toString().slice(0, 500), // Limit observations to 500 chars
    extrasPrice: 0, // Placeholder for any extra price calculations (e.g., cleaning fee, service fee)
    totalPrice: cabinPrice, // This can be updated to include extrasPrice if needed
    isPaid: false, // Assuming payment is handled separately
    status: "unconfirmed", // Initial status of the booking
    hasBreakfast: formData.get("hasBreakfast") === "on",
  };

  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    .select()
    .single();

  if (error) {
    console.error("Booking insert failed", { error, newBooking });
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}

export async function deleteBooking(bookingId) {
  // await new Promise((res) => setTimeout(res, 2000));
  // throw new Error("Failed to delete reservation");

  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const id = Number(bookingId);
  if (!Number.isFinite(id)) {
    throw new Error("Invalid booking id");
  }

  // Authorization: delete only if the booking belongs to the current guest
  const { data, error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id)
    .eq("guestId", session.user.id)
    .select("id");

  if (error) {
    console.error("Booking delete failed", {
      error,
      id,
      guestId: session.user.id,
    });
    throw new Error("Booking could not be deleted");
  }

  if (!data || data.length === 0) {
    throw new Error("Unauthorized");
  }
  revalidatePath("/account/reservations");
}

export async function updateReservation(formData) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const bookingId = Number(formData.get("bookingId"));

  const guestBookings = await getBookings(session.user.id);
  const bookingIds = guestBookings.map((booking) => booking.id);
  if (!bookingIds.includes(bookingId)) {
    throw new Error("Unauthorized");
  }

  const numGuests = Number(formData.get("numGuests"));
  if (!Number.isFinite(numGuests) || numGuests <= 0) {
    throw new Error("Invalid number of guests");
  }

  const updatedFields = {
    numGuests,
    observations: (formData.get("observations") ?? "").toString().slice(0, 500), // Limit observations to 500 chars
  };

  const { error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    throw new Error("Booking could not be updated");
  }
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");
  redirect("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
