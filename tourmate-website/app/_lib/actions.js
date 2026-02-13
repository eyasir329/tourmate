"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";

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

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const guestBookings = await getBookings(session.user.id);
  const bookingIds = guestBookings.map((booking) => booking.id);
  if (!bookingIds.includes(bookingId)) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    throw new Error("Booking could not be deleted");
  }
  revalidatePath("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
