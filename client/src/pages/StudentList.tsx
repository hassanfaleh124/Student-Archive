import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { searchStudents } from "@/lib/api";
import MobileLayout from "@/components/layout/MobileLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentList() {
  const [query, setQuery] = useState("");
  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students", query],
    queryFn: () => searchStudents(query),
  });

  return (
    <MobileLayout title="قائمة الطلاب">
      <div className="relative mb-6">
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="بحث عن طالب..."
          className="pr-10 h-12 rounded-2xl bg-white border-gray-100 shadow-sm focus-visible:ring-primary/20 text-right"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-testid="input-search"
        />
      </div>

      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-sm font-medium text-gray-500" data-testid="text-results-count">
          النتائج ({students.length})
        </span>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">جاري البحث...</h3>
          </div>
        ) : (
          <AnimatePresence>
            {students.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/student/${student.id}`}>
                  <div className="cursor-pointer" data-testid={`card-student-${student.id}`}>
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group bg-white">
                      <CardContent className="p-4 flex items-center gap-4 text-right" dir="rtl">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-sm ring-1 ring-gray-100">
                          <AvatarImage src={student.photoUrl || undefined} className="object-cover" />
                          <AvatarFallback className="bg-primary/5 text-primary text-lg font-bold">
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate text-lg mb-1 group-hover:text-primary transition-colors" data-testid={`text-name-${student.id}`}>
                            {student.name}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3 text-primary/70" />
                              <span>الأم: {student.motherName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-orange-400" />
                              <span>ص: {student.pageNumber}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end justify-center pl-2 border-l border-gray-50">
                          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">
                            رقم القيد
                          </span>
                          <span className="font-mono font-bold text-primary text-base" data-testid={`text-reg-${student.id}`}>
                            {student.registrationNumber}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {!isLoading && students.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">لم يتم العثور على نتائج</h3>
            <p className="text-gray-400 text-sm">جرب البحث بكلمات مختلفة</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
