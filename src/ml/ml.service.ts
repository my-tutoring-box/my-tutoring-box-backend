import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MlService {
  async predictStudentType(answers: number[]): Promise<any> {
    const url = 'http://localhost:8000/predict';

    try {
      const response = await axios.post(url, {
        answers: answers,
      });

      return response.data;
    } catch (error) {
      console.error('ML 서버 호출 실패:', error.message);
      throw error;
    }
  }
}
