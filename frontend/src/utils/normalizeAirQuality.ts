import { DataEntry } from "@/components/AirChart";

interface Measurement {
    created: string; // ISO date string
    pm1: number;
    pm25: number;
    pm10: number;
}

export function normalizeAirQuality(data: Measurement[]): { [key: string]: DataEntry[] } {
    const now = new Date();

    // Helper function to calculate mean
    const calculateMean = (values: number[]): number | null =>
        values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;

    // Grouping measurements into buckets
    const getClosestValues = (target: Date, range: number) => {
        const bucketStart = target.getTime();
        const bucketEnd = target.getTime() + range;

        return data.filter((m) => {
            const time = new Date(m.created).getTime();
            return time >= bucketStart && time <= bucketEnd;
        });
    };

    const createBucket = (target: Date, range: number) => {
        const measurements = getClosestValues(target, range);
        return {
            created: target,
            pm1: calculateMean(measurements.map((m) => m.pm1)),
            pm2_5: calculateMean(measurements.map((m) => m.pm25)),
            pm10: calculateMean(measurements.map((m) => m.pm10)),
        };
    };

    // 24-hour buckets (4 intervals: 0h, 6h, 12h, 18h, 24h)
    const hourlyBuckets = [...Array(5)].map((_, i) => {
        const target = new Date(now.getTime() - 3 * 60 * 60 * 1000 - i * 6 * 60 * 60 * 1000); // Decrement by 6 hours
        return createBucket(target, 6 * 60 * 60 * 1000); // 6-hour range
    });

    // 7-day buckets (daily)
    const dailyBuckets7d = [...Array(7)].map((_, i) => {
        const target = new Date(now.getTime() - i * 24 * 60 * 60 * 1000); // Decrement by 1 day
        target.setHours(0, 0, 0, 0); // Normalize to start of the day
        return createBucket(target, 24 * 60 * 60 * 1000); // 24-hour range
    });

    // 30-day buckets (daily)
    const dailyBuckets30d = [...Array(30)].map((_, i) => {
        const target = new Date(now.getTime() - i * 24 * 60 * 60 * 1000); // Decrement by 1 day
        target.setHours(0, 0, 0, 0); // Normalize to start of the day
        return createBucket(target, 24 * 60 * 60 * 1000); // 24-hour range
    });

    // 1-year buckets (monthly)
    const monthlyBuckets1y = [...Array(12)].map((_, i) => {
        const target = new Date(now);
        target.setMonth(target.getMonth() - i); // Decrement by 1 month
        target.setDate(1); // Normalize to the start of the month
        target.setHours(0, 0, 0, 0);
        return createBucket(target, 30 * 24 * 60 * 60 * 1000); // Approx. 1-month range
    });

    // 2-year buckets (monthly)
    const monthlyBuckets2y = [...Array(24)].map((_, i) => {
        const target = new Date(now);
        target.setMonth(target.getMonth() - i); // Decrement by 1 month
        target.setDate(1); // Normalize to the start of the month
        target.setHours(0, 0, 0, 0);
        return createBucket(target, 30 * 24 * 60 * 60 * 1000); // Approx. 1-month range
    });

    return {
        "24h": hourlyBuckets.reverse(),
        "7d": dailyBuckets7d.reverse(),
        "30d": dailyBuckets30d.reverse(),
        "1y": monthlyBuckets1y.reverse(),
        "2y": monthlyBuckets2y.reverse(),
    };
}
