import cron from 'node-cron';
import { EnrollmentService } from '../modules/enrollment/enrollment.service';

const enrollmentService = new EnrollmentService();

export function startEnrollmentCron() {
  // Run daily at 00:05 — generate sessions for active enrollments
  cron.schedule('5 0 * * *', async () => {
    console.log('[CRON] Generating enrollment sessions...');
    try {
      const count = await enrollmentService.generateAllActiveSessions();
      console.log(`[CRON] Generated ${count} sessions`);
    } catch (error) {
      console.error('[CRON] Failed to generate sessions:', error);
    }
  });

  // Run every hour — mark past confirmed sessions as COMPLETED
  cron.schedule('0 * * * *', async () => {
    try {
      const count = await enrollmentService.completePassedSessions();
      if (count > 0) {
        console.log(`[CRON] Completed ${count} past sessions`);
      }
    } catch (error) {
      console.error('[CRON] Failed to complete sessions:', error);
    }
  });

  console.log('[CRON] Enrollment cron jobs scheduled (generation daily 00:05, completion hourly)');
}
