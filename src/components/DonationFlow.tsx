
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export function DonationFlow() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <Card className="max-w-md mx-auto border-none shadow-2xl rounded-[3rem] p-12">
        <CardHeader>
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-headline">System Offline</CardTitle>
          <CardDescription>
            The payment system is currently unavailable.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            Please contact administration for manual participation.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
