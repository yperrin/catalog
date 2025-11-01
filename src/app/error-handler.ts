import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    alert('Oops! Something went wrong. Please try again later.');
    console.error(error);
  }
}
