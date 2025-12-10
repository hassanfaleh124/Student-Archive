import type { Student, InsertStudent } from "@shared/schema";

const API_BASE = "/api";

export async function getAllStudents(): Promise<Student[]> {
  const response = await fetch(`${API_BASE}/students`);
  if (!response.ok) throw new Error("Failed to fetch students");
  return response.json();
}

export async function searchStudents(query: string): Promise<Student[]> {
  const response = await fetch(`${API_BASE}/students/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error("Failed to search students");
  return response.json();
}

export async function getStudent(id: string): Promise<Student> {
  const response = await fetch(`${API_BASE}/students/${id}`);
  if (!response.ok) throw new Error("Failed to fetch student");
  return response.json();
}

export async function createStudent(data: InsertStudent): Promise<Student> {
  const response = await fetch(`${API_BASE}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create student");
  return response.json();
}

export async function updateStudent(id: string, data: Partial<InsertStudent>): Promise<Student> {
  const response = await fetch(`${API_BASE}/students/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update student");
  return response.json();
}

export async function deleteStudent(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/students/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete student");
}
