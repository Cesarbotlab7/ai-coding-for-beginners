export type PromptDraft = {
  goal: string;
  input: string;
  steps: string;
  output: string;
  acceptance: string;
};

export type TaskProfile = {
  modifiesFiles: boolean;
  multiStep: boolean;
  highRisk: boolean;
  reversible: boolean;
};

export type AutomationChecklist = {
  manualRunPassed: boolean;
  outputVerified: boolean;
  absolutePath: boolean;
  computerAwake: boolean;
  clientRunning: boolean;
};

const PROMPT_FIELDS: Array<{
  key: keyof PromptDraft;
  label: string;
  heading: string;
}> = [
  { key: 'goal', label: '目标', heading: '目标' },
  { key: 'input', label: '素材', heading: '输入素材' },
  { key: 'steps', label: '步骤', heading: '处理要求' },
  { key: 'output', label: '输出', heading: '输出格式' },
  { key: 'acceptance', label: '验收', heading: '验收标准' },
];

function hasValue(value: string) {
  return value.trim().length > 0;
}

export function scorePromptDraft(draft: PromptDraft): {
  score: number;
  missing: string[];
} {
  const missing = PROMPT_FIELDS.filter(({ key }) => !hasValue(draft[key])).map(
    ({ label }) => label,
  );

  return {
    score: (PROMPT_FIELDS.length - missing.length) * 20,
    missing,
  };
}

export function buildPrompt(draft: PromptDraft): string {
  return PROMPT_FIELDS.filter(({ key }) => hasValue(draft[key]))
    .map(({ key, heading }) => `${heading}：${draft[key].trim()}`)
    .join('\n');
}

export function recommendTaskSetup(profile: TaskProfile): {
  workMode: 'Ask' | 'Plan' | 'Craft';
  permissionMode: '默认权限';
  reason: string;
} {
  if (!profile.modifiesFiles) {
    return {
      workMode: 'Ask',
      permissionMode: '默认权限',
      reason: '先了解信息，不需要修改文件。',
    };
  }

  if (profile.highRisk || !profile.reversible) {
    return {
      workMode: 'Plan',
      permissionMode: '默认权限',
      reason: '任务风险较高，先备份或使用副本，并逐步确认。',
    };
  }

  if (profile.multiStep) {
    return {
      workMode: 'Plan',
      permissionMode: '默认权限',
      reason: '任务会修改文件且包含多个步骤，先审查计划再执行。',
    };
  }

  return {
    workMode: 'Craft',
    permissionMode: '默认权限',
    reason: '任务单一且可恢复，可以直接执行，但仍保留安全确认。',
  };
}

export function assessAutomationReadiness(
  checklist: AutomationChecklist,
): {
  ready: boolean;
  issues: string[];
} {
  const checks: Array<[keyof AutomationChecklist, string]> = [
    ['manualRunPassed', '先手动跑通一次任务'],
    ['outputVerified', '先人工验收输出'],
    ['absolutePath', '文件路径改为绝对路径'],
    ['computerAwake', '关闭电脑休眠'],
    ['clientRunning', '保持 WorkBuddy 运行'],
  ];
  const issues = checks
    .filter(([key]) => !checklist[key])
    .map(([, issue]) => issue);

  return {
    ready: issues.length === 0,
    issues,
  };
}
