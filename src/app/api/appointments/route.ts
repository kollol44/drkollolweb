import { NextRequest, NextResponse } from 'next/server';
import { appointmentSchema } from '@/lib/validations/appointment';
import { createAppointment } from '@/lib/content/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = appointmentSchema.safeParse(body);

    if (!result.error && result.data) {
      const saved = await createAppointment({
        patient_name: result.data.patient_name,
        patient_phone: result.data.patient_phone,
        chamber_name: result.data.chamber_name,
        preferred_date: result.data.preferred_date,
        problem_summary: result.data.problem_summary || '',
        status: 'pending',
      });

      return NextResponse.json(
        { success: true, message: 'Appointment request received successfully.', appointment: saved },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Appointment API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error processing appointment request.' },
      { status: 500 }
    );
  }
}
