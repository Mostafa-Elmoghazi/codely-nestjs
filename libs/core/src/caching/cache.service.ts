import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Set cache
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  // Get cache
  async get<T>(key: string): Promise<T | null> {
    return await this.cacheManager.get<T>(key);
  }

  // Get data from cache or execute the provided function and cache its result
  async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    // Try to get data from cache
    const cachedData = await this.get<T>(key);

    if (cachedData) {
      // If data is found in cache, return it
      return cachedData;
    }

    // If not found, call the provided function
    const result = await fn();

    // Store the result in cache
    await this.set(key, result, ttl);

    // Return the result
    return result;
  }

  // Delete cache
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  // Reset cache (clear all entries)
  async reset(): Promise<void> {
    await this.cacheManager.reset();
  }
}
