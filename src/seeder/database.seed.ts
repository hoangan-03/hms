import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import { Patient } from "@/entities/patient.entity";
import { Doctor } from "@/entities/doctor.entity";
import { Department } from "@/entities/department.entity";
import { Appointment } from "@/entities/appointment.entity";
import { MedicalRecord } from "@/entities/medical-record.entity";
import { Prescription } from "@/entities/prescription.entity";
import { Insurance } from "@/entities/insurance.entity";
import { Billing } from "@/entities/billing.entity";
import { Gender } from "@/modules/patient/enums/gender.enum";

// Sample data
const departmentData = [
  {
    name: "Cardiology",
    description: "Diagnosis and treatment of heart diseases"
  },
  {
    name: "Neurology",
    description: "Diagnosis and treatment of nervous system disorders"
  },
  {
    name: "Pediatrics",
    description: "Medical care for infants, children, and adolescents"
  },
  {
    name: "Orthopedics",
    description: "Diagnosis and treatment of musculoskeletal conditions"
  },
  {
    name: "Dermatology",
    description: "Diagnosis and treatment of skin conditions"
  },
];

const insuranceProviders = [
  "BlueCross BlueShield",
  "UnitedHealthcare",
  "Aetna",
  "Cigna",
  "Humana",
  "Kaiser Permanente",
  "Medicare",
  "Medicaid",
];

const createFakeDoctor = (departmentId: number) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  
  return {
    name: `Dr. ${firstName} ${lastName}`,
    phoneNumber: faker.phone.number({ style: 'international' }),
    department: { id: departmentId },
  };
};

const createFakePatient = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet.username();
  const password = faker.internet.password();
  
  return {
    name: `${firstName} ${lastName}`,
    age: faker.number.int({ min: 1, max: 100 }),
    gender: faker.helpers.arrayElement([Gender.MALE, Gender.FEMALE]),
    username,
    password,
    phoneNumber: faker.phone.number({ style: 'international' }),
    address: faker.location.streetAddress(),
  };
};

const createFakeAppointment = (patientId: number, doctorId: number) => {
  // Generate a future date within next 30 days
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + faker.number.int({ min: 1, max: 30 }));
  
  // Set hours between 9 AM and 5 PM
  futureDate.setHours(faker.number.int({ min: 9, max: 17 }), 0, 0, 0);
  
  return {
    dateTime: futureDate,
    reason: faker.helpers.arrayElement([
      "Annual checkup", 
      "Follow-up visit",
      "Emergency",
      "Consultation",
      "Vaccination",
    ]),
    patient: { id: patientId },
    doctor: { id: doctorId },
  };
};

const createFakeMedicalRecord = (patientId: number, doctorId: number) => {
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - faker.number.int({ min: 1, max: 60 }));
  
  return {
    diagnosis: faker.helpers.arrayElement([
      "Common cold",
      "Influenza",
      "Hypertension",
      "Diabetes Type 2",
      "Allergic rhinitis",
      "Bronchitis",
    ]),
    recordDate: pastDate,
    patient: { id: patientId },
    doctor: { id: doctorId },
  };
};

const createFakePrescription = (medicalRecordId: number) => {
  const medications = [
    { name: "Amoxicillin", dosage: "500mg twice daily for 10 days" },
    { name: "Ibuprofen", dosage: "400mg as needed for pain" },
    { name: "Lisinopril", dosage: "10mg once daily" },
    { name: "Metformin", dosage: "500mg twice daily with meals" },
    { name: "Atorvastatin", dosage: "20mg once daily at bedtime" },
  ];
  
  const med = faker.helpers.arrayElement(medications);
  
  return {
    medication: med.name,
    dosage: med.dosage,
    medicalRecord: { id: medicalRecordId }
  };
};

const createFakeInsurance = (patientId: number) => {
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + faker.number.int({ min: 1, max: 5 }));
  
  return {
    provider: faker.helpers.arrayElement(insuranceProviders),
    policyNumber: `POL-${faker.string.alphanumeric(8).toUpperCase()}`,
    coverage: faker.number.float({ min: 50, max: 100, fractionDigits: 2 }),
    expiryDate: futureDate,
    patient: { id: patientId }
  };
};

const createFakeBilling = (patientId: number) => {
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - faker.number.int({ min: 1, max: 30 }));
  
  return {
    amount: faker.number.float({ min: 50, max: 5000, fractionDigits: 2 }),
    billingDate: pastDate,
    patient: { id: patientId }
  };
};

// Main seeding function
export const seedDatabase = async (dataSource: DataSource) => {
  console.log("🌱 Starting database seeding process...");

  // Get all repositories
  const departmentRepository = dataSource.getRepository(Department);
  const doctorRepository = dataSource.getRepository(Doctor);
  const patientRepository = dataSource.getRepository(Patient);
  const appointmentRepository = dataSource.getRepository(Appointment);
  const medicalRecordRepository = dataSource.getRepository(MedicalRecord);
  const prescriptionRepository = dataSource.getRepository(Prescription);
  const insuranceRepository = dataSource.getRepository(Insurance);
  const billingRepository = dataSource.getRepository(Billing);

  // Clear all data using raw queries to handle foreign key constraints
  console.log("🧹 Clearing existing data...");

  // Use a transaction for the delete operations
  await dataSource.transaction(async (manager) => {
    // Delete in proper order (child tables first)
    await manager.query('DELETE FROM "prescriptions"');
    await manager.query('DELETE FROM "appointments"');
    await manager.query('DELETE FROM "medical_records"');
    await manager.query('DELETE FROM "insurances"');
    await manager.query('DELETE FROM "billing"');
    
    // Then delete parent tables
    await manager.query('DELETE FROM "doctors"');
    await manager.query('DELETE FROM "patients"');
    await manager.query('DELETE FROM "departments"');
  });

  // 1. Seed departments
  console.log("🏥 Seeding departments...");
  const departments: Department[] = [];

  for (const dept of departmentData) {
    const department = departmentRepository.create(dept);
    await departmentRepository.save(department);
    departments.push(department);
  }
  console.log(`✅ Created ${departments.length} departments`);

  // 2. Seed doctors
  console.log("👨‍⚕️ Seeding doctors...");
  const doctors: Doctor[] = [];
  const doctorCount = 10; // Adjust as needed

  for (let i = 0; i < doctorCount; i++) {
    const departmentId = departments[i % departments.length].id;
    const doctorData = createFakeDoctor(departmentId);
    const doctor = doctorRepository.create(doctorData);
    await doctorRepository.save(doctor);
    doctors.push(doctor);
  }
  console.log(`✅ Created ${doctors.length} doctors`);

  // 3. Seed patients
  console.log("🧑 Seeding patients...");
  const patients: Patient[] = [];
  const patientCount = 20; // Adjust as needed

  for (let i = 0; i < patientCount; i++) {
    const patientData = createFakePatient();
    const patient = patientRepository.create(patientData);
    await patientRepository.save(patient);
    patients.push(patient);
  }
  console.log(`✅ Created ${patients.length} patients`);

  // 4. Seed appointments
  console.log("📅 Seeding appointments...");
  const appointments: Appointment[] = [];
  const appointmentCount = 30; // Adjust as needed

  for (let i = 0; i < appointmentCount; i++) {
    const patientId = patients[i % patients.length].id;
    const doctorId = doctors[i % doctors.length].id;
    const appointmentData = createFakeAppointment(patientId, doctorId);
    const appointment = appointmentRepository.create(appointmentData);
    await appointmentRepository.save(appointment);
    appointments.push(appointment);
  }
  console.log(`✅ Created ${appointments.length} appointments`);

  // 5. Seed medical records
  console.log("📋 Seeding medical records...");
  const medicalRecords: MedicalRecord[] = [];
  const recordCount = 25; // Adjust as needed

  for (let i = 0; i < recordCount; i++) {
    const patientId = patients[i % patients.length].id;
    const doctorId = doctors[i % doctors.length].id;
    const recordData = createFakeMedicalRecord(patientId, doctorId);
    const record = medicalRecordRepository.create(recordData);
    await medicalRecordRepository.save(record);
    medicalRecords.push(record);
  }
  console.log(`✅ Created ${medicalRecords.length} medical records`);

  // 6. Seed prescriptions
  console.log("💊 Seeding prescriptions...");
  const prescriptions: Prescription[] = [];

  for (const record of medicalRecords) {
    // 1-3 prescriptions per medical record
    const prescriptionCount = faker.number.int({ min: 1, max: 3 });
    
    for (let i = 0; i < prescriptionCount; i++) {
      const prescriptionData = createFakePrescription(record.id);
      const prescription = prescriptionRepository.create(prescriptionData);
      await prescriptionRepository.save(prescription);
      prescriptions.push(prescription);
    }
  }
  console.log(`✅ Created ${prescriptions.length} prescriptions`);

  // 7. Seed insurances
  console.log("🏥 Seeding insurance information...");
  const insurances: Insurance[] = [];

  for (const patient of patients) {
    const insuranceData = createFakeInsurance(patient.id);
    const insurance = insuranceRepository.create(insuranceData);
    await insuranceRepository.save(insurance);
    insurances.push(insurance);
  }
  console.log(`✅ Created ${insurances.length} insurance records`);

  // 8. Seed billing
  console.log("💵 Seeding billing information...");
  const billings: Billing[] = [];

  for (const patient of patients) {
    // 1-3 billings per patient
    const billingCount = faker.number.int({ min: 1, max: 3 });
    
    for (let i = 0; i < billingCount; i++) {
      const billingData = createFakeBilling(patient.id);
      const billing = billingRepository.create(billingData);
      await billingRepository.save(billing);
      billings.push(billing);
    }
  }
  console.log(`✅ Created ${billings.length} billing records`);

  console.log("✅ Database seeding completed successfully!");
};