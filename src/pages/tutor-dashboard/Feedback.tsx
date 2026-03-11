
import React from "react";
import TutorDashboardLayout from "@/components/TutorDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Feedback = () => {
  return (
    <TutorDashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Student Feedback</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Student Reviews & Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your student feedback and reviews will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </TutorDashboardLayout>
  );
};

export default Feedback;
