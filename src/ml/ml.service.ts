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

  async recommendWorkbooks(label: number): Promise<string[]> {
    const bookMap = {
      0: ['개념쎈', 'RPM 기초', '오투 중단원 정리'],
      1: ['기출 준킬러 정리집', '마플 BASIC', '쎈 중간 난도'],
      2: ['킬러문제집 A', '기출킬러 모음집', 'Final 모의고사'],
      3: ['실전 모의고사', '시간관리 전략서', '전략 풀이집'],
      4: ['고난도 모의고사', '심화 N제', '실력 점검 TEST'],
    };

    return bookMap[label] || ['추천할 교재 없음'];
  }
}
