import { type Student, type InsertStudent, students } from "@shared/schema";
import { db } from "../db";
import { eq, or, ilike, desc } from "drizzle-orm";

export interface IStorage {
  getAllStudents(): Promise<Student[]>;
  getStudent(id: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, data: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<boolean>;
  searchStudents(query: string): Promise<Student[]>;
}

export class DatabaseStorage implements IStorage {
  async getAllStudents(): Promise<Student[]> {
    return await db.select().from(students).orderBy(desc(students.createdAt));
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
    return result[0];
  }

  async createStudent(studentData: InsertStudent): Promise<Student> {
    const result = await db
      .insert(students)
      .values({
        ...studentData,
        createdAt: Date.now(),
      })
      .returning();
    return result[0];
  }

  async updateStudent(id: string, data: Partial<InsertStudent>): Promise<Student | undefined> {
    const result = await db
      .update(students)
      .set(data)
      .where(eq(students.id, id))
      .returning();
    return result[0];
  }

  async deleteStudent(id: string): Promise<boolean> {
    const result = await db.delete(students).where(eq(students.id, id)).returning();
    return result.length > 0;
  }

  async searchStudents(query: string): Promise<Student[]> {
    if (!query) {
      return this.getAllStudents();
    }

    return await db
      .select()
      .from(students)
      .where(
        or(
          ilike(students.name, `%${query}%`),
          ilike(students.motherName, `%${query}%`),
          ilike(students.registrationNumber, `%${query}%`)
        )
      )
      .orderBy(desc(students.createdAt));
  }
}

export const storage = new DatabaseStorage();
