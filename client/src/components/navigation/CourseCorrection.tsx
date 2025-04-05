import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CompassIcon, RefreshCw, ArrowRightLeft, Clock, Navigation } from 'lucide-react';

interface CourseData {
  current: {
    heading: number;
    maintainedFor: string;
  };
  recommended: {
    heading: number;
    reason: string;
  };
  deviation: number;
  eta?: {
    destination: string;
    time: string;
  };
}

interface CourseCorrectionProps {
  courseData: CourseData;
  onApplyCorrection: () => void;
  onIgnoreRecommendation: () => void;
}

export default function CourseCorrection({
  courseData,
  onApplyCorrection,
  onIgnoreRecommendation
}: CourseCorrectionProps) {
  // Determine severity level based on deviation
  const getSeverityLevel = (deviation: number) => {
    if (deviation < 3) return { color: 'text-green-500', class: 'bg-green-950/20' };
    if (deviation < 10) return { color: 'text-amber-500', class: 'bg-amber-950/20' };
    return { color: 'text-red-500', class: 'bg-red-950/20' };
  };

  const severity = getSeverityLevel(courseData.deviation);

  return (
    <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <CompassIcon className="w-5 h-5 mr-2" /> Course Correction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current heading section */}
          <div className="p-3 bg-[#1B263B] rounded-md">
            <div className="text-sm font-medium mb-1 flex items-center">
              <Navigation className="h-4 w-4 mr-1" />
              Current Heading
            </div>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">{courseData.current.heading}°</div>
              <div className="text-xs text-[#778DA9] ml-2 flex items-center">
                <RefreshCw className="h-3 w-3 mr-1" /> 
                {courseData.current.maintainedFor}
              </div>
            </div>
          </div>

          {/* Recommended heading section */}
          <div className={`p-3 rounded-md ${severity.class} border border-${severity.color.replace('text-', '')}`}>
            <div className={`text-sm font-medium mb-1 flex items-center ${severity.color}`}>
              <ArrowRightLeft className="h-4 w-4 mr-1" />
              Recommended Heading
            </div>
            <div className="flex items-baseline">
              <div className={`text-3xl font-bold ${severity.color}`}>{courseData.recommended.heading}°</div>
              <div className={`text-xs ml-2 flex items-center ${severity.color} opacity-80`}>
                {Math.abs(courseData.deviation)}° deviation
              </div>
            </div>
            <div className="text-xs mt-1">{courseData.recommended.reason}</div>
          </div>

          {/* ETA info if available */}
          {courseData.eta && (
            <div className="p-3 bg-[#1B263B] rounded-md">
              <div className="text-sm font-medium mb-1 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                ETA to {courseData.eta.destination}
              </div>
              <div className="text-xl font-bold">{courseData.eta.time}</div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={onApplyCorrection}
              className="flex-1 bg-[#415A77] hover:bg-[#778DA9]"
            >
              Apply Correction
            </Button>
            <Button 
              onClick={onIgnoreRecommendation}
              variant="outline" 
              className="flex-1 border-[#415A77] text-[#E0E1DD] hover:bg-[#1B263B]"
            >
              Ignore
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}