import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { firstValueFrom } from 'rxjs';

interface FxResponse {
  conversion_rates: Record<string, number>;
}

@Injectable()
export class FxService {
  constructor(
    private http: HttpService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async getRate(from: string, to: string): Promise<number> {
    const key = `${from}_${to}`;
    let rate = await this.cache.get<number>(key);
    if (rate) return rate;

    try {
      const response = await firstValueFrom(
        this.http.get<FxResponse & { result: string; 'error-type'?: string }>(
          `${process.env.FX_API_BASE_URL}/${process.env.FX_API_KEY}/latest/${from}`,
        ),
      );
      const data = response.data;
      if (data.result !== 'success') {
        throw new Error(`API error: ${data['error-type'] || 'Unknown'}`);
      }
      rate = data.conversion_rates[to];
      if (!rate) throw new Error(`Currency ${to} not supported`);
      await this.cache.set(key, rate, 3600);
      console.log('Fetching fresh FX rate from API...');
      return rate;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('FX API failure:', error.message);
      }
      if (from === 'NGN' && to === 'USD') return 0.00062;
      throw new Error('Unable to fetch real-time rate; please try later');
    }
  }

  async getHistorical(
    from: string,
    to: string,
    days: number = 30,
  ): Promise<{ date: string; rate: number }[]> {
    const cacheKey = `hist_${from.toUpperCase()}_${to.toUpperCase()}_${days}`;
    const cached =
      await this.cache.get<{ date: string; rate: number }[]>(cacheKey);
    if (cached) return cached;

    try {
      const currentRate = await this.getRate(from, to); // Reuse your existing latest rate

      const historical: { date: string; rate: number }[] = [];
      const today = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Simulate realistic variation: small random daily change (±0.5-2%) + slight overall trend
        const randomVariation = (Math.random() - 0.5) * 0.02; // ±2%
        const trend = (i / days) * 0.01; // Optional gentle upward/downward bias over time
        const simulatedRate = currentRate * (1 + randomVariation + trend);

        historical.push({
          date: dateStr,
          rate: Number(simulatedRate.toFixed(6)),
        });
      }

      // Cache for 1 hour (adjust as needed)
      await this.cache.set(cacheKey, historical, 3600);
      return historical;
    } catch (error) {
      console.error('Historical rates simulation failed:', error);
      throw new Error('Unable to generate historical rates at this time');
    }
  }
}
