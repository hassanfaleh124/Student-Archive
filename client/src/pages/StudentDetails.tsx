import { useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { useStudentStore } from "@/lib/student-store";
import MobileLayout from "@/components/layout/MobileLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, User, BookOpen, Hash, Edit, Trash2, Camera } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function StudentDetails() {
  const [, params] = useRoute("/student/:id");
  const [, setLocation] = useLocation();
  const { students, updateStudent } = useStudentStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const studentId = params?.id;
  const student = students.find(s => s.id === studentId);

  if (!student) {
    return (
      <MobileLayout title="خطأ">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">الطالب غير موجود</h2>
          <Button onClick={() => setLocation("/students")} variant="outline">
            العودة للقائمة
          </Button>
        </div>
      </MobileLayout>
    );
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && studentId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateStudent(studentId, { photoUrl: reader.result as string });
        toast({
          title: "تم تحديث الصورة",
          description: "تم تغيير صورة الطالب بنجاح",
          duration: 3000,
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <MobileLayout title="تفاصيل الطالب">
      <div className="space-y-6">
        {/* Header / Back Button */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation("/students")}
            className="rounded-full hover:bg-gray-100"
          >
            <ArrowRight className="w-6 h-6 text-gray-600" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full">
              <Trash2 className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
              onClick={() => setLocation(`/edit/${student.id}`)}
            >
              <Edit className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center space-y-4"
        >
          <div className="relative group cursor-pointer" onClick={handleCameraClick}>
            <Avatar className="w-32 h-32 border-4 border-white shadow-xl ring-4 ring-primary/10 transition-transform group-hover:scale-105">
              <AvatarImage src={student.photoUrl} className="object-cover" />
              <AvatarFallback className="bg-primary/5 text-primary text-4xl font-bold">
                {student.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </div>

            <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white border-4 border-white rounded-full flex items-center justify-center shadow-md">
              <Camera className="w-4 h-4" />
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-gray-500 text-sm mt-1">تاريخ الإضافة: {format(student.createdAt, "d MMMM yyyy", { locale: ar })}</p>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-4 mt-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-0 flex items-stretch">
                <div className="bg-blue-50 w-12 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1 p-4 text-right">
                  <p className="text-xs text-gray-500 mb-1">اسم الأم</p>
                  <p className="font-medium text-gray-900">{student.motherName}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-sm overflow-hidden h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="bg-orange-50 p-3 flex justify-center">
                    <Hash className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="p-4 text-center flex-1 flex flex-col justify-center">
                    <p className="text-xs text-gray-500 mb-1">رقم القيد</p>
                    <p className="font-mono font-bold text-xl text-gray-900">{student.registrationNumber}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-sm overflow-hidden h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="bg-purple-50 p-3 flex justify-center">
                    <BookOpen className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="p-4 text-center flex-1 flex flex-col justify-center">
                    <p className="text-xs text-gray-500 mb-1">رقم الصفحة</p>
                    <p className="font-mono font-bold text-xl text-gray-900">{student.pageNumber}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
