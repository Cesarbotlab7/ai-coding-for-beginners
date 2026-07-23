export type StageDefinition = {
  id: number;
  label: string;
  description: string;
};

export type LessonDefinition = {
  slug: string;
  order: number;
  stage: number;
};

export const STAGES: StageDefinition[] = [
  {
    id: 0,
    label: '先看懂',
    description: '先看一遍 WorkBuddy 怎么从一句话走到一个可验收的成品。',
  },
  {
    id: 1,
    label: '安全上手',
    description: '装好客户端，认识工作区、界面、工作模式和权限边界。',
  },
  {
    id: 2,
    label: '跑通第一单',
    description: '完成一个真实文件任务，并学会把要求说清楚、把结果验明白。',
  },
  {
    id: 3,
    label: '越用越顺手',
    description: '管理记忆，理解 Skill、专家和专家团的分工。',
  },
  {
    id: 4,
    label: '稳定放大',
    description: '先手动跑通，再接手机助理和自动化。',
  },
];

export const CURRICULUM: LessonDefinition[] = [
  { slug: 'what-is-workbuddy', order: 0, stage: 0 },
  { slug: 'install-workbuddy', order: 1, stage: 1 },
  { slug: 'safe-workspace', order: 2, stage: 1 },
  { slug: 'modes-and-permissions', order: 3, stage: 1 },
  { slug: 'interface-map', order: 4, stage: 1 },
  { slug: 'first-task', order: 5, stage: 2 },
  { slug: 'prompt-builder', order: 6, stage: 2 },
  { slug: 'verify-results', order: 7, stage: 2 },
  { slug: 'memory-review', order: 8, stage: 3 },
  { slug: 'skills-and-experts', order: 9, stage: 3 },
  { slug: 'automation-capstone', order: 10, stage: 4 },
];

export function getStageDefinition(stageId: number) {
  return STAGES.find((stage) => stage.id === stageId);
}

export function getAdjacentLessons(
  lessons: LessonDefinition[],
  slug: string,
): {
  previous: LessonDefinition | null;
  next: LessonDefinition | null;
} {
  const sorted = [...lessons].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((lesson) => lesson.slug === slug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: index > 0 ? sorted[index - 1] : null,
    next: index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}

export function validateCurriculum(
  lessons: LessonDefinition[],
  stages: StageDefinition[],
): string[] {
  const issues: string[] = [];
  const knownStages = new Set(stages.map((stage) => stage.id));
  const seenSlugs = new Set<string>();
  const seenOrders = new Set<number>();

  for (const lesson of lessons) {
    if (seenSlugs.has(lesson.slug)) {
      issues.push(`重复 slug：${lesson.slug}`);
    }
    seenSlugs.add(lesson.slug);

    if (seenOrders.has(lesson.order)) {
      issues.push(`重复顺序：${lesson.order}`);
    }
    seenOrders.add(lesson.order);

    if (!knownStages.has(lesson.stage)) {
      issues.push(`未知阶段：${lesson.stage}`);
    }
  }

  return issues;
}
