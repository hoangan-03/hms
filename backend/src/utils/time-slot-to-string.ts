import { TimeSlot } from "@/modules/appointment/enums/time-slot.enum";

export function timeSlotToString(timeSlot: TimeSlot): string {
  switch (timeSlot) {
    case TimeSlot.a7_8:
      return "07:00 - 08:00";
    case TimeSlot.a8_9:
      return "08:00 - 09:00";
    case TimeSlot.a9_10:
      return "09:00 - 10:00";
    case TimeSlot.a10_11:
      return "10:00 - 11:00";
    case TimeSlot.a11_12:
      return "11:00 - 12:00";
    case TimeSlot.a12_13:
      return "12:00 - 13:00";
    case TimeSlot.a13_14:
      return "13:00 - 14:00";
    case TimeSlot.a14_15:
      return "14:00 - 15:00";
    case TimeSlot.a15_16:
      return "15:00 - 16:00";
    case TimeSlot.a16_17:
      return "16:00 - 17:00";
    case TimeSlot.a17_18:
      return "17:00 - 18:00";
    case TimeSlot.a18_19:
      return "18:00 - 19:00";
    case TimeSlot.a19_20:
      return "19:00 - 20:00";
    case TimeSlot.a20_21:
      return "20:00 - 21:00";
    default:
      return "Invalid Time Slot";
  }
}
