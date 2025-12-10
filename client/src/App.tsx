import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import StudentList from "@/pages/StudentList";
import AddStudent from "@/pages/AddStudent";

import StudentDetails from "@/pages/StudentDetails";
import BackupPage from "@/pages/BackupPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={StudentList} />
      <Route path="/students" component={StudentList} />
      <Route path="/add" component={AddStudent} />
      <Route path="/student/:id" component={StudentDetails} />
      <Route path="/backup" component={BackupPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
