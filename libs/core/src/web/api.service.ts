import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class ApiService {
  private readonly axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL, // Set the base URL dynamically
    });
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get<T>(
        url,
        config,
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post<T>(
        url,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.put<T>(
        url,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.delete<T>(
        url,
        config,
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async downloadFile(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<Buffer> {
    try {
      const response: AxiosResponse<any> = await this.axiosInstance.get(url, {
        responseType: 'arraybuffer', // Use arraybuffer to handle binary data
        ...config,
      });

      return Buffer.from(response.data); // Convert the data to a Buffer and return it
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error.response) {
      throw new HttpException(error.response.data, error.response.status);
    } else if (error.request) {
      throw new HttpException(
        'No response received from the server',
        HttpStatus.GATEWAY_TIMEOUT,
      );
    } else {
      throw new HttpException(
        'Error in setting up the request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
