from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.models import Appointment
from app.schemas.schemas import Appointment as AppointmentSchema, AppointmentCreate
from typing import List

router = APIRouter()

@router.post("/", response_model=AppointmentSchema)
async def book_appointment(data: AppointmentCreate, db: AsyncSession = Depends(get_db)):
    new_appointment = Appointment(
        **data.dict(),
        status="pending"
    )
    db.add(new_appointment)
    await db.commit()
    await db.refresh(new_appointment)
    return new_appointment

@router.get("/patient/{patient_id}", response_model=List[AppointmentSchema])
async def get_patient_appointments(patient_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Appointment).filter(Appointment.patient_id == patient_id))
    return result.scalars().all()

@router.get("/doctor/{doctor_id}", response_model=List[AppointmentSchema])
async def get_doctor_appointments(doctor_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Appointment).filter(Appointment.doctor_id == doctor_id))
    return result.scalars().all()

@router.patch("/{appointment_id}/status")
async def update_appointment_status(appointment_id: int, status: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Appointment).filter(Appointment.id == appointment_id))
    appointment = result.scalars().first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appointment.status = status
    await db.commit()
    return {"message": "Status updated successfully"}

@router.get("/hospital/{hospital_id}")
async def get_hospital_appointments(hospital_id: int, db: AsyncSession = Depends(get_db)):
    from sqlalchemy.orm import joinedload
    from app.models.models import Doctor
    result = await db.execute(
        select(Appointment)
        .options(
            joinedload(Appointment.patient), 
            joinedload(Appointment.doctor).joinedload(Doctor.user)
        )
        .filter(Appointment.hospital_id == hospital_id)
    )
    appointments = result.scalars().all()
    return [
        {
            "id": a.id,
            "patient_name": a.patient.name if a.patient else "Unknown",
            "doctor_name": a.doctor.user.name if a.doctor and a.doctor.user else "Unknown",
            "doctor_id": a.doctor_id,
            "scheduled_at": a.scheduled_at,
            "preferred_time": a.preferred_time,
            "reason": a.reason,
            "status": a.status,
            "type": a.type
        } for a in appointments
    ]

@router.post("/{appointment_id}/approve")
async def approve_appointment(appointment_id: int, db: AsyncSession = Depends(get_db)):
    from app.models.models import SystemAlert, DoctorSchedule, User
    from datetime import datetime, timedelta
    
    result = await db.execute(select(Appointment).filter(Appointment.id == appointment_id))
    appointment = result.scalars().first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment.status = "scheduled"
    
    # 1. Create alert for Doctor
    # Need to find doctor's user_id
    from app.models.models import Doctor
    doc_result = await db.execute(select(Doctor).filter(Doctor.id == appointment.doctor_id))
    doctor = doc_result.scalars().first()
    
    if doctor:
        alert = SystemAlert(
            hospital_id=appointment.hospital_id,
            from_user_id=1, # Admin
            to_user_id=doctor.user_id,
            to_role="doctor",
            message=f"New Scheduled Appointment: Patient {appointment.patient_id} at {appointment.preferred_time}",
            type="notification"
        )
        db.add(alert)
        
        # 2. Add to Doctor Schedule
        # If scheduled_at is None, we use current date + preferred_time or just today
        start_time = appointment.scheduled_at or datetime.now()
        schedule = DoctorSchedule(
            doctor_id=appointment.doctor_id,
            task_name=f"Appointment: {appointment.reason or 'Routine Checkup'}",
            start_time=start_time,
            end_time=start_time + timedelta(minutes=30),
            status="scheduled",
            notes=f"Patient ID: {appointment.patient_id}"
        )
        db.add(schedule)
    
    await db.commit()
    return {"status": "Appointment Approved and Scheduled"}
