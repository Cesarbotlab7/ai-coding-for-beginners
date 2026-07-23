import { describe, expect, it } from 'vitest';
import {
  CURRICULUM,
  STAGES,
  getAdjacentLessons,
  validateCurriculum,
} from '../../src/lib/curriculum';

describe('WorkBuddy 课程结构', () => {
  it('由 5 个阶段和 11 个连续单元组成', () => {
    expect(STAGES).toHaveLength(5);
    expect(CURRICULUM).toHaveLength(11);
    expect(CURRICULUM.map((lesson) => lesson.order)).toEqual(
      Array.from({ length: 11 }, (_, index) => index),
    );
  });

  it('slug、顺序和阶段定义都没有冲突', () => {
    expect(validateCurriculum(CURRICULUM, STAGES)).toEqual([]);
  });

  it('能按真实 slug 计算上一章和下一章', () => {
    const middle = getAdjacentLessons(CURRICULUM, 'first-task');
    expect(middle.previous?.slug).toBe('interface-map');
    expect(middle.next?.slug).toBe('prompt-builder');

    const first = getAdjacentLessons(CURRICULUM, 'what-is-workbuddy');
    expect(first.previous).toBeNull();

    const last = getAdjacentLessons(CURRICULUM, 'automation-capstone');
    expect(last.next).toBeNull();
  });

  it('会报告重复 slug、重复顺序和未知阶段', () => {
    const broken = [
      CURRICULUM[0],
      { ...CURRICULUM[0] },
      { ...CURRICULUM[1], stage: 99 },
    ];

    expect(validateCurriculum(broken, STAGES)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('重复 slug'),
        expect.stringContaining('重复顺序'),
        expect.stringContaining('未知阶段'),
      ]),
    );
  });
});
