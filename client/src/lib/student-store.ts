import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Student {
  id: string;
  name: string;
  motherName: string;
  registrationNumber: string;
  pageNumber: string;
  photoUrl?: string;
  createdAt: number;
}

interface StudentStore {
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'createdAt'>) => void;
  updateStudent: (id: string, data: Partial<Omit<Student, 'id' | 'createdAt'>>) => void;
  deleteStudent: (id: string) => void;
  searchStudents: (query: string) => Student[];
}

export const useStudentStore = create<StudentStore>()(
  persist(
    (set, get) => ({
      students: [
        {
          id: '1',
          name: 'أحمد محمد علي',
          motherName: 'فاطمة حسن',
          registrationNumber: '2023001',
          pageNumber: '12',
          createdAt: Date.now(),
        },
        {
          id: '2',
          name: 'سارة إبراهيم يوسف',
          motherName: 'زينب محمود',
          registrationNumber: '2023002',
          pageNumber: '15',
          createdAt: Date.now() - 10000,
        },
        {
          id: '3',
          name: 'عمر خالد عبدالعزيز',
          motherName: 'مريم أحمد',
          registrationNumber: '2023003',
          pageNumber: '18',
          createdAt: Date.now() - 20000,
        },
      ],
      addStudent: (studentData) =>
        set((state) => ({
          students: [
            {
              ...studentData,
              id: Math.random().toString(36).substring(7),
              createdAt: Date.now(),
            },
            ...state.students,
          ],
        })),
      updateStudent: (id, data) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        })),
      deleteStudent: (id) =>
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
        })),
      searchStudents: (query) => {
        const { students } = get();
        if (!query) return students;
        const lowerQuery = query.toLowerCase();
        return students.filter(
          (s) =>
            s.name.toLowerCase().includes(lowerQuery) ||
            s.motherName.toLowerCase().includes(lowerQuery) ||
            s.registrationNumber.includes(lowerQuery)
        );
      },
    }),
    {
      name: 'student-storage',
    }
  )
);
