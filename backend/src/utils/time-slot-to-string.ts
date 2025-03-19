import { TimeSlot } from "@/modules/appointment/enums/time-slot.enum";

export function timeSlotToString(timeSlot: TimeSlot): string {
  switch (timeSlot) {
    case TimeSlot.a0_1:
      return "00:00 - 01:00";
    case TimeSlot.a1_2:
      return "01:00 - 02:00";
    case TimeSlot.a2_3:
      return "02:00 - 03:00";
    case TimeSlot.a3_4:
      return "03:00 - 04:00";
    case TimeSlot.a4_5:
      return "04:00 - 05:00";
    case TimeSlot.a5_6:
      return "05:00 - 06:00";
    case TimeSlot.a6_7:
      return "06:00 - 07:00";
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
    case TimeSlot.a21_22:
      return "21:00 - 22:00";
    case TimeSlot.a22_23:
      return "22:00 - 23:00";
    case TimeSlot.a23_24:
      return "23:00 - 24:00";
    default:
      return "Invalid Time Slot";
  }
}
