import { useState, useEffect } from "react";
import { Link } from "wouter";
import MobileLayou from "@/components/layout/MobileLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { database } from '../firebaseConfig.ts'; 
import { ref, onValue } from 'firebase/database';

export default function StudentList() {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const studentsRef = ref(database, 'students');
    const unsubscribe = onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const studentList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        const filtered = query 
          ? studentList.filter(s => s.name?.toLowerCase().includes(query.toLowerCase())) 
          : studentList;
        setStudents(filtered);
      } else {
        setStudents([]);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [query]);

  return (
    <MobileLayout title="قائمة الطلاب">
      <div className="relative mb-6">
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="بحث عن طالب..."
          className="pr-10 h-12 rounded-2xl bg-white border-gray-100 shadow-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">جاري التحميل...</div>
        ) : (
          <AnimatePresence>
            {students.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Link href={`/student/${student.id}`}>
                  <Card className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4 text-right" dir="rtl">
                      <Avatar className="h-14 w-14 border-2 border-white shadow-sm ring-1 ring-gray-100">
                        <AvatarImage src={student.photoUrl} />
                        <AvatarFallback className="bg-primary/5 text-primary text-lg font-bold">
                          {student.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 text-right">
                        <h3 className="font-bold text-gray-900 truncate">{student.name}</h3>
                        <p className="text-sm text-gray-500">{student.registrationNumber}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </MobileLayout>
  );
}
