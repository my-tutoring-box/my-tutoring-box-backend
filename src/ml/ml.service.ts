import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PredictedTypeDto } from './dto/predicted-type.dto';

@Injectable()
export class MlService {
  async predictStudentType(answers: number[]): Promise<PredictedTypeDto> {
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
