import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Cache } from 'cache-manager';  // Use import type
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
        this.http.get(`${process.env.FX_API_BASE_URL}/${process.env.FX_API_KEY}/latest/${from}`),
      );
      const data = response.data;
      if (data.result !== 'success') {
        throw new Error(`API error: ${data['error-type'] || 'Unknown'}`);
      }
      rate = data.conversion_rates[to];
      if (!rate) throw new Error(`Currency ${to} not supported`);
      await this.cache.set(key, rate, 60);
      return rate;
    } catch (error) {
      console.error('FX API failure:', error.message, error.response?.data);
      if (from === 'NGN' && to === 'USD') return 0.00062;
      throw new Error('Unable to fetch real-time rate; please try later');
    }
  }
}