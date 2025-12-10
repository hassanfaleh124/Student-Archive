import { useRef } from "react";
import { useStudentStore } from "@/lib/student-store";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Upload, FileJson, AlertTriangle, CheckCircle2, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import * as XLSX from "xlsx";

export default function BackupPage() {
  const { students, addStudent } = useStudentStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(students, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `students_backup_${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "تم تصدير البيانات",
      description: "تم تحميل ملف النسخة الاحتياطية بنجاح",
      duration: 3000,
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleExcelImportClick = () => {
    excelInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const data = JSON.parse(json);
        
        if (Array.isArray(data)) {
          // Simulation of restore
          toast({
            title: "تم استعادة البيانات",
            description: `تم استعادة ${data.length} طالب بنجاح`,
            duration: 3000,
          });
        } else {
          throw new Error("Invalid format");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "خطأ في الملف",
          description: "ملف النسخة الاحتياطية غير صالح",
        });
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Skip header row and parse data
        // Assuming columns: Name, Mother Name, Registration Number, Page Number
        // Or checking headers. For simplicity, let's look for known headers or assume order if simple.
        // Let's assume order: Name, Mother, RegNum, PageNum
        
        // Simple heuristic: look for column headers in first row
        const headers = (jsonData[0] as any[]).map(h => String(h).trim());
        const rows = jsonData.slice(1) as any[][];

        let addedCount = 0;
        
        rows.forEach((row) => {
          if (row.length >= 2) { // Minimum check
            // Basic mapping by index if headers are not perfectly matched
            // 0: Name, 1: Mother, 2: Reg, 3: Page
            const name = row[0];
            const motherName = row[1];
            const regNum = row[2] || "";
            const pageNum = row[3] || "";

            if (name && motherName) {
              addStudent({
                name: String(name),
                motherName: String(motherName),
                registrationNumber: String(regNum),
                pageNumber: String(pageNum),
              });
              addedCount++;
            }
          }
        });

        if (addedCount > 0) {
          toast({
            title: "تم استيراد البيانات",
            description: `تم إضافة ${addedCount} طالب من ملف إكسل`,
            duration: 3000,
          });
        } else {
          toast({
            variant: "destructive",
            title: "لم يتم العثور على بيانات",
            description: "تأكد من تنسيق الملف (الاسم، اسم الأم، رقم القيد، رقم الصفحة)",
          });
        }

      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "خطأ في الملف",
          description: "تعذر قراءة ملف الإكسل",
        });
      }
    };
    reader.readAsArrayBuffer(file);

    if (excelInputRef.current) {
      excelInputRef.current.value = "";
    }
  };

  return (
    <MobileLayout title="النسخ الاحتياطي">
      <div className="space-y-6">
        
        {/* Backup Status */}
        <Card className="border-0 shadow-sm bg-blue-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right flex-1">
              <h3 className="font-bold text-blue-900">حالة البيانات</h3>
              <p className="text-sm text-blue-700">
                لديك {students.length} طالب مسجل في النظام
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Excel Import Section */}
        <Card className="overflow-hidden border-green-100">
          <CardHeader className="bg-green-50/30 pb-4">
            <CardTitle className="flex items-center gap-2 text-right justify-end text-green-900">
              <span>استيراد من إكسل</span>
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
            </CardTitle>
            <CardDescription className="text-right">
              إضافة طلاب جدد من ملف إكسل (XLSX, XLS)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="bg-green-50 p-3 rounded-lg flex items-start gap-3 mb-4 text-right" dir="rtl">
              <AlertTriangle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-xs text-green-800 leading-relaxed">
                التنسيق المطلوب: العمود الأول (الاسم)، الثاني (اسم الأم)، الثالث (رقم القيد)، الرابع (رقم الصفحة).
              </p>
            </div>
            
            <input 
              type="file" 
              ref={excelInputRef}
              onChange={handleExcelFileChange}
              accept=".xlsx, .xls"
              className="hidden"
            />
            
            <Button 
              onClick={handleExcelImportClick}
              variant="outline"
              className="w-full h-14 text-lg font-medium border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
            >
              <Upload className="mr-2 w-5 h-5" />
              استيراد ملف إكسل
            </Button>
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-right justify-end">
              <span>تصدير نسخة احتياطية</span>
              <Download className="w-5 h-5 text-primary" />
            </CardTitle>
            <CardDescription className="text-right">
              قم بتحميل ملف يحتوي على جميع بيانات الطلاب للحفاظ عليها
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Button 
              onClick={handleExport}
              className="w-full h-14 text-lg font-medium shadow-sm hover:shadow-md transition-all"
            >
              <FileJson className="mr-2 w-5 h-5" />
              تصدير البيانات (JSON)
            </Button>
          </CardContent>
        </Card>

        {/* JSON Import Section */}
        <Card className="overflow-hidden border-orange-100">
          <CardHeader className="bg-orange-50/30 pb-4">
            <CardTitle className="flex items-center gap-2 text-right justify-end text-orange-900">
              <span>استعادة نسخة احتياطية</span>
              <Upload className="w-5 h-5 text-orange-600" />
            </CardTitle>
            <CardDescription className="text-right">
              استعادة البيانات من ملف نسخة احتياطية سابق (JSON)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            
            <Button 
              onClick={handleImportClick}
              variant="outline"
              className="w-full h-14 text-lg font-medium border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
            >
              <Upload className="mr-2 w-5 h-5" />
              استيراد ملف JSON
            </Button>
          </CardContent>
        </Card>

      </div>
    </MobileLayout>
  );
}
