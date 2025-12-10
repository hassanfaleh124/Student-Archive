import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useStudentStore } from "@/lib/student-store";
import MobileLayout from "@/components/layout/MobileLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  motherName: z.string().min(2, "اسم الأم مطلوب"),
  registrationNumber: z.string().min(1, "رقم القيد مطلوب"),
  pageNumber: z.string().min(1, "رقم الصفحة مطلوب"),
});

export default function AddStudent() {
  const [, setLocation] = useLocation();
  const { addStudent } = useStudentStore();
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      motherName: "",
      registrationNumber: "",
      pageNumber: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addStudent({
      ...values,
      photoUrl: photoPreview || undefined,
    });
    
    toast({
      title: "تمت الإضافة بنجاح",
      description: `تم إضافة الطالب ${values.name} إلى السجلات`,
      duration: 3000,
    });

    // Animate out or delay slightly
    setTimeout(() => setLocation("/students"), 500);
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <MobileLayout title="إضافة طالب">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
          
          {/* Photo Upload Section */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div 
              className="relative w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden cursor-pointer group transition-all hover:scale-105"
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-primary transition-colors">
                  <Camera className="w-10 h-10 mb-1" />
                  <span className="text-[10px] font-medium">إضافة صورة</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </div>

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الطالب</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم الطالب رباعي" {...field} className="text-right h-12 rounded-xl bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="motherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الأم</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم الأم" {...field} className="text-right h-12 rounded-xl bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم القيد</FormLabel>
                    <FormControl>
                      <Input placeholder="0000" type="number" {...field} className="text-center h-12 rounded-xl bg-white font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pageNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الصفحة</FormLabel>
                    <FormControl>
                      <Input placeholder="00" type="number" {...field} className="text-center h-12 rounded-xl bg-white font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>

          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-medium rounded-2xl shadow-lg shadow-primary/25 mt-8 hover:scale-[1.02] transition-transform"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            حفظ البيانات
          </Button>

        </form>
      </Form>
    </MobileLayout>
  );
}
